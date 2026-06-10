# sinecure-skills

Sinecure's recruiting & platform skills, delivered as a single Claude Code /
Cowork plugin with **auto-syncing content**. One repo holds both the thin
plugin shell and the skill content; teammates get fresh skills every session
without running any command.

## How it works (and why it's built this way)

When Claude installs a plugin from a marketplace, it stores a **pinned,
git-less copy** under `~/.claude/plugins/cache/.../<version>/`. That copy
cannot update itself — bundled skills go stale until someone runs
`claude plugin update`.

To keep content fresh automatically, this plugin ships only a **bootstrap
skill** plus a **session-start hook**. The hook maintains its own git clone of
this repo at `~/.claude/sinecure-skills` and fast-forwards it each session. The
bootstrap skill reads skill content live from that clone's `content/` folder.

```
This repo (sinecure-ai/skills)
├── .claude-plugin/        plugin + marketplace metadata
├── hooks/                 session-start sync hook
├── skills/                bootstrap skill (the ONLY natively-bundled skill)
│   └── using-sinecure-skills/SKILL.md
└── content/               the actual skills — read live from the synced clone
    └── retained-search-workflow/SKILL.md
```

**Why content lives in `content/`, not `skills/`:** anything under `skills/`
gets bundled into the stale, git-less cache copy and registered as a native
skill. Putting content in `content/` keeps a single source of truth — the
hook-synced clone — and avoids a stale duplicate showing up in the picker.

## Install (team members)

```
/plugin marketplace add sinecure-ai/skills
/plugin install sinecure-skills@sinecure-marketplace
```

Restart the session. On first start the hook clones the content; on every later
start it syncs.

## Configuration (optional env vars)

| Variable                 | Default                                          | Purpose                          |
|--------------------------|--------------------------------------------------|----------------------------------|
| `SINECURE_SKILLS_REPO`   | `https://github.com/sinecure-ai/skills.git`      | Source of skill content          |
| `SINECURE_SKILLS_BRANCH` | `main`                                           | Branch to track                  |
| `SINECURE_SKILLS_DIR`    | `~/.claude/sinecure-skills`                      | Where content is cloned          |
| `SINECURE_AUTO_UPDATE`   | `true`                                           | `false` = warn only, never pull  |

## Editing skills

Each skill is a folder with a `SKILL.md` under `content/`. Edit, commit, push.
Every teammate picks up the change on their next session — no command needed.

### Versioning convention

There's no built-in skill versioning, so by convention:
- Add a comment near the top of each `SKILL.md` body: `<!-- Version X.Y.Z — Month Year -->`
- Bump it on meaningful behavior changes.
- Use commit history for the real changelog.

## Local edits & forks

The sync hook is safe with local work:
- **ahead** of upstream (local commits) → stays silent.
- **behind** → fast-forwards (only when the working tree is clean).
- **diverged** → warns and leaves resolution to you.

So you can experiment in `~/.claude/sinecure-skills` without the hook clobbering
your changes.

## What updates how

- **Skill content** → automatic, via the session-start hook. No command.
- **Plugin shell** (hook logic, bootstrap) → `claude plugin update sinecure-skills@sinecure-marketplace`, rarely.
