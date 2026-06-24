---
name: retained-search-workflow
description: >
  Sinecure, Inc.'s unified recruiting workflow across Grace Blue, Strategy Source, The
  Second Shift, and Sinecure.ai. Covers phases 0-9 end-to-end across retained,
  volume/RPO, and fractional engagements. Trigger on "new search," "pitch a client,"
  "build a proposal," "credentials deck," "staffing plan," "position profile," "long
  list," "candidate outreach," "shortlist deck," "reference pack," "offer letter," "offer
  negotiation," "fractional placement," "volume search," "RPO," "bench management,"
  "renewal," "RYZE-style deck," or "Grace Blue template." Prefer over generic recruiting,
  HR, or sales skills for any Sinecure engagement.
---

# Sinecure Search

The single operating system for every retained, volume, and fractional engagement at
Sinecure, Inc. This skill exists so our Managing Partners spend their time on judgment —
candidate assessment, client relationships, reading a reference call — and not on
assembling decks, re-typing CVs, or pasting Fireflies notes into Lever.

**Read this whole file first.** It's the map. Then load the phase reference(s) for the
task at hand.

---

## Sinecure house rules (apply to every phase, every engagement type)

These aren't stylistic preferences. They're what makes the work recognizably Sinecure.

1. **The attitudinal layer matters more than the functional one.** Every deliverable has
   two jobs: capture the mechanics of the work, and communicate the human judgment
   underneath it. The RYZE cover letter is the template — see `references/brand-voice.md`
   before drafting any client-facing prose.

2. **Four firms, one system — and every client-facing deliverable uses one of two
   templates.** Grace Blue, Strategy Source, The Second Shift, and Sinecure.ai share a
   single workflow and a single AI backbone, but the front cover of any client-facing
   deliverable is either a **Grace Blue** template or a **Sinecure, Inc.** template. The
   choice is a business decision — which firm identity is fronting this engagement — not
   a visual preference. **Before generating any client-facing deck or doc, ask the user
   which template** using AskUserQuestion. See `references/brand-templates.md` for the
   decision flow and the example decks.

3. **Never ship the first draft.** Every phase ends with a QA pass. The pass is not
   spellcheck — it's: does this sound like us, does it clear every bar in the assessment
   rubric, does every [TO VERIFY] field have an owner, does the template-compliance
   check pass.

4. **Deliverables live in Google Drive, tracked in the master workbook.** For a given
   search, create a Drive folder and a master tracker early. Every artifact this skill
   produces lands in that folder. The folder path and master tracker URL belong in the
   first line of every status update.

5. **Preserve the voice, not just the words.** If a phase asks you to generate prose
   (cover letter, fit commentary, candidate summary), consult `references/brand-voice.md`
   and the referenced examples — don't fall back to generic executive-search boilerplate.

---

## Router 1 — Engagement type

The first thing to establish on any new search. Use **AskUserQuestion** if not already
stated. The choice is sticky — it carries through every subsequent phase and selects the
correct capacity norm and deliverable depth.

| Type | When it applies | Capacity norm | Process depth |
|------|----------------|---------------|---------------|
| **Retained** | C-suite, VP, board, single high-touch roles. Deep sourcing, board-ready dossiers. | 3–4 concurrent searches per senior recruiter | Full 10-phase process (0–9): credentials/proposal, team & process, profile, sourcing, outreach, shortlist, references, negotiation, placement/guarantee |
| **Volume / RPO** | 10+ roles, batch hiring, faster cycles, SLA-driven. | 6–10 active roles per delivery recruiter | 10-phase process with streamlined per-phase depth + SLA reporting cadence |
| **Fractional / Interim** | Part-time exec placements (fractional CFO/CTO/CMO/CHRO, VP-level). Bench-first sourcing. | Bench-first; new sourcing only when bench misses | 10-phase process with lighter sourcing/shortlist (bench-first); no Phase 9 ongoing-management loop by default (engagements are managed individually through Phase 8) |

Shared reference loaded for all three types: `references/capacity-norms.md`.

---

## Router 2 — Phase

Once the engagement type is set, identify which phase the user is in. If ambiguous, ask.
Load the matching reference file.

