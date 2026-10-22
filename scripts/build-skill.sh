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
# built-in type stripping) with no npm install. The build ends with a smoke test that
# runs all three scripts from the bundle and fails the build if any of them breaks.
#
# Usage: scripts/build-skill.sh
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
REF="$REPO/skills/premium-md/reference"
KIT="$REPO/tools/brand-kit"

rm -rf "$REF"
mkdir -p "$REF/templates" "$REF/docs" "$REF/brand-kit/scripts/vendor" "$REF/brand-kit/src/lib"

cp "$REPO"/templates/*_TEMPLATE*.md "$REF/templates/"            # the 10 templates
cp "$REPO"/research.md              "$REF/"                      # the deep research
cp "$REPO"/docs/SYSTEM_RESEARCH.md  "$REF/docs/"                 # workflow research the templates cite
cp "$KIT"/scripts/*.ts              "$REF/brand-kit/scripts/"    # the Node scripts
cp "$KIT"/scripts/vendor/yaml.mjs   "$REF/brand-kit/scripts/vendor/"  # vendored YAML parser (ISC)
cp "$KIT"/src/lib/oklch.ts          "$REF/brand-kit/src/lib/"    # OKLCH/APCA library generate-palette.ts imports
cp "$KIT"/README.md                 "$REF/brand-kit/"

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
) || { echo "Smoke test FAILED: a bundled brand-kit script does not run standalone"; exit 1; }

echo "Built skill reference at: $REF (smoke test passed: all three scripts run on node $NODE_VERSION)"
echo "Files:"
( cd "$REF" && find . -type f | sort | sed 's/^/  /' )
