#!/usr/bin/env bash
# Regenerate the skill's bundled reference/ from the repo's CANONICAL sources.
#
# The Agent Skill must be SELF-CONTAINED so it installs cleanly as a Claude Code plugin
# AND drops into Codex's ~/.agents/skills/ as one unit. But the canonical home for these
# files stays at the repo root — skills/premium-md/reference/ is a GENERATED MIRROR,
# exactly like the release zip. Re-run this whenever templates/, research.md, or the
# brand-kit scripts change, then commit the regenerated reference/.
#
# Usage: scripts/build-skill.sh
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
REF="$REPO/skills/premium-md/reference"

rm -rf "$REF"
mkdir -p "$REF/templates" "$REF/brand-kit"

cp "$REPO"/templates/*_TEMPLATE*.md "$REF/templates/"     # the 10 templates
cp "$REPO"/research.md              "$REF/"               # the deep research
cp "$REPO"/tools/brand-kit/scripts/*.ts "$REF/brand-kit/" # dependency-free Node scripts
cp "$REPO"/tools/brand-kit/README.md    "$REF/brand-kit/" 2>/dev/null || true

echo "Built skill reference at: $REF"
echo "Files:"
( cd "$REF" && find . -type f | sort | sed 's/^/  /' )
