#!/bin/bash
# Force-push feat/portfolio_rebuild to origin (overwriting stale dad64d5),
# then open a PR against main.
#
# --force-with-lease is safe: it will refuse if someone else has pushed to
# the remote branch since we last fetched. PR #3 already merged the
# substantive content of dad64d5 into main, so nothing of value is lost
# on the remote.

set -e
cd "$(dirname "$0")/.."

echo "=== precondition: must be on feat/portfolio_rebuild ==="
CURRENT=$(git branch --show-current)
if [ "$CURRENT" != "feat/portfolio_rebuild" ]; then
  echo "ERROR: expected feat/portfolio_rebuild, found $CURRENT. Aborting."
  exit 1
fi
echo "OK"
echo ""

echo "=== STEP 1: fetch to ensure --force-with-lease has fresh state ==="
git fetch origin
echo ""

echo "=== STEP 2: force-push to origin/feat/portfolio_rebuild ==="
git push --force-with-lease origin feat/portfolio_rebuild
echo ""

echo "=== STEP 3: open PR ==="
PR_TITLE="feat: inner-pages rebuild (PRJ-32..PRJ-46)"
PR_BODY_FILE="scripts/pr-body.md"

if [ ! -f "$PR_BODY_FILE" ]; then
  echo "ERROR: $PR_BODY_FILE not found. Aborting."
  exit 1
fi

if command -v gh >/dev/null 2>&1; then
  echo "gh CLI found — creating PR via gh"
  gh pr create \
    --base main \
    --head feat/portfolio_rebuild \
    --title "$PR_TITLE" \
    --body-file "$PR_BODY_FILE"
else
  echo "gh CLI not found — open the PR manually via this URL:"
  echo ""
  echo "  https://github.com/RijadRajkic/personal-website/compare/main...feat/portfolio_rebuild?expand=1"
  echo ""
  echo "Suggested title:"
  echo "  $PR_TITLE"
  echo ""
  echo "Suggested body is in $PR_BODY_FILE — paste it into the PR description."
fi

echo ""
echo "=== DONE ==="
