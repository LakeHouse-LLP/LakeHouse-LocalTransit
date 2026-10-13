#!/usr/bin/env node
/** Validate .lakehouse/org.json domain / packageScope invariants. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";
import {
  loadOrg,
  publicBaseUrl,
  isDomainPlaceholder,
  DOMAIN_PLACEHOLDER,
} from "./lib/org.mjs";

// Constructed so this file does not embed the forbidden hostname literally.
const FORBIDDEN_ASSUMED_DOMAINS = [["opensource", "lakehouse", "dev"].join(".")];
const SKIP_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build", "release-assets"]);

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

function main() {
  const org = loadOrg();
  if (/\.github\.io$/i.test(org.domain)) {
    console.error("org: domain must not be github.io");
    process.exit(1);
  }

  const base = publicBaseUrl(org);
  const domainDesc = isDomainPlaceholder(org.domain)
    ? `${DOMAIN_PLACEHOLDER} (pending)`
    : base;

  const offenders = [];
  for (const abs of walk(ROOT)) {
    const rel = path.relative(ROOT, abs).split(path.sep).join("/");
    if (rel === "CHANGELOG.md" || /(^|\/)CHANGELOG\.md$/i.test(rel)) continue;
    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    for (const host of FORBIDDEN_ASSUMED_DOMAINS) {
      if (text.includes(host)) offenders.push(`${rel} (contains ${host})`);
    }
  }
  if (offenders.length) {
    console.error("org: forbidden assumed domain found (Sen has not chosen a domain):");
    for (const row of offenders) console.error(`  - ${row}`);
    process.exit(1);
  }

  console.log(
    `OK org: brand=${org.brand} scope=${org.packageScope} domain=${domainDesc}`,
  );
}

main();
