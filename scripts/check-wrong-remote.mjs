#!/usr/bin/env node
/**
 * WRONG_REMOTE guard — origin must match the expected GitHub owner/name.
 * Owner comes from github.repository_owner (CI) or .lakehouse/org.json.
 */
import { expectedRemoteFromEnvOrGit, git, parseGithubRemote } from "./lib/repo.mjs";
import { loadOrg, resolveOrgOwner } from "./lib/org.mjs";

function main() {
  const org = loadOrg();
  const expectedOwner = resolveOrgOwner(org);

  const origin = git(["remote", "get-url", "origin"], { ignoreError: true });
  if (!origin) {
    console.error("WRONG_REMOTE: no git remote named origin");
    process.exit(1);
  }

  const actual = parseGithubRemote(origin);
  if (!actual) {
    console.error("WRONG_REMOTE: origin is not a GitHub remote");
    process.exit(1);
  }

  const expected = expectedRemoteFromEnvOrGit();
  if (!expected) {
    console.error("WRONG_REMOTE: could not determine expected owner/name");
    process.exit(1);
  }

  if (actual.owner !== expected.owner || actual.name !== expected.name) {
    console.error(
      `WRONG_REMOTE: origin is ${actual.owner}/${actual.name}, expected ${expected.owner}/${expected.name}`,
    );
    process.exit(1);
  }

  if (actual.owner !== expectedOwner) {
    console.error(
      `WRONG_REMOTE: origin org is ${actual.owner}, expected ${expectedOwner} (from github.repository_owner or org.json)`,
    );
    process.exit(1);
  }

  if (actual.name.startsWith("Template-") && process.env.ALLOW_TEMPLATE_REMOTE !== "1") {
    const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? actual.name;
    if (repo !== actual.name) {
      console.error(
        `WRONG_REMOTE: refusing Template-* remote for non-template checkout (${actual.name})`,
      );
      process.exit(1);
    }
  }

  console.log(`OK remote: ${actual.owner}/${actual.name}`);
}

main();
