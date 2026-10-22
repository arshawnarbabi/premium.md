#!/usr/bin/env bash
# Regenerate the skill's bundled reference/ from the repo's CANONICAL sources.
#
# The Agent Skill must be SELF-CONTAINED so it installs cleanly as a Claude Code plugin
# AND drops into Codex's ~/.agents/skills/ as one unit. But the canonical home for these
# files stays at the repo root — skills/premium-md/reference/ is a GENERATED MIRROR,
# exactly like the release zip. Re-run this whenever templates/, research.md, docs/,
# or the brand-kit scripts change, then commit the regenerated reference/.
#
# reference/brand-kit/ mirrors the tools/brand-kit/ layout for exactly the files the
# scripts need (scripts/*.ts, scripts/vendor/yaml.mjs, src/lib/oklch.ts), so every
# relative import resolves unchanged and the scripts run on plain `node` (>= 22.18,
# built-in type stripping) with no npm install. reference/qa-harness/ and reference/doc-sync/ sit
# beside reference/brand-kit/ exactly as tools/qa-harness/ and tools/doc-sync/ sit beside
# tools/brand-kit/, so their import of ../brand-kit/scripts/vendor/yaml.mjs resolves in both places.
# The build ends with a smoke test that runs every script from the bundle and fails the build if
# any of them breaks.
#
# Usage: scripts/build-skill.sh
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
REF="$REPO/skills/premium-md/reference"
KIT="$REPO/tools/brand-kit"

rm -rf "$REF"
mkdir -p "$REF/templates" "$REF/docs" "$REF/brand-kit/scripts/vendor" "$REF/brand-kit/src/lib" "$REF/qa-harness" "$REF/doc-sync"

