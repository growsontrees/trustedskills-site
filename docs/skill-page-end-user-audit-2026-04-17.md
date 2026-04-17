# Skill Page Audit — End User Perspective (2026-04-17)

## Audit lens

This review asks the page the kinds of questions a skeptical end user would ask in the first 10–30 seconds:

1. **What is this, in plain English?**
2. **Can I trust it?**
3. **Can I install it on my setup right now?**
4. **What is the canonical source of truth?**
5. **Am I being shown real instructions, or guessed ones?**
6. **What do I need before I try this?**
7. **Is this page helping me decide, or just dumping metadata at me?**

---

## What the page now does well

### 1. Install flow is much less noisy
The page is substantially better after collapsing duplicated install UI into one install section.

**User impact:**
- less visual clutter
- less contradictory guidance
- easier to understand the main action

### 2. Platform auto-selection is directionally correct
Examples now behave more like users would expect:
- `claude-seo` -> Claude Code first
- MCP-first tools -> MCP first
- explicit Claude Code skills -> Claude Code first

**User impact:**
- less friction
- less confusion about "why is OpenClaw being pushed here?"

### 3. Conservative fallback is safer
The site is no longer inventing Claude Code one-liners in obvious bad cases.

**User impact:**
- fewer false installs
- higher trust

### 4. Markdown longDescription rendering is much better
Rich formatting makes the “About This Skill” section readable instead of raw markdown noise.

---

## Remaining end-user weaknesses

### 1. The page still assumes too much user context
A new user may still not know:
- whether this skill is mainly a repository, package, MCP server, OpenClaw skill, or wrapper
- whether the shown install path is the easiest path or merely a compatible path

**Critical question:**
> If I land here from Google with no prior TrustedSkills context, do I instantly know what kind of thing I am installing?

**Current answer:** not always.

### 2. Canonical source was not prominent enough
Historically the page over-emphasized registry/source mirrors before the repository.

That is backwards for user trust.

**Rule:**
- repository first when available
- then source mirror / skills.sh / author site as secondary

### 3. Requirements are useful but too low on the page
A user often wants to know *before* installing:
- Do I need Node?
- Python?
- API keys?
- Claude Desktop developer mode?
- a local config file?

**Critical question:**
> Can I tell in 5 seconds whether I am actually ready to use this?

**Current answer:** only sometimes.

### 4. The trust story is split across multiple boxes
There is useful information in:
- verification section
n- pinned commit area
- security audits table
- sidebar verification card

But it is distributed rather than summarized.

**Critical question:**
> Can I understand what TrustedSkills verified, and what it did not verify, without reading three separate boxes?

**Current answer:** not cleanly enough.

### 5. The page is still metadata-heavy relative to decision support
Some elements answer database questions more than user questions.

Examples of user-first questions the page should answer more directly:
- Is this actively maintained?
- Is the upstream repo the main place to read docs?
- Is this beginner-friendly?
- Does this need credentials?
- Is this better for Claude Desktop, Claude Code, or generic MCP?

---

## Recommended next UX improvements

## Priority 1 — high value, low risk

### A. Keep repository as the primary external link everywhere
Implemented direction:
- repository should be the first/prompted “more info” link
- secondary links should be clearly labeled as mirror/listing/source pages

### B. Add a compact “Before you install” summary near the install block
Suggested contents:
- primary runtime: Node / Python / shell script / repo clone
- config needed: yes/no
- env vars needed: count or names
- best for: Claude Code / Claude Desktop / MCP / OpenClaw

### C. Add a single-sentence “canonical source” hint
Example:
- “The repository is the canonical source for docs and updates. TrustedSkills verifies a pinned snapshot for safer installs.”

## Priority 2 — medium effort, strong payoff

### D. Replace generic audit table with a clearer trust summary
Instead of only showing passes, summarize:
- reviewed by TrustedSkills? yes/no
- pinned commit? yes/no
- automated scans passed? yes/no
- update drift detected? yes/no

### E. Improve the description hierarchy
Recommended order:
1. short description
2. install section
3. quick trust/canonical source summary
4. about / long description
5. requirements
6. details / metadata

### F. Add explicit “best fit” phrasing
Examples:
- “Best for Claude Code users who want…”
- “Best used as a generic MCP server in Claude Desktop, Cursor, or VS Code”

That would reduce platform ambiguity without needing users to infer from tabs alone.

## Priority 3 — later

### G. Add a “why this platform was chosen” explainer only when helpful
Not on every page. Only when the default might surprise the user.

### H. Consider collapsing low-value metadata by default
If details are not part of install or trust decisions, they should be visually quieter.

---

## Working principle

A good skill page should help the user answer three things fast:

1. **Should I trust this?**
2. **Can I install this on my setup right now?**
3. **Where do I go for the real docs and source?**

If any UI element does not help answer one of those, it should probably be demoted.
