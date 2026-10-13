import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const ORG_PATH = path.join(ROOT, ".lakehouse", "org.json");
const PINS_PATH = path.join(ROOT, ".lakehouse", "pins.json");

/** Sen has not chosen a domain yet — do not assume a real hostname. */
export const DOMAIN_PLACEHOLDER = "REPLACE_WITH_CUSTOM_DOMAIN";

export function isDomainPlaceholder(domain) {
  return domain === DOMAIN_PLACEHOLDER;
}

export function loadOrg() {
  if (!existsSync(ORG_PATH)) {
    throw new Error("missing .lakehouse/org.json");
  }
  const org = JSON.parse(readFileSync(ORG_PATH, "utf8"));
  for (const key of ["orgName", "brand", "packageScope", "domain"]) {
    if (!org[key] || typeof org[key] !== "string") {
      throw new Error(`.lakehouse/org.json missing string field: ${key}`);
    }
  }
  if (!org.packageScope.startsWith("@")) {
    throw new Error("packageScope must be a brand-based npm scope starting with @");
  }
  if (/\.github\.io$/i.test(org.domain)) {
    throw new Error("domain must be a custom domain, never *.github.io");
  }
  if (!isDomainPlaceholder(org.domain)) {
    if (!/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(org.domain)) {
      throw new Error(
        `domain must be a custom FQDN or ${DOMAIN_PLACEHOLDER} (got ${org.domain})`,
      );
    }
  }
  if (org.packageScope.slice(1).toLowerCase() === org.orgName.toLowerCase()) {
    throw new Error("packageScope must be brand-based, not the GitHub orgName");
  }
  return org;
}

export function loadPins() {
  if (!existsSync(PINS_PATH)) {
    throw new Error("missing .lakehouse/pins.json");
  }
  return JSON.parse(readFileSync(PINS_PATH, "utf8"));
}

/**
 * Prefer GitHub Actions owner, then EXPECTED_OWNER, then org.json orgName.
 */
export function resolveOrgOwner(org = loadOrg()) {
  const fromEnv =
    process.env.GITHUB_REPOSITORY_OWNER?.trim() ||
    process.env.EXPECTED_OWNER?.trim() ||
    process.env.GITHUB_REPOSITORY?.split("/")[0]?.trim();
  return fromEnv || org.orgName;
}

/**
 * Public https base, or null when domain is still REPLACE_WITH_CUSTOM_DOMAIN.
 */
export function publicBaseUrl(org = loadOrg()) {
  if (isDomainPlaceholder(org.domain)) return null;
  return `https://${org.domain}`;
}

export function orgRunbookUrl(org = loadOrg(), owner = resolveOrgOwner(org)) {
  return `https://github.com/${owner}/.github`;
}
