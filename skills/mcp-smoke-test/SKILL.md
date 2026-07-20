---
name: mcp-smoke-test
description: >
  Connectivity test for the Sinecure MCP server (explorator). Confirms a skill
  can reach an MCP tool end-to-end. Trigger on "test sinecure connection",
  "mcp smoke test", "test the connector", "am I connected to explorator", or
  "who am I on explorator".
---

# Sinecure MCP smoke test

<!-- Version 1.0.0 — June 2026 -->

A minimal probe that proves this skill can call a tool on the **sinecure-mcp**
server. It calls one read-only, no-argument tool — `users_info` — and reports
the result. It changes nothing.

## What to do

### 1. Find the tool

Look in the currently available tools for the Sinecure MCP tool `users_info`.
Depending on the client it appears as:

- **claude.ai / desktop connector:** `users_info` (under the Sinecure / explorator connector)
- **Claude Code CLI:** `mcp__<server>__users_info` (e.g. `mcp__sinecure-mcp__users_info`)

**If no such tool is present → the connector is NOT connected.** Do not guess or
fabricate a result. Tell the user exactly this and stop:

> The Sinecure MCP connector isn't connected in this session, so there's no
> `users_info` tool to call. Connect it first:
> - **claude.ai (Free/Pro):** Settings → Connectors → Add custom connector →
>   URL `https://sinecure-mcp-195168151102.us-central1.run.app/mcp` → Connect.
> - **Team/Enterprise:** an Owner adds it under Organization settings →
>   Connectors → Add → Custom → Web (same URL); then Connect under Connectors.
> - **Claude Code:** add the server via `/mcp` (or `claude mcp add`) pointing at
>   the same `/mcp` URL.
> After connecting, re-run this test.

### 2. Call it

If the tool is present, call `users_info` with **no arguments**.

### 3. Interpret the result

- **Success** (a profile object comes back): report the user's name, email, and
  role/organization from the response, then confirm:
  > ✅ Skill → MCP tool round-trip works. `users_info` returned your explorator
  > profile. The connector is connected and authenticated.

- **Auth error** (the tool returns 401 / "unauthorized" / "not authenticated" /
  "login required", or an OAuth/token error): the connector is added but the
  user hasn't completed sign-in. Do NOT retry in a loop. Tell the user:
  > The connector is present but not authenticated. This tool requires you to
  > sign in: open the connector and complete the browser login with your
  > **explorator email + password** (claude.ai never sees the password). Then
  > re-run this test.
  >
  > Note: authentication is a browser OAuth flow the user performs — I can't
  > sign in on your behalf or accept any pasted tokens/codes.

- **Any other error:** report the error message verbatim and stop; don't invent
  a profile.

## Guardrails

- This is a **read-only** probe. Never call any write/mutating tool as part of it.
- Never fabricate a profile or a "success" if the tool is absent or errors —
  the whole point is to detect the real connection state.
