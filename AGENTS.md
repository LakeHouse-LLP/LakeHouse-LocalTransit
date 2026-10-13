# Agent instructions (public template)

This repository is the **Template-OpenSource** starter for **general-purpose** public projects in the org described by [`.lakehouse/org.json`](./.lakehouse/org.json) (brand + mutable `orgName`). Use it for non-LakeHouse products.

It must **not** include LakeHouse widget concepts (`widget.json`, widget SDK, host compatibility). For LakeHouse-extensible widgets, use **Template-Widget** instead.

Projects created from this template must use **plain repository names** (no `Template-` prefix). The `Template-` prefix is reserved for template repositories only.

Org runbook / shared defaults: the organization [`.github`](./docs/org.md) repository (`{owner}/.github`, owner from `github.repository_owner` or `org.json`). Prefer those reusable workflows/docs when published; keep local copies with a `TODO` until then.

## Cost and hosting

- **ZERO COST** on GitHub Free.
- Public repos use **GitHub-hosted runners only**.
- Never introduce paid GitHub features, third-party CI that requires billing, or self-hosted runners.

## Merge policy

- **Merge commits only** (no squash, no rebase-merge on GitHub).
- Prefer small **stacked PRs**, merged bottom-up. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [docs/stacked-prs.md](./docs/stacked-prs.md).
- This **public** template requires the **GitHub merge queue** on `main` (Free plan allows it for public org repos only). Required workflows include `merge_group:` so queued merges are checked on **GitHub-hosted** runners.
- **Agents never enqueue or merge** PRs. Sen does (see Never do).

## License

- `LICENSE` is a placeholder until the owner (Sen / `@zsenarchitect`) chooses.
- **Suggested default: Apache-2.0.** Swapping is documented in `LICENSE` and `docs/license.md`.

## Never do

Agents and automation must **never**:

1. Change repository **visibility**, **settings**, **rulesets**, or **secrets**.
2. **Force-push** to any branch on any remote.
3. **Delete or rename** repositories, branches, or tags.
4. **Merge** into `Template-*` repositories or into the org `.github` repository, or **enqueue** a PR into the merge queue.
5. **Vendor** shared / org-common code into this tree (link or depend instead). Prefer `{owner}/.github` reusable workflows/docs when published.
6. **Push to an unexpected remote** (see `npm run check:remote` / `scripts/check-wrong-remote.mjs`).
7. **Hardcode the GitHub org slug** in workflows, docs, or badges (use `org.json`, `github.repository_owner`, brand, or custom domain).
8. Add **LakeHouse widget** surfaces here (`widget.json`, `@lakehouse/widget-sdk`, host bridge/compat). Use Template-Widget.
9. **Create, edit, or delete Vercel environment variables** (dashboard or `vercel env add` / `rm`) without Sen’s explicit approval. Prefer team Shared Env Vars + OIDC. See [docs/deploy/vercel-env.md](./docs/deploy/vercel-env.md).

## Writing style (copy)

Follow LakeHouse Studio WRITING-STYLE (canonical: `{owner}/.github/brand/WRITING-STYLE.md` when published). Agents and humans must:

- **Zero em dashes and en dashes** (U+2014, U+2013). No Chinese 破折号. Use a period, comma, colon, parentheses, or a plain hyphen for ranges (`2-4`, `9:00-17:00`).
- **No hype or filler wording** from brand WRITING-STYLE §7. The CI list lives in [`scripts/check-writing-style.mjs`](./scripts/check-writing-style.mjs). Prefer concrete verbs and numbers over marketing adjectives.
- Warm, plain, confident. Say what changed and for whom. Sentence case. US English.
- Brand name: **LakeHouse** / **LakeHouse Studio** (never Lakehouse or Lake House).

Cheap CI: `npm run check:writing-style` (README, AGENTS, CONTRIBUTING, `brand/*.md`).

Brand tokens for docs UI: dark base `#1E1E1E`, accent `#7DFFFF`, font **Geist** ([`brand/palette.json`](./brand/palette.json)).

## Continuous self-improvement

After each task, the agent notes any friction (false starts, brittle checks, missing docs, repeated manual steps) and either:

1. **Fixes it in the same PR** when the change is small and in scope, or
2. **Logs it** in [`docs/lessons.md`](./docs/lessons.md) with lesson, action, and status (`open` / `fixed` / `promoted`).

Lessons that keep coming up get **promoted** to a house rule in this file, a script under `scripts/`, or a CI check. Fill the **What did we learn?** section in the PR template. Do not skip the note when the task felt smooth: write `none` or a one-line confirmation.

## Required local checks

```bash
npm install
npm run hooks:install          # gitleaks pre-commit (cross-platform)
npm run check:remote           # WRONG_REMOTE guard
npm run check:tier             # .lakehouse/tier === public and repo is public
npm run check:runners          # fail if any workflow uses runs-on: self-hosted
npm run check:org-slug         # fail on hardcoded org slug outside allowlist
npm run check:pins             # workflow action SHAs match .lakehouse/pins.json
npm run readme:gen             # refresh <!-- AUTO:* --> blocks
npm run citation:gen           # refresh CITATION.cff from org.json
npm run readme:check           # fail when README is stale
npm run check:discoverability  # README first paragraph (+ topics/description on Actions)
npm run check:writing-style    # no em/en dashes; banned hype words
```

## README autogen

Hand-written README prose stays short. Generated sections live between:

```html
<!-- AUTO:name -->
...generated...
<!-- /AUTO:name -->
```

Public badges and links use the **custom domain** from `org.json` (never `*.github.io`). CI fails when AUTO blocks are stale. A weekly workflow regenerates them, opens a PR if needed, and runs lychee link checks.

## Changelog and releases

Every PR must add a **changeset** (`npx changeset`) and/or update `CHANGELOG.md`, **or** carry the `skip-changelog` label.

Release tags (`vX.Y.Z`) are created **only by CI**. Never tag or publish by hand. See [docs/releasing.md](./docs/releasing.md) and [docs/rollback.md](./docs/rollback.md).

## Secrets and client data

- gitleaks runs in pre-commit and in CI (full git history, free CLI).
- Deny-list covers placeholder client/firm names, CAD binaries (`*.rvt`, `*.3dm`, `*.dwg`), `.env` files, and internal hostnames. See `.gitleaks.toml`.


## Contributors

See [CONTRIBUTING.md](./CONTRIBUTING.md), [GOVERNANCE.md](./GOVERNANCE.md), and [ROADMAP.md](./ROADMAP.md).

## Ownership

- CODEOWNERS: `@zsenarchitect`
- Do not merge this template's PR yourself; the owner reviews draft PRs.
