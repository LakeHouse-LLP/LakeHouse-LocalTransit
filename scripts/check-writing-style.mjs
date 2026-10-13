#!/usr/bin/env node
/**
 * Cheap copy lint: WRITING-STYLE rules for published prose.
 * - Zero em dashes (U+2014) and en dashes (U+2013); no Chinese 破折号 (——)
 * - Banned hype / filler words (word-boundary match)
 *
 * Scope: README, AGENTS, CONTRIBUTING, brand/*.md (not tokens.json).
 * Canonical guide: {owner}/.github/brand/WRITING-STYLE.md
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { ROOT } from "./lib/repo.mjs";

const DASH_RE = /[\u2013\u2014\u2015]|——/;

/** Phrases and words from brand WRITING-STYLE §7 (high-signal only). */
const BANNED = [
  /\brevolutionary\b/i,
  /\bgame-?changing\b/i,
  /\bgame changer\b/i,
  /\bdisruptive\b/i,
  /\bnext-?gen(?:eration)?\b/i,
  /\bcutting-?edge\b/i,
  /\bseamless(?:ly)?\b/i,
  /\beffortless(?:ly)?\b/i,
  /\bmagical\b/i,
  /\bleverage\b/i,
  /\butilize\b/i,
  /\bsynergy\b/i,
  /\bempower(?:s|ed|ing)?\b/i,
  /\bunlock(?:s|ed|ing)?\b/i,
  /\bbest-in-class\b/i,
  /\bworld-class\b/i,
  /\bai-powered\b/i,
  /\belevate\b/i,
  /\bunleash\b/i,
  /\bdelve\b/i,
  /\btapestry\b/i,
  /\bnext-level\b/i,
  /\bin the world of\b/i,
  /\ball-in-one\b/i,
  /\bunder one roof\b/i,
  /\bone-stop\b/i,
  /\bclick here\b/i,
];

function listFiles() {
  const out = [
    path.join(ROOT, "README.md"),
    path.join(ROOT, "AGENTS.md"),
    path.join(ROOT, "CONTRIBUTING.md"),
  ];
  const brandDir = path.join(ROOT, "brand");
  for (const name of readdirSync(brandDir)) {
    if (!name.endsWith(".md")) continue;
    out.push(path.join(brandDir, name));
  }
  return out.filter((f) => {
    try {
      return statSync(f).isFile();
    } catch {
      return false;
    }
  });
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

/** Strip fenced code so the ban-list source file can document patterns. */
function proseOnly(text) {
  return text.replace(/```[\s\S]*?```/g, (block) => " ".repeat(block.length));
}

function checkFile(file) {
  const rel = path.relative(ROOT, file);
  const raw = readFileSync(file, "utf8");
  const text = proseOnly(raw);
  const errors = [];

  let m;
  const dash = new RegExp(DASH_RE.source, "g");
  while ((m = dash.exec(text)) !== null) {
    const ch = m[0];
    const name =
      ch === "\u2014" || ch === "——"
        ? "em dash / 破折号"
        : ch === "\u2013"
          ? "en dash"
          : "dash";
    errors.push(
      `${rel}:${lineOf(raw, m.index)}: forbidden ${name} (U+${ch.codePointAt(0).toString(16).toUpperCase()}). Use a period, comma, colon, parentheses, or hyphen.`,
    );
  }

  for (const re of BANNED) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
    while ((m = g.exec(text)) !== null) {
      errors.push(
        `${rel}:${lineOf(raw, m.index)}: banned wording "${m[0]}" (see WRITING-STYLE §7).`,
      );
    }
  }

  return errors;
}

function main() {
  const errors = listFiles().flatMap(checkFile);
  if (errors.length) {
    console.error("Writing-style copy lint failed:\n");
    for (const e of errors) console.error(`  ${e}`);
    console.error(
      "\nUse plain punctuation (no em/en dashes). Avoid hype words. See AGENTS.md / CONTRIBUTING.md.",
    );
    process.exit(1);
  }
  console.log("Writing-style copy lint OK.");
}

main();
