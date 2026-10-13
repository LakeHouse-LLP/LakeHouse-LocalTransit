#!/usr/bin/env node
/**
 * Cross-platform pre-commit installer (Node). Installs a git hook that runs
 * gitleaks on staged changes using the free CLI.
 */
import { existsSync, mkdirSync, writeFileSync, chmodSync } from "node:fs";
import path from "node:path";
import { ROOT, git } from "./lib/repo.mjs";

const HOOK = `#!/usr/bin/env bash
# Installed by npm run hooks:install — do not add secrets here.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
if command -v node >/dev/null 2>&1; then
  node scripts/run-gitleaks.mjs --pre-commit
else
  echo "pre-commit: node is required to run gitleaks" >&2
  exit 1
fi
`;

function main() {
  const gitDir = git(["rev-parse", "--git-dir"]);
  const absGitDir = path.isAbsolute(gitDir) ? gitDir : path.join(ROOT, gitDir);
  const hooksDir = path.join(absGitDir, "hooks");
  mkdirSync(hooksDir, { recursive: true });
  const hookPath = path.join(hooksDir, "pre-commit");
  writeFileSync(hookPath, HOOK, { encoding: "utf8" });
  try {
    chmodSync(hookPath, 0o755);
  } catch {
    // Windows may ignore mode; git still executes via bash/shims.
  }

  if (!existsSync(path.join(ROOT, ".gitleaks.toml"))) {
    console.error("hooks:install: missing .gitleaks.toml");
    process.exit(1);
  }

  console.log(`OK hooks: installed ${path.relative(ROOT, hookPath)}`);
  console.log("Tip: ensure the gitleaks CLI is available (CI installs it; locally: https://github.com/gitleaks/gitleaks)");
}

main();
