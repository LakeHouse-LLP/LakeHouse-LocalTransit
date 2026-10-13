#!/usr/bin/env node
/**
 * Generate CITATION.cff from .lakehouse/org.json (brand + custom domain).
 * Avoids embedding the mutable GitHub org slug so org-lint stays clean.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, expectedRemoteFromEnvOrGit, readText } from "./lib/repo.mjs";
import { loadOrg, publicBaseUrl, isDomainPlaceholder } from "./lib/org.mjs";

const OUT = path.join(ROOT, "CITATION.cff");

function yamlEscape(value) {
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || value !== value.trim()) {
    return JSON.stringify(value);
  }
  return value;
}

function buildCitation(org, remote) {
  const base = publicBaseUrl(org);
  const title = remote?.name ?? "Template-OpenSource";
  const licenseRaw = readText("LICENSE");
  const license = /License pending/i.test(licenseRaw)
    ? "pending"
    : /Apache License/i.test(licenseRaw)
      ? "Apache-2.0"
      : "SEE LICENSE";

  const authorWebsite = base ? `    website: ${base}/\n` : "";
  const urlBlock = base
    ? `repository-code: ${base}/\nurl: ${base}/`
    : `# repository-code/url pending — set domain in .lakehouse/org.json (currently ${org.domain})`;

  return `cff-version: 1.2.0
title: ${yamlEscape(title)}
message: >-
  If you use this software, please cite it using the metadata in this file.
  Projects created from this template should update title and authors to match
  the new repository (plain project name, no Template- prefix).
type: software
authors:
  - name: ${yamlEscape(org.brand)}
${authorWebsite}  - family-names: Zhang
    given-names: Sen
    alias: zsenarchitect
    website: https://github.com/zsenarchitect
${urlBlock}
license: ${license}
# Suggested license once finalized: Apache-2.0
keywords:
  - template
  - open-source
  - ${yamlEscape(org.brand.toLowerCase())}
  - ${yamlEscape(org.packageScope)}
abstract: >-
  Public GitHub template for ${org.brand} open-source projects. Provides
  OpenSSF-aligned defaults, README generation, changelog policy, secret
  scanning, and CI guards for zero-cost GitHub Free usage. Org identity lives
  in .lakehouse/org.json (brand-stable packageScope + custom domain${
    isDomainPlaceholder(org.domain) ? "; domain placeholder until Sen chooses one" : ""
  }).
`;
}

function main() {
  const check = process.argv.includes("--check");
  const org = loadOrg();
  const remote = expectedRemoteFromEnvOrGit();
  const next = buildCitation(org, remote);

  if (next.includes(org.orgName) || next.includes(org.orgName.toLowerCase())) {
    console.error("citation-gen: refusing to embed org slug in CITATION.cff");
    process.exit(1);
  }
  if (next.includes(["opensource", "lakehouse", "dev"].join("."))) {
    console.error("citation-gen: refusing assumed public domain hostname");
    process.exit(1);
  }

  if (check) {
    const current = readText("CITATION.cff");
    if (current !== next) {
      console.error("citation-check: CITATION.cff is stale. Run: npm run citation:gen");
      process.exit(1);
    }
    console.log("OK citation: up to date");
    return;
  }

  writeFileSync(OUT, next);
  console.log("citation-gen: wrote CITATION.cff");
}

main();
