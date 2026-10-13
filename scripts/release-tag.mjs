#!/usr/bin/env node
/**
 * Create an annotated SemVer tag vX.Y.Z from package.json.
 * Tags are created only in GitHub Actions CI — never by hand.
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function main() {
  if (process.env.GITHUB_ACTIONS !== "true") {
    console.error("release-tag: refusing to create tags outside GitHub Actions CI");
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const version = pkg.version;
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    console.error(`release-tag: invalid version ${version}`);
    process.exit(1);
  }
  if (version === "0.0.0") {
    console.log("release-tag: skip tagging 0.0.0");
    return;
  }

  const tag = `v${version}`;
  const existing = git(["tag", "-l", tag]);
  if (existing === tag) {
    console.log(`release-tag: ${tag} already exists`);
    return;
  }

  // Annotated tag (signing is org/ruleset-dependent; CI creates the annotation).
  git(["config", "user.name", "github-actions[bot]"]);
  git(["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
  git(["tag", "-a", tag, "-m", tag]);

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const remote = process.env.GITHUB_REPOSITORY;
  if (token && remote) {
    const url = `https://x-access-token:${token}@github.com/${remote}.git`;
    execFileSync("git", ["push", url, tag], { cwd: ROOT, stdio: "inherit" });
  } else {
    git(["push", "origin", tag]);
  }

  console.log(`release-tag: created ${tag}`);
}

main();
