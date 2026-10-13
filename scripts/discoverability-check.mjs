#!/usr/bin/env node
/**
 * Check README first paragraph + (on GitHub) description/topics via API.
 * Cross-platform Node. See docs/discoverability.md.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { ROOT } from "./lib/repo.mjs";

const MIN_TOPICS = 8;
const MAX_TOPICS = 20;
const MIN_DESC = 40;
const MAX_DESC = 350;
const MIN_PARA = 80;
const MAX_PARA = 600;

function stripMd(s) {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, (m) => {
      const t = m.match(/^\[([^\]]*)]/);
      return t ? t[1] : " ";
    })
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(readme) {
  const lines = readme.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (
      t === "" ||
      t.startsWith("#") ||
      t.startsWith("<") ||
      t.startsWith("![") ||
      t.startsWith("[![") ||
      t.startsWith("---") ||
      t.startsWith("<!--")
    ) {
      i++;
      continue;
    }
    break;
  }
  const buf = [];
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t === "") break;
    if (t.startsWith("#")) break;
    buf.push(t);
    i++;
  }
  return stripMd(buf.join(" "));
}

function ghApi(path) {
  const r = spawnSync("gh", ["api", path], { encoding: "utf8" });
  if (r.status !== 0) {
    return { ok: false, error: (r.stderr || r.stdout || "").trim() };
  }
  try {
    return { ok: true, data: JSON.parse(r.stdout) };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function main() {
  const errors = [];
  const readmePath = join(ROOT, "README.md");
  if (!existsSync(readmePath)) {
    errors.push("Missing README.md");
  } else {
    const para = firstParagraph(readFileSync(readmePath, "utf8"));
    if (para.length < MIN_PARA) {
      errors.push(
        `README first paragraph too short (${para.length} chars; want ≥ ${MIN_PARA}). See docs/discoverability.md.`,
      );
    } else if (para.length > MAX_PARA) {
      errors.push(
        `README first paragraph too long (${para.length} chars; want ≤ ${MAX_PARA}).`,
      );
    } else {
      console.log(`README first paragraph OK (${para.length} chars).`);
    }
    const lower = para.toLowerCase();
    if (!lower.includes("lakehouse") && !lower.includes("studio")) {
      console.log(
        "::warning::First paragraph should mention LakeHouse Studio or the product name.",
      );
    }
  }

  const onActions = process.env.GITHUB_ACTIONS === "true";
  const repo = process.env.GITHUB_REPOSITORY;
  const requireMeta = process.env.DISCOVERABILITY_REQUIRE_METADATA !== "false";
  if (onActions && repo) {
    const metaErrors = [];
    const meta = ghApi(`repos/${repo}`);
    if (!meta.ok) {
      metaErrors.push(`gh api repos/${repo} failed: ${meta.error}`);
    } else {
      const desc = (meta.data.description || "").trim();
      if (desc.length < MIN_DESC || desc.length > MAX_DESC) {
        metaErrors.push(
          `Repository description length ${desc.length}; want ${MIN_DESC}–${MAX_DESC}.`,
        );
      } else {
        console.log(`Description OK (${desc.length} chars).`);
      }
    }
    const topicsRes = ghApi(`repos/${repo}/topics`);
    if (!topicsRes.ok) {
      metaErrors.push(`gh api topics failed: ${topicsRes.error}`);
    } else {
      const names = topicsRes.data.names || [];
      if (names.length < MIN_TOPICS || names.length > MAX_TOPICS) {
        metaErrors.push(
          `Topics count ${names.length}; want ${MIN_TOPICS}–${MAX_TOPICS}. Got: ${names.join(", ") || "(none)"}`,
        );
      } else {
        console.log(`Topics OK (${names.length}): ${names.join(", ")}`);
      }
    }
    if (metaErrors.length) {
      if (requireMeta) {
        errors.push(...metaErrors);
      } else {
        for (const e of metaErrors) {
          console.log(
            `::warning::${e} (DISCOVERABILITY_REQUIRE_METADATA=false)`,
          );
        }
      }
    }
  } else {
    console.log(
      "Skipping description/topics API checks (set GITHUB_ACTIONS=true with GITHUB_REPOSITORY, or run in Actions).",
    );
  }

  if (errors.length) {
    console.log("::error::Discoverability check failed.");
    for (const e of errors) console.log(e);
    process.exit(1);
  }
  console.log("discoverability-check OK");
}

main();
