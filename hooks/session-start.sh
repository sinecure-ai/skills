#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Sinecure skills — session-start sync hook
#
# Runs every time a Claude Code / Cowork session starts. Keeps an external
# clone of THIS repo current so skill content is fresh every session without
# anyone running `claude plugin update`.
#
# Why external? Claude installs a plugin as a pinned, git-LESS copy under
# ~/.claude/plugins/cache/.../<version>/. That copy cannot self-update. So we
# maintain our own git clone elsewhere ($SINECURE_SKILLS_DIR) and the
# bootstrap skill reads content from there.
#
# Git-state aware so it never false-warns:
#   - behind   -> fast-forward automatically (clean tree only)
#   - ahead    -> stay silent (local has unpushed work)
#   - diverged -> warn, do nothing (let the human decide)
#
# Fails SOFT: a network blip or git hiccup must never block a session from
# starting. Every failure path exits 0.
# ---------------------------------------------------------------------------

set -uo pipefail

# --- Config ----------------------------------------------------------------
SKILLS_REPO="${SINECURE_SKILLS_REPO:-https://github.com/sinecure-ai/skills.git}"
SKILLS_BRANCH="${SINECURE_SKILLS_BRANCH:-main}"
# Where the skills clone lives. Default keeps it beside the plugin cache.
SKILLS_DIR="${SINECURE_SKILLS_DIR:-$HOME/.claude/sinecure-skills}"
AUTO_UPDATE="${SINECURE_AUTO_UPDATE:-true}"   # set false to only warn, never pull

log()  { printf '[sinecure-skills] %s\n' "$*" >&2; }
note() { printf '[sinecure-skills] %s\n' "$*"; }   # stdout -> shows in session context

# --- Guard: git available --------------------------------------------------
if ! command -v git >/dev/null 2>&1; then
  log "git not found; skipping skills sync."
  exit 0
fi

# --- First run: clone ------------------------------------------------------
if [ ! -d "$SKILLS_DIR/.git" ]; then
  log "First run — cloning skills into $SKILLS_DIR"
  if git clone --quiet --branch "$SKILLS_BRANCH" "$SKILLS_REPO" "$SKILLS_DIR" 2>/dev/null; then
    note "Sinecure skills installed (branch: $SKILLS_BRANCH)."
  else
    log "Clone failed (offline or no access?). Session continues without skills sync."
  fi
  exit 0
fi

# --- Subsequent runs: inspect git state ------------------------------------
cd "$SKILLS_DIR" || exit 0

# Fetch quietly; if it fails (offline), just use what we have.
if ! git fetch --quiet origin "$SKILLS_BRANCH" 2>/dev/null; then
  log "Could not reach upstream; using local skills as-is."
  exit 0
fi

LOCAL=$(git rev-parse "@" 2>/dev/null || echo "")
REMOTE=$(git rev-parse "origin/$SKILLS_BRANCH" 2>/dev/null || echo "")
BASE=$(git merge-base "@" "origin/$SKILLS_BRANCH" 2>/dev/null || echo "")

if [ -z "$LOCAL" ] || [ -z "$REMOTE" ]; then
  log "Could not determine git state; skipping."
  exit 0
fi

if [ "$LOCAL" = "$REMOTE" ]; then
  # up to date — say nothing, keep sessions quiet
  exit 0
elif [ "$LOCAL" = "$BASE" ]; then
  # ---- BEHIND: upstream has new commits ----
  if [ "$AUTO_UPDATE" = "true" ]; then
    # Only fast-forward if the working tree is clean, to avoid clobbering edits.
    if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
      if git merge --ff-only --quiet "origin/$SKILLS_BRANCH" 2>/dev/null; then
        COUNT=$(git rev-list --count "$LOCAL..$REMOTE" 2>/dev/null || echo "some")
        note "Updated Sinecure skills ($COUNT new change(s) pulled)."
      else
        note "Skills updates available but fast-forward failed. Run: git -C \"$SKILLS_DIR\" pull"
      fi
    else
      note "Skills updates available, but you have local edits. Review with: git -C \"$SKILLS_DIR\" status"
    fi
  else
    note "New Sinecure skills available upstream. Pull with: git -C \"$SKILLS_DIR\" pull"
  fi
elif [ "$REMOTE" = "$BASE" ]; then
  # ---- AHEAD: local has unpushed commits — this is fine, stay silent ----
  exit 0
else
  # ---- DIVERGED: both sides moved — never auto-resolve ----
  note "Sinecure skills have diverged from upstream. Resolve manually in $SKILLS_DIR"
fi

exit 0
