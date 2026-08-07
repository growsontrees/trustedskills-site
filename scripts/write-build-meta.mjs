#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve from this file rather than a fixed path: the build now runs in CI and
// in a container, neither of which is the old /opt/trustedskills checkout.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const buildIdPath = join(root, ".next", "BUILD_ID");
const outputPath = join(root, "public", "__build.json");

const buildId = readFileSync(buildIdPath, "utf8").trim();
const payload = {
  buildId,
  generatedAt: new Date().toISOString(),
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Wrote ${outputPath} for build ${buildId}`);
