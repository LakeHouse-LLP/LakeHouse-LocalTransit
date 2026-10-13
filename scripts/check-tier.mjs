#!/usr/bin/env node
/**
 * Tier guard — `.lakehouse/tier` must be `public`, and the GitHub repository
 * must not be private.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { ROOT, expectedRemoteFromEnvOrGit } from "./lib/repo.mjs";

const TIER_PATH = path.join(ROOT, ".lakehouse", "tier");

async function fetchVisibility(owner, name, token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lakehouse-tier-guard",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${owner}/${name}: ${await res.text()}`);
  }
  const body = await res.json();
  return {
    private: Boolean(body.private),
    visibility: body.visibility ?? (body.private ? "private" : "public"),
  };
}

async function main() {
  if (!existsSync(TIER_PATH)) {
    console.error("tier-guard: missing .lakehouse/tier");
    process.exit(1);
  }

  const tier = readFileSync(TIER_PATH, "utf8").trim();
  if (tier !== "public") {
    console.error(`tier-guard: .lakehouse/tier is "${tier}", expected "public"`);
    process.exit(1);
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && existsSync(eventPath)) {
    const event = JSON.parse(readFileSync(eventPath, "utf8"));
    const repo = event.repository;
    if (repo) {
      if (repo.private === true || repo.visibility === "private") {
        console.error("tier-guard: repository is private but tier is public");
        process.exit(1);
      }
      console.log(`OK tier: file=public visibility=${repo.visibility ?? "public"}`);
      return;
    }
  }

  const remote = expectedRemoteFromEnvOrGit();
  if (!remote) {
    console.error("tier-guard: cannot resolve owner/name for visibility check");
    process.exit(1);
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  try {
    const { private: isPrivate, visibility } = await fetchVisibility(
      remote.owner,
      remote.name,
      token,
    );
    if (isPrivate || visibility === "private") {
      console.error("tier-guard: repository is private but tier is public");
      process.exit(1);
    }
    console.log(`OK tier: file=public visibility=${visibility}`);
  } catch (error) {
    if (!token && process.env.CI !== "true") {
      console.warn(
        `tier-guard: skipped live visibility check (${error.message}). File tier=public OK.`,
      );
      return;
    }
    console.error(`tier-guard: ${error.message}`);
    process.exit(1);
  }
}

main();
