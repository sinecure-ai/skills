---
name: gbcv-reformatter
description: >
  Reformats candidate CVs and resumes into the Grace Blue branded GBCV format.
  Trigger this skill whenever a user wants to convert, reformat, or transform
  one or more CV or resume files into a Grace Blue CV document. Also trigger
  when the user mentions 'GBCV', 'CV template', 'candidate CV', 'reformat CV',
  'batch CVs', or 'process CVs'. This skill handles PDF, DOCX, and DOC inputs
  and produces branded .docx outputs ready for recruiter review.
---

# Grace Blue CV Reformatter Skill

## Overview

This skill converts raw candidate CVs (PDF, DOCX, DOC) into the Grace Blue
branded GBCV format — a polished `.docx` file with correct fonts, colors,
logo, section structure, and "Private & Confidential" footer.

**Output per candidate:** `FirstName_LastName_GBCV.docx`

---

## Quick Start (follow these steps in order)

### Step 1 — Ask who prepared the CV

Present the preparer list and ask the user to select:

```
Who prepared these CVs? Please select:

1. Duffy, Helen
2. Ford, Molly
3. Hadley, Eric
4. Hadley, Gina
5. Haines, Jay
6. Harwood, Tania
7. Lasiter, Laura
8. Melcher, Randy
9. Steib, Kemp
```

Convert the selection to "First Last" format for the cover page (e.g. "Helen Duffy").

### Step 2 — Gather the CV files

If the user has not yet provided CV files, ask them to upload or provide
the path to the folder/files. Accepted formats: `.pdf`, `.docx`, `.doc`.

### Step 3 — Install dependencies

```bash
cd /home/claude
npm install -g docx 2>/dev/null || true
pip install pdfminer.six --break-system-packages -q 2>/dev/null || true
```

### Step 4 — Extract text from each CV

For each CV file:

```bash
# For DOCX files
pandoc <input.docx> -t plain --track-changes=all -o <output.txt>

# For PDF files
pdftotext <input.pdf> - > <output.txt>
# If pdftotext fails:
pandoc <input.pdf> -t plain -o <output.txt>

# For DOC files — convert first
python3 /mnt/skills/public/docx/scripts/office/soffice.py --headless \
  --convert-to docx --outdir /tmp/ <input.doc>
# Then extract as DOCX above
```

### Step 5 — Parse CV data using Claude API

Call the Anthropic API to extract structured data from each CV text.
See **CV Data Schema** section below for the exact JSON structure to request.

Use this system prompt:
```
You are parsing a candidate CV into structured JSON. Return ONLY valid JSON
with no markdown fences, no preamble, no explanation.
```

Use this extraction prompt format:
```
Extract the following from this CV and return ONLY valid JSON:

{
  "candidate_name": "Full Name",
  "professional_experience": [...],
  "education": [...],
  "awards_and_certifications": [...],
  "additional_information": [...],
  "missing_sections": [...]
}

[Full schema in references/cv_schema.md]

CV TEXT:
<raw text here>
```

### Step 6 — Generate the GBCV document

Run the builder script:

```bash
node /path/to/skill/scripts/build_docx.js /tmp/cv_payload.json
```

Where `/tmp/cv_payload.json` contains:
```json
{
  "cv_data": { ... },
  "prepared_by": "First Last",
  "date": "March 10, 2026",
  "output_path": "/path/to/FirstName_LastName_GBCV.docx",
  "logo_path": "/path/to/skill/assets/logo.png",
  "template_path": "/path/to/skill/assets/GBCV_Template__NEW_.docx"
}
```

### Step 7 — Validate and deliver

```bash
python3 /mnt/skills/public/docx/scripts/office/validate.py <output.docx>
```

Move all output files to `/mnt/user-data/outputs/` and present them to the user.

---

## Document Structure

Every GBCV output follows this structure:

