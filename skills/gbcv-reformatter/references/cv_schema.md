# CV Extraction JSON Schema

When calling the Claude API to extract CV data, request this exact structure.
Return ONLY valid JSON — no markdown, no code fences, no preamble.

```json
{
  "candidate_name": "Full Name",

  "professional_experience": [
    {
      "date_range": "2020 - Present",
      "company": "Company Name",
      "roles": [
        {
          "title": "Job Title",
          "start_date": "2022",
          "end_date": "Present",
          "bullets": [
            "Led cross-departmental strategic projects aligning business optimisation...",
            "Developed and implemented agile systems enabling real-time reporting..."
          ]
        },
        {
          "title": "Previous Title at Same Company",
          "start_date": "2020",
          "end_date": "2022",
          "bullets": [
            "Managed IT infrastructure ensuring seamless operations..."
          ]
        }
      ]
    }
  ],

  "education": [
    {
      "institution": "University Name",
      "degree": "BSc",
      "field": "Computer Science",
      "year": "2015 - 2018"
    }
  ],

  "awards_and_certifications": [
    {
      "title": "PMP Certification",
      "issuer": "PMI",
      "year": "2020"
    }
  ],

  "additional_information": [
    "Fluent in French and Spanish",
    "Published author: 'Digital Transformation in Arts Organisations' (2022)",
    "Volunteer trustee, Arts Council committee"
  ],

  "missing_sections": ["awards_and_certifications"]
}
```

## Field Rules

### candidate_name
- Full legal name as it appears on CV
- Remove any post-nominal titles (MBA, PhD, etc.) from the name itself

### professional_experience
- Order: most recent first
- `date_range` = overall tenure at the company (e.g. "2016 - 2023")
- Group all roles at the same company under ONE employer entry
- Roles listed from most recent to oldest within each employer
- `start_date` / `end_date` = just the year (e.g. "2021", "Present")
- `bullets` = verbatim from CV where possible, keeping concise action-focused statements
- Maximum ~10 bullets per role; trim duplicates

### education
- Order: most prestigious / most recent first
- `degree` = qualification type (BSc, MA, MBA, PhD, etc.)
- `field` = subject/discipline
- `year` = graduation year or "YYYY - YYYY" if multi-year shown on CV

### awards_and_certifications
- Include: professional certs, industry awards, fellowships, accreditations
- Exclude: generic online courses unless highly relevant
- `year` = year awarded/obtained (if shown)

### additional_information
- Include ONLY content NOT captured in other sections
- Examples: languages, publications, board memberships, volunteer work,
  professional associations, patents, media appearances
- Each item = one string in the array
- Exclude: contact details, address, headshots, references

### missing_sections
- List the KEY NAME of any section that has absolutely no data:
  - `"professional_experience"`
  - `"education"`
  - `"awards_and_certifications"`
- Do NOT list `"additional_information"` here — it's optional and expected to sometimes be empty
