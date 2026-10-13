import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadOrg, resolveOrgOwner } from "./org.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");

export function readText(relPath) {
  return readFileSync(path.join(ROOT, relPath), "utf8");
}

export function git(args, { ignoreError = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (ignoreError) return "";
    const stderr = error.stderr?.toString?.() ?? "";
    throw new Error(`git ${args.join(" ")} failed: ${stderr || error.message}`);
  }
}

export function parseGithubRemote(url) {
  if (!url) return null;
  const cleaned = url.trim().replace(/\|.*$/, "");
  const ssh = cleaned.match(/^git@github\.com:([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (ssh) return { owner: ssh[1], name: ssh[2] };
  const https = cleaned.match(
    /^https?:\/\/(?:[^@/\s]+@)?github\.com\/([^/]+)\/([^/.]+)(?:\.git)?\/?$/i,
  );
  if (https) return { owner: https[1], name: https[2] };
  return null;
}

export function expectedRemoteFromEnvOrGit() {
  const org = loadOrg();
  const owner = resolveOrgOwner(org);

  const fromEnv = process.env.EXPECTED_REMOTE?.trim();
  if (fromEnv) {
    const asRemote = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(fromEnv)
      ? `https://github.com/${fromEnv}`
      : fromEnv;
    const parsed = parseGithubRemote(asRemote);
    if (parsed) return parsed;
  }

  const serverRepo =
    process.env.GITHUB_REPOSITORY?.split("/")[1] ||
    process.env.EXPECTED_REPO?.trim() ||
    parseGithubRemote(git(["remote", "get-url", "origin"], { ignoreError: true }))?.name;

  if (owner && serverRepo) return { owner, name: serverRepo };

  const origin = git(["remote", "get-url", "origin"], { ignoreError: true });
  const parsed = parseGithubRemote(origin);
  if (parsed) return parsed;
  if (owner) return { owner, name: serverRepo || "unknown" };
  return null;
}
