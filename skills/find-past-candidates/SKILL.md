---
name: find-past-candidates
description: >
  Resurface candidates already in the connected ATS whom we considered before,
  for a role we're hiring now. Searches the ATS by job title and, on request,
  broadens to similar/adjacent titles. Trigger on "find past candidates", "who
  have we seen for this role", "historical candidates", "past pipeline",
  "reconsider previous candidates", "search the ATS by title", or "anyone in our
  ATS for <role>".
---

# Find past candidates (ATS)

<!-- Version 1.0.0 — June 2026 -->

For a role we're hiring now, find people already in our ATS whom we looked at
before — so we can reconsider warm, known candidates instead of starting cold.
This skill is **read-only**: it searches and reports, never modifies anything.

## Tools it uses

- **`ats_search_candidates_by_title(title)`** — primary. Searches ALL candidates
  in the connected ATS by title (substring match: `title="software"` matches
  broadly). One string arg; no filters or pagination.
- **`get_projects_info(search=…)`** — optional, to anchor to a real open role and
  inherit its exact title.

Tool names differ by client: on claude.ai/desktop connectors they appear as
`ats_search_candidates_by_title`; in Claude Code CLI as
`mcp__<server>__ats_search_candidates_by_title`. Match either.

## Response fields (use all of them)

Each candidate object from `ats_search_candidates_by_title` has these fields.
Use every one that has a value; skip a field silently if it's empty.

| Field | Use it for |
|---|---|
| `full_name` | Candidate name (display + dedupe fallback) |
| `titles` | Current/most-recent title — primary relevance signal vs the target role |
| `headline` | Fuller current-role line (title + company), display + relevance |
| `company_name` | Where they are now — display + context |
| `skills` | Comma-separated skills — match against the target role's requirements/keywords for relevance |
| `bio` | Short descriptor — display context |
| `location` | Geography — display and (if the role is location-bound) a filter/flag |
| `profile_image_url` | Avatar — use in any rich/visual output (e.g. an artifact); omit in plain tables |
| `linkedin_url` | **Primary dedupe key** across variant searches; the handle for `candidate_resolve_email` |
| `id` / `graph_profile_id` | Internal identifiers — dedupe fallback when `linkedin_url` is missing; never shown to the user |
| `ats_job_titles` | Roles this person was previously in the ATS for — **direct prior-consideration signal**; weight relevance up when these match the target |
| `ats_tags` | Prior-consideration tags: office/team ("Grace Blue NY"), function ("Leadership"), geography ("NYC"), and role+year ("Cross Media, President, 2026"). Surface the human-meaningful ones as "why we know them." **Ignore junk tags** — pure numeric/ID-looking strings (e.g. "40575576201"). |

## Before searching — connection & auth check

This ATS tool is OAuth-gated. Before relying on it:

- **If the tool isn't in the available toolset → the connector isn't connected.**
  Don't guess or fabricate. Tell the user to connect the Sinecure/explorator
  connector (claude.ai → Connectors, or `/mcp` in Claude Code) and retry.
- **If a call returns 401 / "unauthorized" / "login required" / a token error →**
  the connector is added but not signed in. Tell the user to complete the browser
  OAuth login (explorator email + password). Don't retry in a loop. Claude cannot
  sign in on the user's behalf or accept pasted tokens/codes.

## Flow

### 1. Establish the target role

- If the user gave a title, use it as the target.
- Offer to **anchor to a real open role**: call
  `get_projects_info(search="<keyword from the user>")`, show the matching open
  roles, and let the user pick one — then use that role's exact title as the
  target. (This also sets up future cross-referencing to that role's pipeline.)
- If the user gave no usable title, ask for one, or list open roles via
  `get_projects_info` and let them choose.

### 2. First search (Tier 1)

- Call `ats_search_candidates_by_title(title="<target title>")`.
- Parse each candidate using the **Response fields** table above. Never invent a
  field that isn't present; skip empties.
- Report the **count** and a brief first look (top few: `full_name` — `headline`
  — and any matching `ats_job_titles`/`ats_tags`).

### 3. Offer to broaden — ask every time

After Tier 1, always show the count and ask whether to widen the search. Example:

> Found N candidates for "<title>". Want me to broaden? I can search the core
> role term (dropping seniority/modifiers) and a few adjacent titles.

Only broaden if the user says yes. When broadening, generate a small, sensible
variant set and search each, then merge:

- **Core term** — strip seniority and specializers: "Senior Backend Software
  Engineer" → "software engineer" (higher recall, since match is substring-based).
- **Seniority ladder** — Lead / Principal / Head / VP / Chief variants of the role.
- **Functional synonyms / abbreviations** — e.g. CMO ↔ Head of Marketing ↔
  Marketing Director; SWE ↔ Software Engineer; SDR ↔ Sales Development Rep.

Rules for broadening:
- Cap at **~6 variant searches** per run; state which titles you searched.
- Run one `ats_search_candidates_by_title` call per variant.
- **Merge and dedupe** across all searches by LinkedIn URL (fall back to name).

### 4. Present results

Deduplicate by `linkedin_url` (fallback `id`/`graph_profile_id`) across every
search run, then show a ranked table:

| Candidate | Current role | Location | Prior ATS context | Why relevant | Matched via | LinkedIn |
|---|---|---|---|---|---|---|

- **Candidate** = `full_name`.
- **Current role** = `headline` (or `titles` @ `company_name`).
- **Location** = `location`.
- **Prior ATS context** = meaningful `ats_tags` + `ats_job_titles` (e.g. "Grace
  Blue NY · Leadership · Cross Media, President 2026"). This is the "we've
  considered them before" evidence. Drop junk/numeric tags.
- **Why relevant** = one line tying their `titles`/`headline`/`skills`/
  `ats_job_titles` to the target role.
- **Matched via** = which search term surfaced them (shows how loose the match is).
- **LinkedIn** = `linkedin_url`.

Ranking signals (highest first):
1. `ats_job_titles` or a role-type `ats_tag` matches the target role — strongest
   signal (we already considered them for something like this).
2. `titles` / `headline` close to the target.
3. `skills` overlap with the target role's requirements/keywords.

Flag candidates who look stale or off-target (e.g. a role+year tag from long ago,
or a title far from the target) rather than padding the list. For a richer view,
you may render an artifact using `profile_image_url` avatars.

### 5. Next actions (offer, don't auto-run)

- Resolve a chosen candidate's email via `candidate_resolve_email(linkedin_url=…)`
  — opt-in, one at a time (auth-gated; don't bulk-resolve).
- Note that deeper prior-consideration context (past shortlist scores, recruiter
  notes, why-passed) can be added later by wiring `get_shortlisted_candidates`;
  it's intentionally not part of this version.

## Guardrails

- **Read-only.** Never call a write/mutating tool.
- **Never fabricate** candidates, counts, scores, or match reasons. If a search
  returns nothing — even after broadening — say so plainly and suggest different
  or broader terms.
- Don't spam the ATS: respect the ~6-variant cap and report what was searched.
- Output must reflect the tool's real response fields; confirm the exact shape on
  the first live run and adapt.
