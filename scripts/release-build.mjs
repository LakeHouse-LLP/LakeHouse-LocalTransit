#!/usr/bin/env node
/**
 * Build release artifacts: npm pack + SHA256SUMS (cross-platform Node).
 */
import { createHash } from "node:crypto";
import {
  createReadStream,
  readFileSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib/repo.mjs";

const OUT = path.join(ROOT, "release-assets");

async function sha256File(filePath) {
  const hash = createHash("sha256");
  await pipeline(createReadStream(filePath), hash);
  return hash.digest("hex");
}

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  if (pkg.scripts?.build) {
    execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
  }

  execFileSync("npm", ["pack", "--pack-destination", OUT], {
    cwd: ROOT,
    stdio: "inherit",
  });

  const files = readdirSync(OUT).filter((n) => n.endsWith(".tgz"));
  if (files.length === 0) {
    console.error("release-build: no .tgz produced");
    process.exit(1);
  }

  const lines = [];
  for (const name of files.sort()) {
    const digest = await sha256File(path.join(OUT, name));
    lines.push(`${digest}  ${name}`);
  }

  writeFileSync(path.join(OUT, "SHA256SUMS"), `${lines.join("\n")}\n`, "utf8");
  console.log(`release-build: ${files.length} tarball(s) + SHA256SUMS`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
