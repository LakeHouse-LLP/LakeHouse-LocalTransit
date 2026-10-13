# Org identity and rename readiness

Canonical fields live in [`.lakehouse/org.json`](../.lakehouse/org.json):

| Field | Role |
| --- | --- |
| `orgName` | Mutable GitHub organization login |
| `brand` | Stable public brand (`LakeHouse` / LakeHouse Studio styling) |
| `packageScope` | Brand-based npm scope (not the org slug), e.g. `@lakehouse` |
| `domain` | Custom FQDN for public links/badges, or `REPLACE_WITH_CUSTOM_DOMAIN` until Sen chooses one (**never** `*.github.io`; do not assume a hostname) |

## Runtime resolution

Guards and generators prefer `github.repository_owner` (Actions) / `GITHUB_REPOSITORY_OWNER`, then fall back to `orgName` in `org.json`.

## Org runbook

Shared org defaults and the runbook live in the organization **`.github`** repository:

- Resolve owner as above, then open `https://github.com/{owner}/.github`
- Reusable workflow catalog and Action SHA pins: [`.lakehouse/pins.json`](../.lakehouse/pins.json)

Do not hardcode the GitHub org slug in workflows, docs, or badges. `npm run check:org-slug` enforces this (allowlist: `org.json`, changelogs).

## On rename

1. Update `orgName` in `.lakehouse/org.json` (brand / packageScope stay put; set `domain` when purchased).
2. Re-run `npm run readme:gen` and `npm run citation:gen`.
3. Confirm CI still resolves owner via `github.repository_owner`.

## Brand assets

Org-wide `brand/` (logo masters, palette, social placeholders) lives in the organization `.github` repository. Per-repo media convention: [media/](./media/).
