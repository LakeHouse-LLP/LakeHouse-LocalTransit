#!/usr/bin/env node
/**
 * Run the free gitleaks CLI (full history in CI, protect --staged pre-commit).
 */
import { spawnSync, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";

const CONFIG = path.join(ROOT, ".gitleaks.toml");

function findGitleaks() {
  if (process.env.GITLEAKS_PATH && existsSync(process.env.GITLEAKS_PATH)) {
    return process.env.GITLEAKS_PATH;
  }
  const probe = spawnSync("gitleaks", ["version"], { encoding: "utf8" });
  if (probe.status === 0) return "gitleaks";
  return null;
}

function main() {
  const preCommit = process.argv.includes("--pre-commit");
  const bin = findGitleaks();
  if (!bin) {
    if (preCommit && process.env.GITLEAKS_OPTIONAL === "1") {
      console.warn("gitleaks: CLI not installed; skipping (GITLEAKS_OPTIONAL=1)");
      return;
    }
    console.error(
      "gitleaks: CLI not found on PATH. Install from https://github.com/gitleaks/gitleaks/releases",
    );
    process.exit(1);
  }

  const args = preCommit
    ? ["protect", "--staged", "--redact", "--config", CONFIG, "--verbose"]
    : ["detect", "--source", ROOT, "--redact", "--config", CONFIG, "--verbose", "--log-opts", "--all"];

  // Full history: ensure we are not shallow when not pre-commit
  if (!preCommit && process.env.CI === "true") {
    try {
      execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
        cwd: ROOT,
        encoding: "utf8",
      });
    } catch {
      // ignore
    }
  }

  const result = spawnSync(bin, args, { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  console.log(preCommit ? "OK gitleaks: staged clean" : "OK gitleaks: history clean");
}

main();