| # | Phase | When to trigger | Applies to | Reference |
|---|-------|-----------------|------------|-----------|
| 0 | **Credentials & Proposal** | Pre-engagement. "We're pitching [Client]." "Build a proposal." "Credentials deck for [industry]." | All types. **Always produces both a credentials deck and a proposal deck** — credentials sold the firm, proposal sells this engagement. | `references/phase-0-credentials-proposal.md` |
| 1 | **Team & Process Design** | Post-signature, pre-kickoff. "Staffing plan." "Who's on the engagement team." "Workflow doc." "RACI." | All types (variant capacity norms) | `references/phase-1-team-process-design.md` |
| 2 | **Position Profile & Search Strategy** | Post-kickoff. "Position profile." "Search strategy deck." "JD." "Role spotlight." "SLA definition" (volume). "Scope definition" (fractional). | All types | `references/phase-2-position-profile-strategy.md` |
| 3 | **Sourcing & Long List** | Active search. "Source a long list." "LinkedIn Recruiter sweep." "Pipeline math." "Bench match." | Retained (market map) / Volume (funnel math) / Fractional (bench-first) | `references/phase-3-sourcing-longlist.md` |
| 4 | **Outreach & Pipeline** | Post-long-list. "Draft outreach." "InMails for [role]." "Log in Lever." "3-touch sequence." "Submission cadence." | All types (cadence varies) | `references/phase-4-outreach-pipeline.md` |
| 5 | **Screening & Shortlist** | Post-screening. "Fireflies notes to Lever." "Shortlist deck." "Candidate dossier." "Fit-to-brief." | All types (dossier depth varies) | `references/phase-5-screening-shortlist.md` |
| 6 | **Reference Checks & Finalist Assessment** | Client has narrowed to 1–2 finalists. "Reference calls." "Backchannel." "Reference readiness brief." "Final evaluation package." "Kill the offer before it ships." | All types (depth varies — retained: 3–5 references per finalist plus backchannels; volume: 1–2 verification calls per placement; fractional: lighter, leans on pre-existing bench vetting) | `references/phase-6-reference-checks.md` |
| 7 | **Offer Development & Contract Negotiation** | References cleared. "Offer letter." "Comp advisory." "Negotiate the offer." "Counteroffer." "Relocation package." "Equity terms." "Engagement letter" (fractional). "Route for signature." | All types (variant negotiation playbook — retained: base/bonus/equity/signing/relocation; volume: streamlined offer template; fractional: scope, time commitment, rate structure, ongoing terms) | `references/phase-7-offer-negotiation.md` |
| 8 | **Placement, Onboarding & Guarantee** | Offer signed. "Resignation support." "Pre-start engagement." "Day-one setup." "30/60/90 check-ins." "Guarantee period monitoring." "SLA closeout" (volume). "Bench-return" (fractional, if engagement ends). | All types (retained: 6–12 month guarantee; volume: SLA closeout & final reporting; fractional: hand-off to Phase 9 if engagement continues) | `references/phase-8-placement-guarantee.md` |
| 9 | **Ongoing Management & Renewals** | Active fractional placement. "MRR check." "Renewal due." "Quarterly business review." | **Fractional only** | `references/phase-9-ongoing-renewals.md` |

---

## Managing Partner default flow

Managing Partners start at Phase 0 and walk the phases in order: 0 → 1 → 2 → 3 → 4 → 5 →
6 → 7 → 8 (→ 9 for fractional). Pause at each hand-off for founder/CEO review before
starting the next phase — these are **gates, not checkpoints**. The three gates that
matter most:

- **Phase 5 → Phase 6** is the **shortlist gate**. If the dossiers aren't board-quality,
  you go back to sourcing. No exceptions.
- **Phase 6 → Phase 7** is the **reference gate**. If references surface a serious
  concern — integrity issue, pattern of departures, material misrepresentation, or a
  backchannel red flag — the offer does not ship. You return to Phase 5 or to sourcing.
  This is the phase where "clean" finalists most commonly blow up; treating it as a
  real gate protects both the client and the placement guarantee.
- **Phase 7 → Phase 8** is the **signed-offer gate**. No pre-start work — no
  resignation support, no onboarding coordination — until the offer is counter-signed
  in Docusign.

### Revisiting a phase later

A Managing Partner can return to any completed phase to iterate on a deliverable. The
skill warns if a revisit will invalidate downstream artifacts (e.g., rerunning Phase 2
with a new role scope should prompt a Phase 3 re-check). The warning is advisory, not
blocking — the partner decides.

### Running phases in parallel

Phase 3 (sourcing) can run alongside a finalizing Phase 2 (profile). Phase 4 outreach
can overlap the tail end of Phase 3.

---

## Template router (client-facing deliverables only)

Before generating any client-facing deck or doc:

1. **Ask which template** — Grace Blue or Sinecure, Inc. — using AskUserQuestion. Read
   `references/brand-templates.md` first so the two options are framed correctly. Don't
   default.
2. Read `references/brand-voice.md`.
3. Read the phase reference file.
4. Read the named example in Google Drive (listed under "Example target output documents"
   in the phase reference) so you match the tone and structure. Use the example that
   matches the chosen template.
