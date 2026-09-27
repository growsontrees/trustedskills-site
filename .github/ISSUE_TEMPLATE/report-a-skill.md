---
name: Report a skill
about: A skill in the index is malicious, broken, or misrepresented by its badge.
title: 'Report: '
labels: skill-report
---

We read every report and can delist a skill from the index. We don't promise a
response time.

**Which skill** — the trustedskills.dev page, or its slug:

**What's wrong** — keep the closest one:

- It does something malicious or undisclosed
- Its install command doesn't work
- Its badge or metadata misrepresents it
- Its upstream repository is gone or now private
- Something else

**What you saw.** The commands you ran, the files you read, the commit shown on
the skill page. Concrete beats certain — a paste of the offending lines is more
use to us than a verdict.

---

If the skill also ships as an npm package, report it to npm separately at
security@npmjs.com. Delisting here does not remove it from npm.

To report a security flaw in this site rather than in a listed skill, use the
repository's Security tab if private reporting is enabled there; otherwise open
a site bug and leave out any exploit detail.
