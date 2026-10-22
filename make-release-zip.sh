#!/usr/bin/env bash
# Curated release asset: all markdown templates + research + docs/SYSTEM_RESEARCH.md + README + LICENSE.
# The repo organizes templates under templates/ for browsing; this FLATTENS them back
# into one folder so the download stays flat (instance files are flat siblings).
# docs/SYSTEM_RESEARCH.md ships at docs/ inside the zip because the templates cite it at that path.
# Excludes tools/, the banner, and the build/dev scripts.
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
rm -f "$OUT"
( cd "$STAGE" && zip -rq "$OUT" . -x '*.DS_Store' )
rm -rf "$STAGE"
echo "Built: $OUT"; unzip -l "$OUT"
