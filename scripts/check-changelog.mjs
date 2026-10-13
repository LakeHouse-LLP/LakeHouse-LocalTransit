#!/usr/bin/env node
/**
 * Require CHANGELOG.md (or a changeset file) on PRs unless skip-changelog label is present.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { ROOT, git } from "./lib/repo.mjs";

function labelsFromEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !existsSync(eventPath)) return [];
  const event = JSON.parse(readFileSync(eventPath, "utf8"));
  const labels = event.pull_request?.labels ?? event.issue?.labels ?? [];
  return labels.map((l) => (typeof l === "string" ? l : l.name)).filter(Boolean);
}

function changedFiles(baseRef) {
  if (process.env.CHANGED_FILES) {
    return process.env.CHANGED_FILES.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  const base = baseRef || process.env.GITHUB_BASE_REF || "main";
  git(["fetch", "origin", base, "--depth=1"], { ignoreError: true });
  const out = git(["diff", "--name-only", `origin/${base}...HEAD`], { ignoreError: true });
  if (out) return out.split(/\r?\n/).filter(Boolean);
  const unstaged = git(["diff", "--name-only", "HEAD"], { ignoreError: true });
  const staged = git(["diff", "--name-only", "--cached"], { ignoreError: true });
  return [...new Set(`${unstaged}\n${staged}`.split(/\r?\n/).filter(Boolean))];
}

function hasChangeset(files) {
  return files.some(
    (f) =>
      f === "CHANGELOG.md" ||
      f.startsWith(".changeset/") ||
      f.startsWith("changesets/") ||
      f.startsWith("changelog/"),
  );
}

function main() {
  const labels = labelsFromEvent();
  if (labels.includes("skip-changelog")) {
    console.log("OK changelog: skip-changelog label present");
    return;
  }

  // Local non-PR runs: only warn unless --strict
  const strict = process.argv.includes("--strict") || process.env.GITHUB_EVENT_NAME === "pull_request";
  const files = changedFiles();
  if (files.length === 0 && !strict) {
    console.log("OK changelog: no changed files detected (local)");
    return;
  }

  if (!hasChangeset(files)) {
    // Allow empty changeset dir presence only when a new file was added there
    const changesetDir = path.join(ROOT, ".changeset");
    if (existsSync(changesetDir)) {
      const entries = readdirSync(changesetDir).filter((n) => n.endsWith(".md") && n !== "README.md");
      if (entries.length && files.some((f) => f.startsWith(".changeset/"))) {
        console.log("OK changelog: changeset file touched");
        return;
      }
    }
    console.error(
      "changelog-check: PR must update CHANGELOG.md (or a changeset) or carry the skip-changelog label",
    );
    process.exit(1);
  }

  console.log("OK changelog: CHANGELOG/changeset touched");
}

main();
