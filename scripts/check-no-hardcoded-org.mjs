#!/usr/bin/env node
/**
 * Fail when the GitHub org slug is hardcoded outside the allowlist.
 * Needles come from .lakehouse/org.json (orgName + lowercase) so this file
 * never embeds the slug literally.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";
import { loadOrg } from "./lib/org.mjs";

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "coverage",
  "dist",
  "build",
  ".npm",
  "release-assets",
]);

function isAllowlisted(relPosix) {
  if (relPosix === ".lakehouse/org.json") return true;
  if (/(^|\/)CHANGELOG\.md$/i.test(relPosix)) return true;
  if (/(^|\/)changelog\//i.test(relPosix)) return true;
  if (/(^|\/)\.changeset\//i.test(relPosix)) return true;
  return false;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const abs = path.join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}

function isProbablyText(file) {
  const ext = path.extname(file).toLowerCase();
  if (
    [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
      ".ico",
      ".pdf",
      ".zip",
      ".gz",
      ".tgz",
      ".woff",
      ".woff2",
      ".ttf",
      ".otf",
      ".rvt",
      ".3dm",
      ".dwg",
    ].includes(ext)
  ) {
    return false;
  }
  return true;
}

function main() {
  const org = loadOrg();
  const needles = [...new Set([org.orgName, org.orgName.toLowerCase()])].filter(Boolean);
  if (needles.length === 0) {
    console.error("org-lint: no orgName needles");
    process.exit(1);
  }

  const offenders = [];
  for (const abs of walk(ROOT)) {
    const rel = path.relative(ROOT, abs).split(path.sep).join("/");
    if (isAllowlisted(rel) || !isProbablyText(abs)) continue;
    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    for (const needle of needles) {
      if (text.includes(needle)) {
        offenders.push(`${rel} (contains ${needle})`);
        break;
      }
    }
  }

  if (offenders.length) {
    console.error(
      "org-lint: hardcoded GitHub org slug found outside allowlist (.lakehouse/org.json, changelogs):",
    );
    for (const row of offenders) console.error(`  - ${row}`);
    console.error(
      "Use .lakehouse/org.json, github.repository_owner, or brand/domain/packageScope instead.",
    );
    process.exit(1);
  }

  console.log(
    `OK org-lint: no hardcoded slug (${needles.join(", ")}) outside allowlist`,
  );
}

main();
