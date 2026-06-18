#!/bin/bash
# Consolidate local branches: rebase fix/nav-and-hydration onto origin/main,
# rename to feat/inner-pages-rebuild, fast-forward main.
# Stops short of deleting intermediate branches — that's a separate step after review.

set -e
cd "$(dirname "$0")/.."

echo "=== status before ==="
git status -sb
echo ""

echo "=== STEP 1: commit gitignore ==="
git add .gitignore
git commit -m "chore: ignore claude config and local handoff notes

- .claude/ — local Claude Code session config, never pushed
- docs/code-bmo-*.md — local BMO handoff notes (scratch, kept out of repo)"
echo ""

echo "=== STEP 2: fetch origin ==="
git fetch origin
echo ""

echo "=== STEP 3: rebase fix/nav-and-hydration onto origin/main ==="
git rebase origin/main
echo ""

echo "=== STEP 4: rename branch to feat/inner-pages-rebuild ==="
git branch -m fix/nav-and-hydration feat/inner-pages-rebuild
echo ""

echo "=== STEP 5: fast-forward local main to origin/main ==="
git checkout main
git merge --ff-only origin/main
git checkout feat/inner-pages-rebuild
echo ""

echo "=== final HEAD ==="
git log --oneline -3
echo ""

echo "=== all local branches ==="
git branch -vv
echo ""

echo "=== DONE — review then run scripts/delete-intermediates.sh if happy ==="
