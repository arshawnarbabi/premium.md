#!/usr/bin/env bash
# Curated release asset: all markdown templates + research + README + LICENSE only.
# The repo organizes templates under templates/ for browsing; this FLATTENS them back
# into one folder so the download stays flat (instance files are flat siblings).
# Excludes tools/, docs/, the banner, and the build/dev scripts.
# Usage: ./make-release-zip.sh v1.3.0
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
VERSION="${1:-vX.Y.Z}"
OUT="$REPO/premium-product-templates-${VERSION}.zip"
STAGE="$(mktemp -d)"
cp "$REPO"/templates/*_TEMPLATE*.md "$STAGE/"   # flatten templates/ into the zip root
cp "$REPO"/research.md "$STAGE/"
cp "$REPO"/README.md "$STAGE/"
cp "$REPO"/LICENSE "$STAGE/"
rm -f "$OUT"
( cd "$STAGE" && zip -rq "$OUT" . -x '*.DS_Store' )
rm -rf "$STAGE"
echo "Built: $OUT"; unzip -l "$OUT"
