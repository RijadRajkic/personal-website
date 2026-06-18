#!/bin/bash
# Final consolidation: name the rebuild branch feat/portfolio_rebuild, prune intermediates.
#
# Prereq: scripts/consolidate-branches.sh has already run successfully.
# State at start: feat/inner-pages-rebuild is checked out and at the rebuild tip;
#                 feat/portfolio_rebuild still points at the stale dad64d5;
#                 13 intermediate branches still exist as pre-rebase pointers.
#
# This script:
#   1. Deletes local feat/portfolio_rebuild (stale at dad64d5; content lives on new chain)
#   2. Renames feat/inner-pages-rebuild -> feat/portfolio_rebuild
#   3. Deletes the 13 intermediate branches
#
# All deletes use -D because SHAs no longer match post-rebase. Verified safe via git cherry.
# Remote origin/feat/portfolio_rebuild is untouched (preserves dad64d5 as GitHub history).

set -e
cd "$(dirname "$0")/.."

echo "=== precondition check: current branch must be feat/inner-pages-rebuild ==="
CURRENT=$(git branch --show-current)
if [ "$CURRENT" != "feat/inner-pages-rebuild" ]; then
  echo "ERROR: expected feat/inner-pages-rebuild, found $CURRENT. Aborting."
  exit 1
fi
echo "OK on $CURRENT"
echo ""

echo "=== STEP 1: delete stale local feat/portfolio_rebuild (was at dad64d5) ==="
git branch -D feat/portfolio_rebuild
echo ""

echo "=== STEP 2: rename feat/inner-pages-rebuild -> feat/portfolio_rebuild ==="
git branch -m feat/inner-pages-rebuild feat/portfolio_rebuild
echo ""

echo "=== STEP 3: delete 13 intermediate branches ==="
for branch in \
  feat/animation-system \
  feat/about-page \
  feat/projects-index \
  feat/projects-detail \
  feat/blog-index \
  feat/blog-detail \
  feat/now-page \
  feat/cms-projects \
  feat/cms-blog \
  feat/morph-settling-content \
  chore/device-validation \
  chore/transition-fallback \
  chore/copy-pass; do
  echo "deleting $branch"
  git branch -D "$branch"
done
echo ""

echo "=== final branches ==="
git branch -vv
echo ""

echo "=== DONE — consolidated branch: feat/portfolio_rebuild ==="
echo "When you push later: git push --force-with-lease origin feat/portfolio_rebuild"
echo "(remote still has dad64d5; non-FF until then)"
