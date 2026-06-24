# sinecure-skills

Sinecure's recruiting & platform skills, delivered as a Claude Code / Cowork
plugin. All skills are **bundled natively** in this repo, so they work
everywhere the plugin is installed — CLI, desktop app, and Cowork remote
sandboxes alike.

## Layout

```
sinecure-ai/skills
├── .claude-plugin/        plugin + marketplace metadata
└── skills/                the skills — each a folder with a SKILL.md
    ├── using-sinecure-skills/   lightweight index / router (optional)
    ├── retained-search-workflow/
    └── gbcv-reformatter/
```

Every skill lives under `skills/` and is auto-discovered by Claude Code via its
`SKILL.md` frontmatter. No hooks, no runtime sync — the same plain native
pattern as a normal plugin.

## Install (team members)

### CLI (Claude Code terminal)

```
/plugin marketplace add sinecure-ai/skills
/plugin install sinecure-skills@sinecure-marketplace
```

### Desktop app

1. Open **Customize → Add plugin** (the plugins/marketplace panel).
2. Paste the repo URL: `https://github.com/sinecure-ai/skills`
3. Click **Sync**, then install **sinecure-skills**.

Restart the session after installing.

## Updating

Skills ship with the plugin, so new versions arrive when the plugin updates.

**Recommended — turn on auto-update once, then it's hands-off.** Claude Code
auto-updates plugins at startup, but for third-party marketplaces this is OFF
by default. Enable it per user via `/plugin` → Marketplaces → `sinecure-marketplace`
→ enable auto-update, or org-wide via managed `settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "sinecure-marketplace": {
      "source": { "source": "github", "repo": "sinecure-ai/skills" },
      "autoUpdate": true
    }
  }
}
```

**Manual fallback:** `claude plugin update sinecure-skills@sinecure-marketplace`
(or re-sync the marketplace in the desktop app).

This plugin uses **commit-SHA versioning** — neither manifest declares a
`version`, so every commit to `main` is treated as a new version. Just edit a
skill, commit, and push; with auto-update on, teammates pick it up at their next
startup. No version bump, no manual update command. (If you later want stable,
controlled releases instead, add `"version": "x.y.z"` to `plugin.json` and bump
it on each release.)

> There is no zero-touch git auto-pull baked into the plugin. Remote sandboxes
> (Cowork / claude.ai) can't reach a local clone, and plugin hooks don't run
> there, so reliable cross-environment delivery comes from bundling skills and
> letting the client's plugin auto-update handle freshness.

## Editing & adding skills

Each skill is a folder under `skills/` with a `SKILL.md` (plus optional
`scripts/`, `references/`, `assets/`). To add a skill: drop its folder in
`skills/`, optionally list it in `using-sinecure-skills/SKILL.md`, bump the
version, commit, and push.

### Versioning convention

- Add a comment near the top of each `SKILL.md` body: `<!-- Version X.Y.Z — Month Year -->`
- Bump it on meaningful behavior changes.
- Use commit history for the real changelog.