| Page | Content |
|------|---------|
| Cover | "Confidential CV" + Candidate Name + Prepared By + Date |
| 2+ | CV: [Name] heading, then sections below |

### Sections (in order)
1. **Professional Experience** — employer tables with date range, company, roles, bullets
2. **Education** — institution, degree, field, year
3. **Awards & Certifications** — title, issuer, year
4. **Additional Valuable Information** — populated from CV content not in other sections

### Flagging missing content
When a section has no data, insert a highlighted paragraph:
`⚠ [SECTION NAME — none provided]`

---

## Brand Specification

| Element | Value |
|---------|-------|
| Primary font | Lato (fallback: Arial) |
| Bold font | Lato Black |
| Navy color | `#1c2033` |
| Light blue (borders) | `#9cc7ee` |
| Grey text (small caps) | `#464646` |
| Section headers | Lato Black, 28pt, Navy, light blue bottom border |
| CV main heading | Lato Black, 36pt, Navy, light blue bottom border |
| Cover title | Lato Black, 48pt, Navy |
| Body text | Lato, 22pt (11pt), black |
| Page | A4 (11906 × 16838 DXA) |
| Margins | Top: 2552, Bottom: 1418, Left: 1134, Right: 1134 (DXA) |
| Logo | Upper right, all pages, `assets/logo.png` |
| Footer | "Private & Confidential" center, light blue top border |
| Cover footer | Adds office addresses (NYC + London) |

---

## File Naming Convention

`FirstName_LastName_GBCV.docx`

Strip all non-alphanumeric characters from name parts.

---

## Prepared By List (alphabetical)

Present in this order — convert "Last, First" to "First Last" for document:

1. Duffy, Helen → Helen Duffy
2. Ford, Molly → Molly Ford
3. Hadley, Eric → Eric Hadley
4. Hadley, Gina → Gina Hadley
5. Haines, Jay → Jay Haines
6. Harwood, Tania → Tania Harwood
7. Lasiter, Laura → Laura Lasiter
8. Melcher, Randy → Randy Melcher
9. Steib, Kemp → Kemp Steib

---

## Handling Edge Cases

| Situation | Action |
|-----------|--------|
| Section completely absent | Insert yellow-highlighted flag text |
| No awards/certs on CV | Flag, leave recruiter placeholder |
| Extra sections on CV (publications, languages, volunteering) | Pull into "Additional Valuable Information" |
| Headshot/photo in CV | Do not include in output |
| LinkedIn URL on CV | Do not include in output |
| Multiple roles at same company | Group under one employer table, list roles + sub-dates |
| International date formats | Normalise to YYYY or Month YYYY |
| PDF with scanned/image content | Try OCR via `tesseract` if pdftotext yields empty output |

---

## Batch Processing

Always use auto-batching — never process all files in one go.

**Default batch size: 3 files.** The skill automatically splits any number
of CVs into groups of 3, writes outputs after each group, then continues
to the next — no user confirmation needed between batches.

Rules:
- One `.docx` output per candidate, written after each batch completes
- A failed file is logged and skipped; it never stops the rest of the run
- Print per-batch progress and a final summary at the end
- Batch size can be overridden with `--batch-size N` if needed

Final summary always includes:
- Total success / failure count
- Failed files with error reason
- Candidates with flagged missing sections

---

## References

- `references/cv_schema.md` — Full JSON schema for CV extraction
- `assets/GBCV_Template__NEW_.docx` — Original template reference
- `assets/logo.png` — Grace Blue logo (upper right, all pages)
- `scripts/build_docx.js` — Document builder (Node.js / docx.js)
- `scripts/process_cv.py` — Batch orchestration script

---

## Test CV (for skill validation)

When testing this skill, use a CV that:
- Has at least 2 employers with multiple roles
- Uses a non-standard international format (e.g. EU date format)
- Is missing at least one section (e.g. no awards)
- Is a PDF

This ensures the full range of formatting logic is exercised.
