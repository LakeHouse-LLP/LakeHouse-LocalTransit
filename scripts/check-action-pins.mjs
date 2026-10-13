#!/usr/bin/env node
/**
 * Ensure workflow `uses:` action SHAs match `.lakehouse/pins.json`.
 * Reusable workflow catalog for the org `.github` runbook is also defined there.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/repo.mjs";
import { loadPins, resolveOrgOwner, loadOrg } from "./lib/org.mjs";

const WORKFLOWS = path.join(ROOT, ".github", "workflows");
const USES_RE =
  /^\s*uses:\s*(?:['"]?)([^@\s'"]+)@([0-9a-f]{40}|[A-Za-z0-9._/-]+)(?:['"]?)/;

function listWorkflows(dir) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  return readdirSync(dir)
    .filter((n) => n.endsWith(".yml") || n.endsWith(".yaml"))
    .map((n) => path.join(dir, n));
}

function actionKey(usesPath) {
  // github/codeql-action/init -> github/codeql-action
  const parts = usesPath.split("/");
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return usesPath;
}

function main() {
  const pins = loadPins();
  const org = loadOrg();
  const owner = resolveOrgOwner(org);
  const actions = pins.actions || {};
  const offenders = [];

  for (const file of listWorkflows(WORKFLOWS)) {
    const rel = path.relative(ROOT, file);
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, idx) => {
      if (line.trimStart().startsWith("#")) return;
      const m = line.match(USES_RE);
      if (!m) return;
      const [, usesPath, ref] = m;

      if (usesPath.startsWith("./") || usesPath.startsWith(".\\")) return;

      // Org reusable workflow: owner/.github/...
      if (usesPath.includes("/.github/")) {
        const expectedPrefix = `${owner}/.github/`;
        if (!usesPath.startsWith(expectedPrefix) && !usesPath.endsWith("/.github") && !/\/.github\//.test(usesPath)) {
          offenders.push(`${rel}:${idx + 1}: unexpected reusable workflow path ${usesPath}`);
        }
        const catalogRef = pins.reusableWorkflows?.ref || "main";
        if (ref !== catalogRef && !/^[0-9a-f]{40}$/i.test(ref)) {
          // allow sha or catalog ref
          if (ref !== catalogRef) {
            offenders.push(
              `${rel}:${idx + 1}: reusable workflow ref ${ref} not pins.reusableWorkflows.ref (${catalogRef}) or SHA`,
            );
          }
        }
        return;
      }

      if (!/^[0-9a-f]{40}$/i.test(ref)) {
        offenders.push(`${rel}:${idx + 1}: action ref must be full SHA (got ${usesPath}@${ref})`);
        return;
      }

      const key = actionKey(usesPath);
      const pin = actions[key];
      if (!pin) {
        offenders.push(`${rel}:${idx + 1}: ${key} not listed in .lakehouse/pins.json`);
        return;
      }
      if (pin.sha.toLowerCase() !== ref.toLowerCase()) {
        offenders.push(
          `${rel}:${idx + 1}: ${key} SHA ${ref} != pins ${pin.sha} (${pin.tag || ""})`,
        );
      }
    });
  }

  if (!pins.reusableWorkflows?.repo || pins.reusableWorkflows.repo !== ".github") {
    offenders.push("pins.reusableWorkflows.repo must be \".github\" (org runbook repo)");
  }

  if (offenders.length) {
    console.error("pins-check: failed:");
    for (const row of offenders) console.error(`  - ${row}`);
    process.exit(1);
  }

  console.log(
    `OK pins: workflows match .lakehouse/pins.json; org runbook → ${owner}/.github@${pins.reusableWorkflows.ref}`,
  );
}

main();