cp "$REPO"/templates/*_TEMPLATE*.md "$REF/templates/"            # the 10 templates
cp "$REPO"/research.md              "$REF/"                      # the deep research
cp "$REPO"/docs/SYSTEM_RESEARCH.md  "$REF/docs/"                 # workflow research the templates cite
cp "$KIT"/scripts/*.ts              "$REF/brand-kit/scripts/"    # the Node scripts
cp "$KIT"/scripts/vendor/yaml.mjs   "$REF/brand-kit/scripts/vendor/"  # vendored YAML parser (ISC)
cp "$KIT"/src/lib/oklch.ts          "$REF/brand-kit/src/lib/"    # OKLCH/APCA library generate-palette.ts imports
cp "$KIT"/README.md                 "$REF/brand-kit/"
cp "$REPO"/tools/qa-harness/run-qa.mjs "$REPO"/tools/qa-harness/README.md "$REF/qa-harness/"      # QA Gates E, E2, A, B, B2
cp "$REPO"/tools/doc-sync/check-drift.mjs "$REPO"/tools/doc-sync/README.md "$REF/doc-sync/"     # QA Gate H

# ── Smoke test: every bundled script runs on plain node, from the bundle, on sample input ──
NODE_VERSION="$(node -p 'process.versions.node')"
node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=18)?0:1)' \
  || { echo "Node >= 22.18 required (found $NODE_VERSION)"; exit 1; }
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
( cd "$TMP"
  node "$REF/brand-kit/scripts/generate-palette.ts" --base "oklch(0.55 0.12 162)" > palette.yaml 2> apca.txt
  node "$REF/brand-kit/scripts/export-tokens.ts" --design "$KIT/sample/DESIGN.md" --out "$TMP/tokens" > /dev/null
  node "$REF/brand-kit/scripts/load-tokens.ts" --design "$KIT/sample/DESIGN.md" \
       --information "$KIT/sample/INFORMATION.md" --out "$TMP/data" > /dev/null
  test -s palette.yaml && test -s tokens/tokens.css && test -s tokens/theme.css && test -s tokens/tokens.json \
    && test -s data/tokens.json && test -s data/brand.json
  if grep -nE -- '--[a-z0-9_-]*\.[0-9]' tokens/tokens.css tokens/theme.css; then
    echo "export-tokens emitted a custom property name containing a dot"; exit 1
  fi
  grep -q -- '--tracking-' tokens/tokens.css || { echo "export-tokens emitted no letter_spacing (--tracking-*)"; exit 1; }
  # a dark-mode role override (`dark:` map inside a role group, the documented form) lands in the dark block
  printf -- '---\ncolors:\n  neutral: { 1: "oklch(0.99 0 0)", 6: "oklch(0.8 0 0)", 7: "oklch(0.7 0 0)", dark: { 1: "oklch(0.18 0 0)", 6: "oklch(0.3 0 0)", 7: "oklch(0.4 0 0)" } }\n  border: { subtle: "{colors.neutral.6}", dark: { subtle: "{colors.neutral.7}" } }\ntypography:\n  roles: { heading-5.5xl: { size: 88, weight: 700, letter_spacing: "-0.02em" } }\n---\n' > dark.md
  node "$REF/brand-kit/scripts/export-tokens.ts" --design dark.md --out "$TMP/dark" > /dev/null
  sed -n '/data-theme="dark"/,$p' dark/tokens.css | grep -q -- '--border-subtle: var(--neutral-7)' \
    || { cat dark/tokens.css; echo "export-tokens dropped a dark role override"; exit 1; }
  node -e 'const t=require(process.argv[1]); const bad=[]; (function w(o,p){for(const k in o){if(k.startsWith("$"))continue; if(k.includes("."))bad.push(p+k); if(o[k]&&typeof o[k]==="object")w(o[k],p+k+"/")}})(t,""); if(bad.length){console.log(bad);process.exit(1)}' "$TMP/dark/tokens.json" \
    || { echo "export-tokens wrote a DTCG token name containing a dot"; exit 1; }
) || { echo "Smoke test FAILED: a bundled brand-kit script does not run standalone"; exit 1; }

# qa-harness: --help needs neither Playwright nor a site, so it proves the bundled file loads.
node "$REF/qa-harness/run-qa.mjs" --help | grep -q -- '--url' \
  || { echo "Smoke test FAILED: bundled qa-harness/run-qa.mjs --help"; exit 1; }

# doc-sync on a tiny fixture: clean must exit 0; a copy edit made only in code, and a code change
# with no doc change, must each exit 1.
( F="$TMP/drift-fixture"; mkdir -p "$F/src" "$F/design-tokens"; cd "$F"
  printf -- '---\nfile_role: "project"\n---\n# Project\n' > PROJECT.md
  printf -- '---\nfile_role: "design"\n---\n# Design\n' > DESIGN.md
  printf -- '---\npages:\n  home:\n    hero:\n      headline: "Coffee roasted every Thursday"\n      copy: "Small batches, shipped the same day."\n      cta: { label: "<Order now>" }\n---\n# Spec\n' > SPEC.md
  printf 'export const Hero = () => <><h1>Coffee roasted every\n  Thursday</h1><p>Small batches, shipped the same day.</p></>;\n' > src/Hero.tsx
  sleep 1; printf '/* Generated from DESIGN.md by export-tokens.ts */\n:root {}\n' > design-tokens/tokens.css
  node "$REF/doc-sync/check-drift.mjs" --root . > clean.txt || { cat clean.txt; echo "clean fixture reported drift"; exit 1; }
  grep -q 'COPY    ok: 2 strings checked' clean.txt || { cat clean.txt; echo "default copy keys did not pick up headline and copy"; exit 1; }
  sed -i.bak 's/every/each/' src/Hero.tsx && rm src/Hero.tsx.bak
  if node "$REF/doc-sync/check-drift.mjs" --root . > copy.txt; then cat copy.txt; echo "copy drift not caught"; exit 1; fi
  grep -q 'COPY    DRIFT' copy.txt || { cat copy.txt; exit 1; }
  sed -i.bak 's/each/every/' src/Hero.tsx && rm src/Hero.tsx.bak
  git init -q . && git add -A && git -c user.name=smoke -c user.email=smoke@example.com commit -qm docs+code
  node "$REF/doc-sync/check-drift.mjs" --root . > git-clean.txt || { cat git-clean.txt; echo "committed fixture reported drift"; exit 1; }
  printf 'export const More = 1;\n' > src/More.ts
  if node "$REF/doc-sync/check-drift.mjs" --root . > git.txt; then cat git.txt; echo "code-without-doc change not caught"; exit 1; fi
  grep -q 'GIT     DRIFT' git.txt || { cat git.txt; exit 1; }
) || { echo "Smoke test FAILED: bundled doc-sync/check-drift.mjs"; exit 1; }

echo "Built skill reference at: $REF (smoke test passed: brand-kit, qa-harness and doc-sync run on node $NODE_VERSION)"
echo "Files:"
( cd "$REF" && find . -type f | sort | sed 's/^/  /' )
