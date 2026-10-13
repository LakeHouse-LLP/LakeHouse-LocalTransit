#!/usr/bin/env node
/**
 * DCO sign-off check for commits on a pull request.
 */
import { readFileSync, existsSync } from "node:fs";
import { git } from "./lib/repo.mjs";

const SIGN_OFF = /^Signed-off-by:\s+.+\s+<.+@.+>$/m;

function prCommitRange() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && existsSync(eventPath)) {
    const event = JSON.parse(readFileSync(eventPath, "utf8"));
    const base = event.pull_request?.base?.sha;
    const head = event.pull_request?.head?.sha;
    if (base && head) return { base, head };
  }
  const baseRef = process.env.GITHUB_BASE_REF || "main";
  git(["fetch", "origin", baseRef, "--depth=50"], { ignoreError: true });
  return { base: `origin/${baseRef}`, head: "HEAD" };
}

function main() {
  if (process.env.GITHUB_EVENT_NAME && process.env.GITHUB_EVENT_NAME !== "pull_request") {
    console.log(`OK dco: skip on ${process.env.GITHUB_EVENT_NAME}`);
    return;
  }

  const { base, head } = prCommitRange();
  // %an/%ae let us skip automation commits that cannot carry a human DCO trailer
  // (changesets/action Version PR, Dependabot).
  const log = git(
    ["log", "--format=%H%n%an%n%ae%n%B%n--END--", `${base}..${head}`],
    { ignoreError: true },
  );
  if (!log) {
    console.log("OK dco: no commits in range");
    return;
  }

  const isBot = (name, email) =>
    /\[bot\]$/i.test(name || "") ||
    /\[bot\]@users\.noreply\.github\.com$/i.test(email || "");

  const commits = log.split("--END--").map((b) => b.trim()).filter(Boolean);
  const missing = [];
  let skippedBots = 0;
  for (const block of commits) {
    const lines = block.split("\n");
    const sha = lines[0];
    const authorName = lines[1] ?? "";
    const authorEmail = lines[2] ?? "";
    const body = lines.slice(3).join("\n");
    // Skip known bot merge noise when message indicates merge from GitHub
    if (/^Merge\s+/i.test(lines[3] ?? "")) continue;
    if (isBot(authorName, authorEmail)) {
      skippedBots += 1;
      continue;
    }
    if (!SIGN_OFF.test(body)) missing.push(sha.slice(0, 8));
  }

  if (missing.length) {
    console.error("dco-check: missing Signed-off-by on commits:");
    for (const sha of missing) console.error(`  - ${sha}`);
    console.error("Hint: git commit -s --amend  (or rebase with signoff)");
    process.exit(1);
  }

  const botNote = skippedBots ? ` (skipped ${skippedBots} bot commit(s))` : "";
  console.log(`OK dco: ${commits.length} commit(s) signed off${botNote}`);
}

main();
