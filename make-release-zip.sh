#!/usr/bin/env bash
# Curated release asset: the six templates + research + README + LICENSE only.
# (Matches what GitHub's auto-generated source archive ships, per .gitattributes —
#  i.e. excludes tools/, the banner, and the build/dev scripts.)
# Usage: ./make-release-zip.sh v1.3.0
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
VERSION="${1:-vX.Y.Z}"
OUT="$REPO/premium-product-templates-${VERSION}.zip"
STAGE="$(mktemp -d)"
cp "$REPO"/*_TEMPLATE*.md "$STAGE/"
cp "$REPO"/research.md "$STAGE/"
cp "$REPO"/README.md "$STAGE/"
cp "$REPO"/LICENSE "$STAGE/"
rm -f "$OUT"
( cd "$STAGE" && zip -rq "$OUT" . -x '*.DS_Store' )
rm -rf "$STAGE"
echo "Built: $OUT"; unzip -l "$OUT"
