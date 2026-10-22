#!/usr/bin/env bash
# Curated release asset: all markdown templates + research + docs/SYSTEM_RESEARCH.md + README + LICENSE
# + the QA harness and doc-sync checkers.
# The repo organizes templates under templates/ for browsing; this FLATTENS them back
# into one folder so the download stays flat (instance files are flat siblings).
# docs/SYSTEM_RESEARCH.md ships at docs/ inside the zip because the templates cite it at that path.
# Ships the two checkers under tools/ (qa-harness = QA Gates E/E2/A/B/B2, doc-sync = QA Gate H) with
# the one brand-kit file they import (scripts/vendor/yaml.mjs), in the repo's own layout, so
# `node tools/qa-harness/run-qa.mjs` and `node tools/doc-sync/check-drift.mjs` run from the unzipped
# folder. Excludes the rest of tools/brand-kit (the viewer app), the banner, and the build/dev scripts.
# Usage: ./make-release-zip.sh v1.3.0
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
VERSION="${1:-vX.Y.Z}"
OUT="$REPO/premium.md-${VERSION}.zip"
STAGE="$(mktemp -d)"
cp "$REPO"/templates/*_TEMPLATE*.md "$STAGE/"   # flatten templates/ into the zip root
cp "$REPO"/research.md "$STAGE/"
mkdir -p "$STAGE/docs" && cp "$REPO"/docs/SYSTEM_RESEARCH.md "$STAGE/docs/"   # cited by DECISIONS / CONTENT / QA
cp "$REPO"/README.md "$STAGE/"
cp "$REPO"/LICENSE "$STAGE/"
mkdir -p "$STAGE/tools/qa-harness" "$STAGE/tools/doc-sync" "$STAGE/tools/brand-kit/scripts/vendor"
cp "$REPO"/tools/qa-harness/run-qa.mjs "$REPO"/tools/qa-harness/README.md "$STAGE/tools/qa-harness/"
cp "$REPO"/tools/doc-sync/check-drift.mjs "$REPO"/tools/doc-sync/README.md "$STAGE/tools/doc-sync/"
cp "$REPO"/tools/brand-kit/scripts/vendor/yaml.mjs "$STAGE/tools/brand-kit/scripts/vendor/"   # the YAML parser both import
rm -f "$OUT"
( cd "$STAGE" && zip -rq "$OUT" . -x '*.DS_Store' )
rm -rf "$STAGE"
echo "Built: $OUT"; unzip -l "$OUT"
