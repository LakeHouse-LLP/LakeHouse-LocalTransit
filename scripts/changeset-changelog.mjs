/**
 * Changesets changelog adapter — wraps @changesets/changelog-github with a
 * repo resolved from github.repository_owner / .lakehouse/org.json (no hardcoded org).
 */
import github from "@changesets/changelog-github";
import { loadOrg, resolveOrgOwner } from "./lib/org.mjs";
import { expectedRemoteFromEnvOrGit } from "./lib/repo.mjs";

function resolveRepo(options = {}) {
  if (options.repo) return options.repo;
  const org = loadOrg();
  const owner = resolveOrgOwner(org);
  const remote = expectedRemoteFromEnvOrGit();
  const name = remote?.name || process.env.GITHUB_REPOSITORY?.split("/")[1] || "Template-OpenSource";
  return `${owner}/${name}`;
}

export async function getReleaseLine(changeset, type, options) {
  return github.getReleaseLine(changeset, type, {
    ...options,
    repo: resolveRepo(options),
  });
}

export async function getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
  return github.getDependencyReleaseLine(changesets, dependenciesUpdated, {
    ...options,
    repo: resolveRepo(options),
  });
}

export default {
  getReleaseLine,
  getDependencyReleaseLine,
};
