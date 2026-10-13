# Releasing (public flagship)

Single-package SemVer tags: **`vX.Y.Z`** (pre-release: `vX.Y.Z-rc.N` / `vX.Y.Z-beta.N`).

Org runbook companion: `{owner}/.github` → `docs/releasing.md` (see [org.md](./org.md)).

## Pipeline

1. **Changeset** on every meaningful PR (`npx changeset`) — drives `CHANGELOG.md` sections: Added, Changed, Deprecated, Removed, Fixed, Security. Link PRs in the summary. Call out breaking changes with migration notes.
2. **Version PR** — CI (`changeset-version` workflow) opens a “Version Packages” PR via changesets. Merge with a **merge commit**.
3. **Tag** — CI only (`scripts/release-tag.mjs`) creates an **annotated** `vX.Y.Z` tag after the version PR lands. Never tag by hand.
4. **Build** — `scripts/release-build.mjs` runs `npm pack` into `release-assets/` and writes `SHA256SUMS`.
5. **Attest** — `actions/attest-build-provenance` on release artifacts.
6. **Draft GitHub Release** — notes from `.github/release-notes-template.md` + `.github/release.yml` categories; assets + checksums attached; **draft=true**.
7. **npm publish** — OIDC trusted publishing (`id-token: write`, no long-lived npm token). Sen configures the trusted publisher on npmjs.com.

Sen (or an approved maintainer) publishes the draft release when ready.

## Badge / link URLs

Use `.lakehouse/org.json` (`domain`, `brand`, `packageScope`) and `github.repository_owner` — never hardcode the org slug; never use `*.github.io`.

## Sen-only GitHub / npm settings

Agents must not change these. Owner checklist:

- [ ] Tag protection: disallow delete/update of `v*` tags
- [ ] **Immutable releases** enabled
- [ ] Rulesets: merge commits only; required checks
- [ ] npm trusted publisher → this repo’s `release` workflow (OIDC)
- [ ] GitHub Environment `release` (optional reviewers) for the publish job
- [ ] Choose/buy custom domain; replace `REPLACE_WITH_CUSTOM_DOMAIN` in `org.json`; set repo homepage to that domain
- [ ] Topics / description per [repo-metadata.md](./repo-metadata.md)
- [ ] Social preview image (1280×640) from `docs/media/` or org `brand/`

## Pre-release

Follow [pre-release-checklist.md](./pre-release-checklist.md).

## Rollback / yank

See [rollback.md](./rollback.md).
