#!/usr/bin/env node
/**
 * Render .github/release-notes-template.md for a given version/tag.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ROOT, expectedRemoteFromEnvOrGit } from "./lib/repo.mjs";
import { loadOrg, publicBaseUrl, resolveOrgOwner } from "./lib/org.mjs";

const TEMPLATE = path.join(ROOT, ".github", "release-notes-template.md");

function main() {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const versionArg = process.argv[2] || pkg.version;
  const tag = versionArg.startsWith("v") ? versionArg : `v${versionArg}`;
  const semver = tag.replace(/^v/, "");
  const org = loadOrg();
  const owner = resolveOrgOwner(org);
  const remote = expectedRemoteFromEnvOrGit();
  const repo = remote?.name || "Template-OpenSource";
  const base = publicBaseUrl(org);
  const githubRepo = `https://github.com/${owner}/${repo}`;
  const publicBase = base ?? `(set domain in .lakehouse/org.json; currently ${org.domain})`;

  let body = readFileSync(TEMPLATE, "utf8");
  const replacements = {
    "{{VERSION}}": semver,
    "{{TAG}}": tag,
    "{{BRAND}}": org.brand,
    "{{PACKAGE_SCOPE}}": org.packageScope,
    "{{DOMAIN}}": org.domain,
    "{{PUBLIC_BASE}}": publicBase,
    "{{GITHUB_REPO}}": githubRepo,
    "{{CHANGELOG_URL}}": `${githubRepo}/blob/main/CHANGELOG.md`,
    "{{PACKAGE_NAME}}": pkg.name,
  };
  for (const [key, value] of Object.entries(replacements)) {
    body = body.split(key).join(value);
  }

  // release-notes output may include the org slug via githubRepo — write only under release-assets (gitignored)
  const outDir = path.join(ROOT, "release-assets");
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "RELEASE_NOTES.md");
  writeFileSync(out, body);
  console.log(`release-notes: wrote ${out}`);
}

main();
