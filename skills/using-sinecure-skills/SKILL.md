---
name: using-sinecure-skills
description: Bootstrap for Sinecure's skill library. Load at the start of any
  Sinecure recruiting or platform task to discover available skills. Trigger
  whenever the user mentions a search, pitch, proposal, candidate, shortlist,
  or any Sinecure brand (Grace Blue, Strategy Source, The Second Shift).
---

# Using Sinecure skills

Sinecure's skills ship inside this plugin and are available natively in every
environment — Claude Code CLI, the desktop app, and Cowork. Use the `Skill`
tool to load whichever one fits the task.

## Available skills

- **`retained-search-workflow`** — Sinecure's unified recruiting workflow
  (phases 0–9) across retained, volume/RPO, and fractional engagements:
  credentials & proposal, team & process, position profile, sourcing, outreach,
  shortlist, references, offer/negotiation, placement, and (fractional) renewals.
- **`gbcv-reformatter`** — reformats candidate CVs/resumes (PDF, DOCX, DOC) into
  the Grace Blue branded GBCV `.docx` format.

## How to use

1. Identify the task (a search phase, a CV reformat, etc.).
2. Invoke the matching skill with the `Skill` tool and follow its instructions.
3. If a skill needs a connector or login (Drive, Lever, LinkedIn Recruiter),
   it will tell you.

## Staying current

New skills and updates ship with the plugin. To pick them up, update the
plugin (`claude plugin update sinecure-skills@sinecure-marketplace`, or re-sync
the marketplace in the desktop app). There is no separate content sync step.
