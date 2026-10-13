#!/usr/bin/env node
/**
 * Fail if any GitHub Actions workflow uses runs-on: self-hosted.
 * Public repos must use GitHub-hosted runners only.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";

const WORKFLOWS = path.join(ROOT, ".github", "workflows");

function listYamlFiles(dir) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    .map((name) => path.join(dir, name));
}

function stripCommentLines(text) {
  return text
    .split("\n")
    .map((line) => (line.trimStart().startsWith("#") ? "" : line))
    .join("\n");
}

function findSelfHostedRunsOn(text) {
  const lines = stripCommentLines(text).split("\n");
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*runs-on\s*:/i.test(lines[i])) continue;
    let block = lines[i];
    let end = i;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^\s*-/.test(lines[j]) || /^\s{2,}\S/.test(lines[j])) {
        block += `\n${lines[j]}`;
        end = j;
        continue;
      }
      break;
    }
    if (/\bself-hosted\b/i.test(block)) {
      hits.push(i + 1);
      i = end;
    }
  }
  return hits;
}

function main() {
  const files = listYamlFiles(WORKFLOWS);
  if (files.length === 0) {
    console.error("runner-guard: no workflows found under .github/workflows");
    process.exit(1);
  }

  const offenders = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const lineNo of findSelfHostedRunsOn(text)) {
      offenders.push(`${path.relative(ROOT, file)}:${lineNo}`);
    }
  }

  if (offenders.length > 0) {
    console.error("runner-guard: self-hosted runners are forbidden:");
    for (const item of offenders) console.error(`  - ${item}`);
    process.exit(1);
  }

  console.log(`OK runners: ${files.length} workflow(s), no self-hosted`);
}

main();
