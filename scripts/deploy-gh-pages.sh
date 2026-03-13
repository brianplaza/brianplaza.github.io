#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKTREE_DIR="${WORKTREE_DIR:-$REPO_ROOT/../site-deploy}"
BRANCH="${DEPLOY_BRANCH:-gh-pages}"

cd "$REPO_ROOT"

echo "Building production assets..."
npm run build

echo "Preparing deploy artifacts..."
touch dist/.nojekyll
if [[ -f CNAME ]]; then
  cp CNAME dist/CNAME
fi

echo "Preparing worktree at $WORKTREE_DIR on branch $BRANCH..."
if [[ -d "$WORKTREE_DIR" ]]; then
  rm -rf "$WORKTREE_DIR"
fi

git fetch origin "$BRANCH" || true

git worktree prune
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  git worktree add -B "$BRANCH" "$WORKTREE_DIR" "origin/$BRANCH"
else
  git worktree add -B "$BRANCH" "$WORKTREE_DIR" main
fi

echo "Syncing dist -> worktree..."
rsync -av --delete --exclude='.git' dist/ "$WORKTREE_DIR/"

echo "Committing deploy output..."
git -C "$WORKTREE_DIR" add .
if git -C "$WORKTREE_DIR" diff --cached --quiet; then
  echo "No deploy changes to commit."
else
  git -C "$WORKTREE_DIR" commit -m "Deploy site"
fi

echo "Pushing $BRANCH..."
git -C "$WORKTREE_DIR" push -u origin "$BRANCH"

echo "Deploy complete."
