#!/usr/bin/env node
/**
 * Fill <!-- AUTO:name --> blocks in README.md from .lakehouse/org.json.
 * Public badges/links use the custom domain when set (never *.github.io).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, expectedRemoteFromEnvOrGit, readText } from "./lib/repo.mjs";
import {
  loadOrg,
  publicBaseUrl,
  resolveOrgOwner,
  isDomainPlaceholder,
} from "./lib/org.mjs";

const README = path.join(ROOT, "README.md");
const BLOCK_RE = /<!-- AUTO:([a-z0-9_-]+) -->[\s\S]*?<!-- \/AUTO:\1 -->/g;

function tier() {
  try {
    return readText(".lakehouse/tier").trim();
  } catch {
    return "unknown";
  }
}

function licenseStatus() {
  const license = readText("LICENSE");
  if (/License pending/i.test(license)) {
    return {
      spdx: "pending",
      badgeLabel: "license%20pending",
      notice:
        "License is **pending** owner selection. Suggested default: [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). See [docs/license.md](./docs/license.md).",
    };
  }
  if (/Apache License/i.test(license)) {
    return {
      spdx: "Apache-2.0",
      badgeLabel: "Apache--2.0",
      notice: "Licensed under the [Apache License 2.0](./LICENSE).",
    };
  }
  return {
    spdx: "see-LICENSE",
    badgeLabel: "see%20LICENSE",
    notice: "See [LICENSE](./LICENSE) for terms.",
  };
}

function generators(org, remote) {
  const base = publicBaseUrl(org);
  const name = remote?.name ?? "Template-OpenSource";
  resolveOrgOwner(org);
  const lic = licenseStatus();
  const t = tier();
  const domainPending = isDomainPlaceholder(org.domain);
  const brandAlt = org.brand.replace(/"/g, "");

  const badges = domainPending
    ? [
        `[![CI](https://img.shields.io/badge/CI-domain%20pending-lightgrey)](./docs/org.md)`,
        `[![Release](https://img.shields.io/badge/release-domain%20pending-lightgrey)](./docs/org.md)`,
        `[![License](https://img.shields.io/badge/license-${lic.badgeLabel}-lightgrey)](./LICENSE)`,
        `[![OpenSSF Scorecard](https://img.shields.io/badge/Scorecard-domain%20pending-lightgrey)](./docs/org.md)`,
      ]
    : [
        `[![CI](${base}/badges/ci.svg)](${base}/ci)`,
        `[![Release](${base}/badges/release.svg)](${base}/releases)`,
        `[![License](https://img.shields.io/badge/license-${lic.badgeLabel}-lightgrey)](./LICENSE)`,
        `[![OpenSSF Scorecard](${base}/badges/scorecard.svg)](${base}/scorecard)`,
      ];

  const domainRow = domainPending
    ? `| Public domain | \`${org.domain}\` (set a real custom domain in org.json; never assume a hostname; never \`*.github.io\`) |`
    : `| Public domain | [\`${org.domain}\`](${base}/) |`;

  return {
    header: [
      `<picture>`,
      `  <source media="(prefers-color-scheme: dark)" srcset="brand/readme-header.svg" type="image/svg+xml" />`,
      `  <img src="brand/readme-header.png" alt="${brandAlt} Studio" width="1280" height="320" />`,
      `</picture>`,
    ].join("\n"),

    badges: badges.join("\n"),

    "repo-meta": [
      `| | |`,
      `| --- | --- |`,
      `| Brand | \`${org.brand}\` |`,
      `| Package scope | \`${org.packageScope}\` |`,
      domainRow,
      `| GitHub owner | runtime: \`github.repository_owner\` or \`.lakehouse/org.json\` \`orgName\` |`,
      `| Repository | \`${name}\` |`,
      `| Tier | \`${t}\` |`,
      `| License | \`${lic.spdx}\` (suggested: Apache-2.0) |`,
      `| Code owner | [@zsenarchitect](https://github.com/zsenarchitect) |`,
      `| Runners | GitHub-hosted only |`,
      `| Merge style | Merge commits only |`,
      `| Releases | changesets → CI \`vX.Y.Z\` tag → draft GH release + npm OIDC |`,
      `| Action pins | [\`.lakehouse/pins.json\`](./.lakehouse/pins.json) |`,
      `| Org runbook | \`{owner}/.github\` (see [docs/org.md](./docs/org.md)) |`,
    ].join("\n"),

    "license-notice": lic.notice,

    toc: [
      "- [About](#about)",
      "- [Quick start](#quick-start)",
      "- [Releasing](#releasing)",
      "- [Agent rules](#agent-rules)",
      "- [Contributing](#contributing)",
      "- [Security](#security)",
      "- [License](#license)",
    ].join("\n"),
  };
}

function applyBlocks(source, values) {
  return source.replace(BLOCK_RE, (_full, name) => {
    if (!(name in values)) {
      throw new Error(`README references unknown AUTO block: ${name}`);
    }
    return `<!-- AUTO:${name} -->\n${values[name]}\n<!-- /AUTO:${name} -->`;
  });
}

function main() {
  const check = process.argv.includes("--check");
  const org = loadOrg();
  const remote = expectedRemoteFromEnvOrGit();
  const values = generators(org, remote);
  const current = readFileSync(README, "utf8");
  const next = applyBlocks(current, values);

  const slug = org.orgName;
  if (next.includes(slug) || next.includes(slug.toLowerCase())) {
    console.error(
      "readme-gen: refusing to write org slug into README; use brand/domain/packageScope only",
    );
    process.exit(1);
  }
  if (next.includes(["opensource", "lakehouse", "dev"].join("."))) {
    console.error("readme-gen: refusing assumed public domain hostname");
    process.exit(1);
  }

  if (check) {
    if (next !== current) {
      console.error("readme-check: README.md AUTO blocks are stale. Run: npm run readme:gen");
      process.exit(1);
    }
    console.log("OK readme: AUTO blocks up to date");
    return;
  }

  writeFileSync(README, next);
  console.log("readme-gen: wrote README.md");
}

main();