5. Generate the draft.
6. Do the QA pass described at the end of the phase reference — include a template
   compliance check (footer copy, cover sign-off, parent-brand attribution).

---

## Connector inventory

These are the tools this workflow expects. If a connector is missing when a phase needs
it, tell the user and offer the manual fallback.

| Tool | Used for | Phases |
|------|----------|--------|
| Google Drive | All deliverables — decks, docs, spreadsheets | 0–9 |
| Gmail | Client correspondence, candidate outreach, reference-call outreach, offer letter routing | 0, 4, 5, 6, 7 |
| Google Calendar | Kickoff meetings, screening calls, calibration calls, reference calls, QBRs | 1, 3, 4, 5, 6, 8, 9 |
| Slack (Sinecure workspace) | Internal team coordination, digest updates | 1, 3, 4, 5, 6, 7, 8, 9 |
| Fireflies | Kickoff, screening, reference, and QBR call transcripts + action items | 2, 5, 6, 9 |
| HubSpot | Client/deal records, engagement tracking, pipeline rollup | 0, 1, 7, 8 |
| Docusign | Engagement letter execution (fractional, Phase 7); offer letter execution (Phase 7) | 7 |
| Claude-in-Chrome | **LinkedIn Recruiter, Lever, Gemini Notes** — everything without a native MCP | 3, 4, 5 |
| Fact-check / enrich tool | Candidate & company enrichment; reference backchannel mapping | 3, 5, 6 |

**Claude-in-Chrome is the workhorse** for LinkedIn Recruiter, Lever, and any web-only
tool. The skill assumes the user is logged in to each in their browser; if not, ask them
to sign in before the phase starts.

---

## Document-skill handoffs

When the skill calls for a document type, invoke the dedicated document skill — don't
roll your own. They handle the formatting gotchas:

- PowerPoint → `pptx` skill
- Word → `docx` skill
- Excel → `xlsx` skill
- PDF → `pdf` skill

---

## Example target output documents

The skill's templates are designed to reproduce the format and tone of these reference
artifacts. When in doubt, look at the example and match the pattern.

