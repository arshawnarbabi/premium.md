#!/usr/bin/env bash
# Curated release asset: the six templates + research + LICENSE only.
# Usage: ./make-release-zip.sh v1.3.0
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
VERSION="${1:-vX.Y.Z}"
OUT="$REPO/premium-product-templates-${VERSION}.zip"
STAGE="$(mktemp -d)"
cp "$REPO"/*_TEMPLATE*.md "$STAGE/"
cp "$REPO"/research.md "$STAGE/"
cp "$REPO"/LICENSE "$STAGE/"
rm -f "$OUT"
( cd "$STAGE" && zip -rq "$OUT" . -x '*.DS_Store' )
rm -rf "$STAGE"
echo "Built: $OUT"; unzip -l "$OUT"
