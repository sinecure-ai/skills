---
name: using-sinecure-skills
description: Bootstrap for Sinecure's skill library. Load at the start of any
  Sinecure recruiting or platform task to discover available skills. Trigger
  whenever the user mentions a search, pitch, proposal, candidate, shortlist,
  or any Sinecure brand (Grace Blue, Strategy Source, The Second Shift).
---

# Using Sinecure skills

Sinecure's skill *content* is NOT loaded from this plugin's bundled copy. The
plugin ships only this bootstrap skill and a session-start sync hook. The hook
keeps a fresh git clone of the content at `~/.claude/sinecure-skills`
(or `$SINECURE_SKILLS_DIR` if overridden), updated automatically every session.

Content lives under the `content/` directory of that clone.

## How to find and load a skill

1. List what's available:
   `ls ~/.claude/sinecure-skills/content/`
2. Read the relevant `SKILL.md` directly, e.g.:
   `~/.claude/sinecure-skills/content/retained-search-workflow/SKILL.md`
3. Follow that skill's instructions for the task.

Always check the synced directory rather than relying on memory — the content
updates automatically and may have changed since the last session.

## Why content is read live (not bundled)

Claude installs a plugin as a pinned, git-less copy that cannot self-update, so
bundled skills go stale until someone runs `claude plugin update`. By reading
content from the hook-synced clone instead, every teammate gets fresh skills
each session with no command. See the repo README for the full mechanism.

## Available skills (discover live; this list may lag)
- `retained-search-workflow` — Sinecure's unified recruiting workflow (phases 0–9) across retained, volume/RPO, and fractional engagements.
- `gbcv-reformatter` — reformats candidate CVs/resumes (PDF, DOCX, DOC) into the Grace Blue branded GBCV `.docx` format.
