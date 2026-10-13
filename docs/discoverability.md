# Discoverability standard (Template-OpenSource)

Zero-cost GitHub-side SEO for **LakeHouse Studio** (brand token in [`.lakehouse/org.json`](../.lakehouse/org.json): `LakeHouse`). Dark mode only; base `#1E1E1E`, accent `#7DFFFF`, font Geist ([`brand/palette.json`](../brand/palette.json)). Domain from `org.json`; never `*.github.io`.

**TODO:** Prefer the org runbook copy in `{owner}/.github` → `docs/discoverability.md` when that draft lands on `main`. Local copy kept until then.

## Repository description

- One or two sentences; lead with **LakeHouse Studio** or the product name.
- Include what it is + who it is for (designers / small offices / AEC tooling as relevant).
- No client names, no “WIP” as the permanent blurb.

Suggested description for this template (Sen sets in UI):

> LakeHouse Studio general-purpose open-source project starter (tier: public) — CI, release, SEO, and contributor defaults without LakeHouse widget concepts.

## Topics (8–20)

Use **8 to 20** relevant lowercase topics. Prefer brand + domain keywords over the GitHub org login (rename-safe).

Suggested pool (pick what fits; do not stuff all of them):

`lakehouse-studio`, `lakehouse`, `template`, `opensource`, `revit`, `rhino`, `grasshopper`, `bim`, `aec`, `architecture`, `indesign`, `design-tools`, `typescript`, `nodejs`, `github-actions`

Sen sets topics in the GitHub UI (agents never change settings). Until 8–20 topics exist, the discoverability workflow keeps metadata checks as warnings (`DISCOVERABILITY_REQUIRE_METADATA=false`).

## README first paragraph

The **first paragraph** after the title/logo must be keyword-rich and human:

- Name the product (**LakeHouse Studio** or repo product name).
- State the category (e.g. digital office / design tools / Revit–Rhino utilities).
- Name the audience (designers and small offices).
- Avoid marketing fluff with no nouns searchers use.

## Social preview

- Upload **1280×640** [`brand/social-preview.png`](../brand/social-preview.png) (mirrored at `docs/media/social-preview.png`).
- Dark canvas only; accent `#7DFFFF`; no client or confidential firm content.

## Homepage URL

- Set the repo **Website** field to a path on `domain` from `org.json`.
- Until the placeholder is replaced, Sen may leave it empty — never use `*.github.io`.

## Releases help ranking

Ship **regular tagged releases** ([releasing.md](releasing.md)). Fresh releases improve GitHub search and social trust.

## CITATION.cff

Root [`CITATION.cff`](../CITATION.cff) is generated from `org.json` (`npm run citation:gen`). Keep titles aligned with **LakeHouse Studio** / product branding.

## Pinned repositories / org profile

Org-level pin order and profile README live in `{owner}/.github` (Sen-only). See that runbook’s `docs/discoverability.md` and `profile/README.md` when published.

## CI check

- Workflow: [`.github/workflows/discoverability.yml`](../.github/workflows/discoverability.yml)
- Script: `npm run check:discoverability` → `node scripts/discoverability-check.mjs`

Validates README first paragraph length, and (on GitHub Actions) repository **description** + **topics** via `gh api` / `GITHUB_TOKEN` on GitHub-hosted runners.
