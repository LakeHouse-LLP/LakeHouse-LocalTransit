# GitHub UI settings only Sen can change

Agents and contributors must not change these via API, UI, or automation unless Sen explicitly directs it in-band.

**TODO:** Prefer the org runbook `{owner}/.github` → `docs/sen-only-github-settings.md` when that draft lands on `main`.

## Per repository (this template / products from it)

- [ ] Description, **8–20 topics**, homepage (custom `domain` — see [discoverability.md](discoverability.md))
- [ ] Social preview (1280×640 dark [`brand/social-preview.png`](../brand/social-preview.png))
- [ ] Discussions on + categories (**Ideas**, **Q&A**, **Show and tell**)
- [ ] First-time contributor workflow **approval** required
- [ ] Immutable releases on
- [ ] Tag rulesets for release tags (`v*`)
- [ ] Private vulnerability reporting on
- [ ] Merge commits only (squash/rebase off)
- [x] **Allow GitHub Actions to create and approve pull requests** (Settings → Actions → General → Workflow permissions). Required so `changesets/action` can open the Version PR on push to `main`. Without it, version files still land on `changeset-release/main` but PR create fails.
- [ ] **Merge queue** required on `main` (public repos only — Free plan). Ruleset checklist below.
- [ ] npm **OIDC trusted publishing** configured for packages (no long-lived npm tokens)
- [ ] After metadata is set: flip `DISCOVERABILITY_REQUIRE_METADATA` to `"true"` in discoverability/CI workflows
- [ ] Seed **3–5** `good first issue` / `help wanted` issues ([starter-issues.md](starter-issues.md))
- [ ] Optional: Hacktoberfest topic (opt-in per year — [contributor-listings.md](contributor-listings.md))

## Merge queue ruleset (public `main`)

GitHub Free: merge queue is available for **public** org repos only. Private repos keep manual merge commits.

Create or edit a **branch ruleset** targeting `main`:

1. **Restrict updates** / require a pull request before merging as needed for the org baseline.
2. Enable **Require merge queue**.
3. **Merge method:** Merge commit only (do not allow squash or rebase in the queue).
4. **Build concurrency / group size (small org):** max group size **5**, wait / merge group timeout on the order of a **few minutes** — enough to batch quiet periods without stalling a solo maintainer when the next PR is ready.
5. Require status checks that match required workflows (those that declare `merge_group:` — `ci`, `dco`, `codeql`, `scorecard`, `discoverability`, `release` validate, `changeset-version` validate, `readme-weekly` linkcheck as configured).
6. Confirm queue jobs run on **GitHub-hosted** runners (never self-hosted on public).

Only Sen enqueues or merges. Agents must not.

## Also Sen-only

- Repository **visibility** changes
- Org/repo **secrets**, **variables**, and **rulesets**
- Approving merges into `Template-*` and `.github`
- Enqueuing PRs into the merge queue
- Publishing draft GitHub Releases
- Uploading final **brand** assets

See [AGENTS.md](../AGENTS.md) **Never do** list.
