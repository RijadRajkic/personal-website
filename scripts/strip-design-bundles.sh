#!/bin/bash
# Drop the design-bundles import commit from history, gitignore the path,
# and restore the bundles to the working tree as ignored files.
#
# After running this, the bundles stay on local disk for reference but are
# no longer tracked by git. The PR diff shrinks from ~21k to ~3k lines.

set -e
cd "$(dirname "$0")/.."

echo "=== precondition: on feat/portfolio_rebuild ==="
[ "$(git branch --show-current)" = "feat/portfolio_rebuild" ] || { echo "ERROR: wrong branch"; exit 1; }
echo "OK"
echo ""

echo "=== precondition: no modified tracked files (untracked is fine) ==="
DIRTY=$(git status --porcelain | grep -v "^?? " || true)
if [ -n "$DIRTY" ]; then
  echo "ERROR: modified tracked files in working tree — commit or stash first:"
  echo "$DIRTY"
  exit 1
fi
echo "OK"
echo ""

echo "=== STEP 1: backup design bundles to /tmp ==="
BACKUP_DIR="/tmp/personal-website-design-bundles-backup-$$"
cp -r docs/design-bundles "$BACKUP_DIR"
echo "backed up to $BACKUP_DIR"
echo ""

echo "=== STEP 2: locate the bundle-import commit ==="
BUNDLE_COMMIT=$(git log --format="%H" --grep="import v1 + v2 design bundles" feat/portfolio_rebuild | head -1)
if [ -z "$BUNDLE_COMMIT" ]; then
  echo "ERROR: could not find bundle-import commit"
  exit 1
fi
echo "bundle commit: $BUNDLE_COMMIT"
git log -1 --oneline "$BUNDLE_COMMIT"
echo ""

echo "=== STEP 3: rebase to drop the bundle commit ==="
git rebase --onto "${BUNDLE_COMMIT}^" "$BUNDLE_COMMIT" feat/portfolio_rebuild
echo ""

echo "=== STEP 4: add docs/design-bundles/ and scripts/ to .gitignore ==="
if ! grep -q "^docs/design-bundles/" .gitignore; then
  printf '\n# local-only design bundle reference imports (Claude Design v1+v2 prototypes & chats)\ndocs/design-bundles/\n' >> .gitignore
  echo "appended docs/design-bundles/"
fi
if ! grep -q "^scripts/" .gitignore; then
  printf '\n# local-only operational scripts (one-off git/repo ops, not tracked)\nscripts/\n' >> .gitignore
  echo "appended scripts/"
fi
echo ""

echo "=== STEP 5: amend chore commit with new gitignore lines ==="
git add .gitignore
git commit --amend -m "chore: ignore claude config, handoff notes, design bundles, ops scripts

- .claude/ — local Claude Code session config, never pushed
- docs/code-bmo-*.md — local BMO handoff notes (scratch, kept out of repo)
- docs/design-bundles/ — local-only design reference imports (Claude Design v1+v2 prototypes & chats)
- scripts/ — local-only operational scripts (one-off git/repo ops)"
echo ""

echo "=== STEP 6: restore bundles to working tree (as ignored files) ==="
mkdir -p docs
mv "$BACKUP_DIR" docs/design-bundles
echo "restored"
echo ""

echo "=== STEP 7: verify status is clean (bundles should be ignored, not untracked) ==="
git status -sb
echo ""

echo "=== new diff stats vs origin/main ==="
git diff --shortstat origin/main..feat/portfolio_rebuild
echo ""

echo "=== new commit chain ==="
git log --oneline origin/main..feat/portfolio_rebuild
echo ""

echo "=== DONE ==="
echo "Bundles preserved at: docs/design-bundles/ (now gitignored)"
echo "Next: review diff, then re-run scripts/push-and-open-pr.sh to force-push the rewritten branch."
