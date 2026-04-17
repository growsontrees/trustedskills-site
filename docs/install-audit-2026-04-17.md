# Install Audit — 2026-04-17

## Why this audit happened

TrustedSkills was over-generating Claude Code install commands for some skills where the underlying data only proved:
- Claude Desktop / generic Claude support
- MCP support
- or a custom upstream install flow

This caused misleading install instructions, especially on `claude-seo`.

## Audit scope

Risk bucket reviewed:
- skills with `claude` in `platforms`
- but without `claudecode`

Count at audit time: **26**

## Changes applied

### 1. Explicit override added

#### `claude-seo`
- `preferredPlatform: "claudecode"`
- `installOverrides.claudecode.supported = true`
- `installOverrides.claudecode.mode = "custom"`
- uses upstream repo install flow instead of generated `claude mcp add ...`

### 2. MCP-first defaults added

These skills are direct MCP-style installs and should not default to Claude Desktop just because `claude` appears in `platforms`:
- `search-console-mcp`
- `gsc-mcp`
- `google-analytics-mcp`

Applied:
- `preferredPlatform: "mcp"`

### 3. Shared UI fallback hardened

The shared platform install helper now falls back to the recorded install command when the selected platform is not explicitly supported, instead of fabricating a platform-specific install.

## Remaining conservative bucket

The following skills were left conservative for now. They may work with Claude Code or other clients, but TrustedSkills should not claim a generated one-command install without explicit proof:

- `github-assistant`
- `content-humanizer`
- `seo-eeat-checker`
- `nano-banana-prompts`
- `nemp-memory`
- `learn`
- `agent-deep-research`
- `obsidian-skills`
- `agent-second-brain`
- `seo-audit`
- `seo-competitor-pages`
- `seo-content`
- `seo-geo`
- `seo-hreflang`
- `seo-images`
- `seo-page`
- `seo-plan`
- `seo-programmatic`
- `seo-schema`
- `seo-sitemap`
- `seo-technical`
- `calendar-sync`

## Guiding rule going forward

Do not generate platform-specific install instructions unless one of these is true:
- explicit platform support is recorded
- the install shape is known-safe for that platform
- a custom override exists for that skill/platform pair

If data is ambiguous, prefer conservative fallback over fabricated convenience.