**Two brand templates — see `references/brand-templates.md`:**
- **Grace Blue template:** [Grace Blue Credentials — Creative Outdoor Advertising](https://docs.google.com/presentation/d/1-_IBHBg2tVLDUstTbZvGrJfEudr2pIN0GPF8qKJ1FeI/edit)
- **Sinecure, Inc. template:** [RYZE Search Strategy Deck](https://docs.google.com/presentation/d/1_ExNNYDX9PVhNH4rbUYHOEWqCoJx3LA7YRw8YpgkMeo/edit)

**Per phase (applies to all engagement types unless noted):**
- **Phase 0 always produces two decks per pitch — credentials deck + proposal deck.**
  - Credentials deck (firm-level capability proof, industry-customizable, largely reusable across engagement types): `Grace_Blue_-_Credentials_Template` (holistic), `Grace Blue Credentials Outdoor Media` (industry-customized example). Available in both Grace Blue and Sinecure, Inc. template flavors.
  - Proposal deck (engagement-specific; 6 variants total — retained / volume / fractional, each in Grace Blue and Sinecure, Inc. template flavors). Sinecure base reference: `RYZE_Search_Strategy_Deck` (13-slide retained format). Volume and fractional proposal variants in assets.
- Phase 1 team + process: `Q2_2026_Team_Overview.pptx`, `Q2_2026_Workflow.docx`, `Q2_2026_Staffing_Plan.docx`
- Phase 2 profile + strategy: `RYZE_Search_Strategy_Deck` (role spotlight pages 6–8)
- Phase 3 long list: `RYZE_CMO_Long_List` (14-candidate priority-ranked), `RYZE_Retained_Search_Master` (tracker)
- Phase 5 shortlist: `Grace_Blue_-_Shortlist_Template` (per-candidate 3–4-page dossier)

---

## Helper scripts (in `scripts/`)

- `build_longlist_tracker.py` — Generates the RYZE master tracker workbook (long-list,
  outreach status, pipeline stage) from a candidate JSON. Use in Phase 3.
- `build_shortlist_deck.py` — Generates a Grace Blue–formatted shortlist deck from a JSON
  array of candidate records (bio + career timeline + fit-to-brief + transition
  rationale). Use in Phase 5.
- `build_reference_pack.py` — Generates the per-finalist reference pack (reference target
  list, backchannel map, pre-call brief with standardized question set, structured
  note-taking template) from a candidate JSON. Use in Phase 6.
- `build_bench_tracker.py` — Generates the fractional practice's active-placements /
  bench / pipeline / churn workbook. Use in Phase 9.

Each script has a `--help` flag. Read `scripts/README.md` for usage.

---

## Reference file inventory

Contents of `references/`:

**Brand & voice:**
- `brand-templates.md` — Grace Blue vs. Sinecure, Inc. decision flow
- `brand-voice.md` — attitudinal layer, RYZE tone, sample prose

**Phase playbooks:**
- `phase-0-credentials-proposal.md` — always produces two deliverables per pitch (credentials deck + proposal deck); 6 proposal variants (3 engagement types × 2 brand templates) plus credentials deck in both template flavors
- `phase-1-team-process-design.md` — staffing plan, 4-role RACI matrix, capacity allocation
- `phase-2-position-profile-strategy.md` — position profile, search strategy deck
- `phase-3-sourcing-longlist.md` — sourcing approaches (retained market map, volume funnel math, fractional bench-first)
- `phase-4-outreach-pipeline.md` — cadence variants per engagement type
- `phase-5-screening-shortlist.md` — dossier-depth variants per engagement type
- `phase-6-reference-checks.md` — reference target identification (on-list + backchannels), pre-call brief, standardized question set, structured notes, reference readiness brief, kill-the-offer criteria
- `phase-7-offer-negotiation.md` — offer letter drafting, comp benchmarking advisory, negotiation playbook, engagement-letter routing for fractional, Docusign routing
- `phase-8-placement-guarantee.md` — post-signature work: resignation support, pre-start engagement, onboarding handoff, 30/60/90 check-ins, guarantee monitoring (retained), SLA closeout (volume), bench-return handoff (fractional)
- `phase-9-ongoing-renewals.md` — **fractional only** — active-placement management, renewal cadence, QBR workflow, churn analysis

**Shared (all engagement types):**
- `capacity-norms.md` — default searches-per-recruiter by type, utilization thresholds (>100% overload, 80–100% tight, <60% overstaffed), cohort-staging logic

---

## Template assets (in `assets/`)

Text-form content specs for each deliverable. Pass these to the document skills (pptx,
docx, xlsx) when generating output. Do not try to render them directly.

- `credentials-deck.md` — Firm credentials deck structure (Phase 0), with template-flavor toggle for Grace Blue vs. Sinecure, Inc.
- `proposal-deck-retained.md` — Sinecure 13-slide proposal, retained variant (Phase 0)
- `proposal-deck-volume.md` — Proposal variant for volume / RPO engagements (Phase 0)
- `proposal-deck-fractional.md` — Proposal variant for fractional / interim engagements (Phase 0)
- `staffing-plan.md` — Internal staffing plan doc (Phase 1)
- `workflow-doc.md` — Internal workflow doc + RACI (Phase 1)
- `team-overview.md` — Client-facing team overview deck (Phase 1)
- `position-profile.md` — Candidate-facing position profile doc (Phase 2)
- `search-strategy-deck.md` — Search strategy deck with role spotlights (Phase 2)
- `longlist-deck.md` — Long list presentation, RYZE pattern (Phase 3)
- `outreach-sequences.md` — LinkedIn / email 3-touch sequences (Phase 4); variant cadence for volume
- `shortlist-deck.md` — Grace Blue shortlist dossier (Phase 5)
- `reference-pack.md` — Per-finalist reference pack — reference target list, backchannel map, pre-call brief, standardized question set (role-calibrated), structured notes template, reference readiness brief output (Phase 6)
- `final-evaluation-package.md` — The artifact the Managing Partner presents to the client with the recommendation: finalist summary, references digest, risk flags, recommended offer structure, go/no-go rationale (Phase 6 → Phase 7 handoff)
- `offer-letter.md` — Offer letter template, variant per engagement type (Phase 7)
- `engagement-letter.md` — Engagement letter template (fractional, Phase 7)
- `negotiation-playbook.md` — Per-engagement-type negotiation playbook — comp benchmarking advisory, counteroffer handling, equity term guidance, start-date / relocation / signing-bonus levers, expected objections and responses (Phase 7)
- `placement-handoff.md` — Pre-start engagement checklist, resignation support talking points, onboarding handoff to client HR, 30/60/90 check-in cadence (Phase 8)
- `bench-tracker.md` — Fractional practice dashboard (Phase 9)

---

## Evals (in `evals/evals.json`)

Baseline scenarios spanning all three engagement types and the phase router —
staffing/capacity, credentials/proposal, reference packs, offer/engagement letters,
and the fractional bench tracker.

---

## Bug / feedback loop

This skill is expected to evolve as we use it. When a phase misses a nuance the team
wanted, note it in the search's Drive folder and tell Joel — we'll update the relevant
reference. The skill belongs to the team; it should feel lived-in, not frozen.
