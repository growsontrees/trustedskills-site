import assert from "node:assert/strict";
import test from "node:test";
import skillsData from "../data/skills-index.json" with { type: "json" };
import {
  getBrowsablePlatformKey,
  getPlatformBrowsePath,
  getPlatformFilters,
  getPlatformQueryPath,
  isPlatformKey,
  normalizeRegistryPlatforms,
  resolvePlatformKey,
} from "./platforms.ts";

test("normalizes registry aliases and deliberately ignores unsupported values", () => {
  assert.deepEqual(
    normalizeRegistryPlatforms(["vscode", "cursor", "claudecode", "nanoclaw", "unknown"]),
    ["vscode", "claudecode", "nanoclaw"]
  );
  assert.equal(resolvePlatformKey("cursor"), "vscode");
  assert.equal(resolvePlatformKey("claude-code"), "claudecode");
  assert.equal(resolvePlatformKey("not-a-platform"), null);
});

test("renders only non-zero canonical filters with counts", () => {
  const filters = getPlatformFilters([
    { platforms: ["claudecode"] },
    { platforms: ["vscode"] },
    { platforms: ["cursor"] },
    { platforms: ["unsupported"] },
  ]);

  assert.deepEqual(filters, [
    { key: "claudecode", label: "Claude Code", count: 1 },
    { key: "vscode", label: "VS Code / Cursor", count: 2 },
  ]);
});

test("query values and pretty routes resolve to the same canonical platform", () => {
  const fixtures = [{ platforms: ["vscode"] }];
  const platform = getBrowsablePlatformKey("cursor", fixtures);

  assert.equal(platform, "vscode");
  assert.equal(getPlatformBrowsePath(platform!), "/platform/vscode/");
  assert.equal(getPlatformQueryPath(platform!), "/skills?platform=vscode");
  assert.equal(getBrowsablePlatformKey("codex", fixtures), null);
});

test("the bundled Claude Code inventory is reachable through its canonical filter", () => {
  const filters = getPlatformFilters(skillsData.skills);
  const claudeCode = filters.find((filter) => filter.key === "claudecode");

  assert.deepEqual(
    filters.map(({ key, count }) => ({ key, count })),
    [
      { key: "openclaw", count: 133 },
      { key: "claudecode", count: 25_642 },
      { key: "vscode", count: 10 },
      { key: "mcp", count: 14 },
      { key: "claude", count: 26 },
      { key: "nanoclaw", count: 1 },
      { key: "openai", count: 1 },
    ]
  );
  for (const { key } of filters) {
    assert.ok(isPlatformKey(key));
    assert.equal(resolvePlatformKey(key), key);
    assert.equal(getBrowsablePlatformKey(key, skillsData.skills), key);
    assert.equal(getPlatformBrowsePath(key), `/platform/${key}/`);
  }
  assert.equal(claudeCode?.count, 25_642);
  assert.equal(getPlatformBrowsePath(claudeCode!.key), "/platform/claudecode/");
});
