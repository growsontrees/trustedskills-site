#!/usr/bin/env node

const baseUrl = process.env.TRUSTEDSKILLS_BASE_URL || "https://trustedskills.dev";
const checks = [];

function ok(name, detail) {
  checks.push({ ok: true, name, detail });
}

function fail(name, detail) {
  checks.push({ ok: false, name, detail });
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  return { res, text };
}

async function fetchHead(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  return res;
}

function requireIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing expected marker: ${label}`);
  }
}

try {
  const home = await fetchText(baseUrl + "/");
  if (!home.res.ok) throw new Error(`Homepage returned ${home.res.status}`);
  requireIncludes(home.text, "TrustedSkills", "homepage brand");
  requireIncludes(home.text, "Top Skills", "homepage top skills section");
  requireIncludes(home.text, "Browse by Category", "homepage category section");
  ok("homepage html", `HTTP ${home.res.status}`);

  const cssMatch = home.text.match(/href="([^"]*\/_next\/static\/chunks\/[^"]+\.css)"/);
  if (!cssMatch) throw new Error("Could not find CSS asset href in homepage HTML");
  const cssUrl = cssMatch[1].startsWith("http") ? cssMatch[1] : new URL(cssMatch[1], baseUrl).toString();
  const css = await fetchHead(cssUrl);
  if (!css.ok) throw new Error(`CSS asset returned ${css.status}`);
  ok("css asset", `${css.status} ${cssUrl}`);

  const claudeSeo = await fetchText(baseUrl + "/skills/claude-seo");
  if (!claudeSeo.res.ok) throw new Error(`/skills/claude-seo returned ${claudeSeo.res.status}`);
  requireIncludes(claudeSeo.text, "Claude SEO Suite", "claude-seo page title");
  requireIncludes(claudeSeo.text, "Install on your platform", "claude-seo install section");
  requireIncludes(claudeSeo.text, "View repository install instructions", "claude-seo repo-first install link");
  ok("claude-seo page", `HTTP ${claudeSeo.res.status}`);

  const findSkills = await fetchText(baseUrl + "/skills/find-skills");
  if (!findSkills.res.ok) throw new Error(`/skills/find-skills returned ${findSkills.res.status}`);
  requireIncludes(findSkills.text, "Repository (canonical source)", "find-skills canonical repo link");
  ok("find-skills page", `HTTP ${findSkills.res.status}`);

  const searchPage = await fetchText(baseUrl + "/skills?q=seo");
  if (!searchPage.res.ok) throw new Error(`/skills?q=seo returned ${searchPage.res.status}`);
  requireIncludes(searchPage.text, "Skills", "skills listing page");
  ok("skills search route", `HTTP ${searchPage.res.status}`);
} catch (error) {
  fail("deployment verification", error instanceof Error ? error.message : String(error));
}

for (const check of checks) {
  const icon = check.ok ? "✓" : "✗";
  console.log(`${icon} ${check.name}: ${check.detail}`);
}

if (checks.some((c) => !c.ok)) {
  process.exit(1);
}
