#!/usr/bin/env node
/**
 * Tests for the collection-entry install-status check used by
 * scripts/validate-editorial.mjs.
 *
 * A collection entry can point at a skill that no longer installs cleanly
 * (registry `install_status` other than "ok" — missing, invalid, repo_gone,
 * renamed, or not set at all). That should not fail the build — the entry
 * still resolves to a real registry slug — but it should not pass silently
 * either, since a curated pick that no longer installs is stale editorial
 * content. This is a warning, not an error.
 *
 * Usage: node --test scripts/editorial-checks.test.mjs
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { installStatusWarning } from "./lib/editorial-checks.mjs";

test("a skill with install_status \"ok\" produces no warning", () => {
  const entry = { skillSlug: "find-keywords" };
  const skill = { slug: "find-keywords", install_status: "ok" };
  assert.equal(installStatusWarning(entry, skill), null);
});

test("a skill with install_status \"missing\" produces a warning naming the slug and status", () => {
  const entry = { skillSlug: "seo-meta" };
  const skill = { slug: "seo-meta", install_status: "missing" };
  const message = installStatusWarning(entry, skill);
  assert.notEqual(message, null);
  assert.match(message, /seo-meta/);
  assert.match(message, /missing/);
});

test("a skill with install_status \"invalid\" produces a warning naming the slug and status", () => {
  const entry = { skillSlug: "technical-seo-checker" };
  const skill = { slug: "technical-seo-checker", install_status: "invalid" };
  const message = installStatusWarning(entry, skill);
  assert.notEqual(message, null);
  assert.match(message, /technical-seo-checker/);
  assert.match(message, /invalid/);
});

test("a skill with install_status \"repo_gone\" produces a warning", () => {
  const entry = { skillSlug: "old-skill" };
  const skill = { slug: "old-skill", install_status: "repo_gone" };
  const message = installStatusWarning(entry, skill);
  assert.notEqual(message, null);
  assert.match(message, /old-skill/);
  assert.match(message, /repo_gone/);
});

test("a skill with install_status \"renamed\" produces a warning", () => {
  const entry = { skillSlug: "agent-browser" };
  const skill = { slug: "agent-browser", install_status: "renamed" };
  const message = installStatusWarning(entry, skill);
  assert.notEqual(message, null);
  assert.match(message, /agent-browser/);
  assert.match(message, /renamed/);
});

test("a skill with no install_status field at all still produces a warning", () => {
  const entry = { skillSlug: "unchecked-skill" };
  const skill = { slug: "unchecked-skill" };
  const message = installStatusWarning(entry, skill);
  assert.notEqual(message, null);
  assert.match(message, /unchecked-skill/);
});

test("a missing skill (not in the registry index) is left to the existing registry check — no warning here", () => {
  const entry = { skillSlug: "does-not-exist" };
  assert.equal(installStatusWarning(entry, undefined), null);
});
