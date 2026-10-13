#!/usr/bin/env node
import { accessSync, constants } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";

const required = [
  ".github/release.yml",
  ".github/release-notes-template.md",
  ".github/workflows/release.yml",
  ".github/workflows/changeset-version.yml",
  ".changeset/config.json",
  "docs/releasing.md",
  "docs/rollback.md",
  "docs/pre-release-checklist.md",
  "docs/repo-metadata.md",
  "docs/media/README.md",
  "docs/media/logo-light.svg",
  "docs/media/logo-dark.svg",
  "NOTICE",
];

function main() {
  for (const rel of required) {
    accessSync(path.join(ROOT, rel), constants.R_OK);
  }
  console.log(`OK release-files: ${required.length} paths present`);
}

main();
