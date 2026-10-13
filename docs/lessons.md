# Lessons log

Short dated entries from agent and maintainer work. Any lesson that comes up repeatedly gets **promoted** to a house rule (AGENTS.md), a script under `scripts/`, or a CI check.

Status values: `open` | `fixed` | `promoted`.

## Format

```markdown
### YYYY-MM-DD - short title

- **Lesson:** what hurt or surprised us
- **Action:** what to do next (or what we already did)
- **Status:** open | fixed | promoted
```

## Entries

### 2026-10-09 - brand docs and org slug lint

- **Lesson:** Pointing at the org brand kit with a hardcoded owner login fails `check:org-slug`. Use `{owner}/.github/brand` (or `org.json` / `github.repository_owner`) in prose.
- **Action:** Rewrote brand/docs pointers to `{owner}`; kept slug only in allowlisted identity files.
- **Status:** promoted

### 2026-10-09 - writing-style ban list in prose

- **Lesson:** Listing banned hype words in AGENTS/CONTRIBUTING triggers `check:writing-style` on those same files.
- **Action:** Point readers at `scripts/check-writing-style.mjs` instead of repeating the word list in prose.
- **Status:** fixed

### 2026-10-10 - first-interaction input names

- **Lesson:** `actions/first-interaction` v3 takes snake_case (`issue_message`, `pr_message`, `repo_token`). Kebab-case keys are ignored, so the job fails with "Input required and not supplied". `pull_request_target` always runs the workflow from the **base** branch, so a PR cannot green that check until main has the fix (or same-repo `pull_request` synchronize re-checks the PR copy).
- **Action:** Fix `.github/workflows/welcome.yml` inputs; add same-repo `pull_request` synchronize so agents can verify before merge.
- **Status:** fixed

### 2026-10-10 - Dependabot vs changelog and changeset status

- **Lesson:** Strict `check:changelog` and `changeset status --since=origin/main` fail every Dependabot PR (no changeset / no `skip-changelog`). Welcome also should not run for bots. `changesets/action` v2 on main requires `@changesets/cli` v3 (CLI v2 breaks version-pr on push).
- **Action:** Skip changelog + changeset-status when `github.actor == dependabot[bot]`; label Dependabot PRs `skip-changelog`; skip welcome for `*[bot]`; merge CLI 3 via Dependabot after the guard fix lands.
- **Status:** fixed

### 2026-10-10 - repository rename leaves AUTO blocks stale

- **Lesson:** Renaming the GitHub repo (Template-OpenSource → Template-LakeHouse-OpenSource) leaves README AUTO, CITATION.cff, and CHANGELOG compare URLs pointing at the old name until `readme:gen` / `citation:gen` run.
- **Action:** Regenerate AUTO blocks from the current remote after any rename; keep product prose "Template-OpenSource" where it names the template kind, not the GitHub slug.
- **Status:** fixed

### 2026-10-10 - changesets/action needs Actions create-PR setting

- **Lesson:** With `@changesets/cli` v3 and `changesets/action` v2, push to `main` versions packages and updates `changeset-release/main`, then fails with "GitHub Actions is not permitted to create or approve pull requests" unless that Sen-only workflow permission is on.
- **Action:** Document in `docs/sen-only-github-settings.md`. Temporary `continue-on-error` was removed after Sen enabled the setting so real failures show red again.
- **Status:** fixed

### 2026-10-10 - changesets CLI 3 changelog path is relative to .changeset/

- **Lesson:** `@changesets/cli` 3 (ESM) resolves `changelog` in `.changeset/config.json` from the `.changeset/` directory, so `./scripts/changeset-changelog.mjs` looks for `.changeset/scripts/...` and fails. Use `../scripts/changeset-changelog.mjs`.
- **Action:** Updated config on the CLI 3 Dependabot branch before merge.
- **Status:** fixed

### 2026-10-11 - Actions create-PR permission enabled

- **Lesson:** Org/repo **Allow GitHub Actions to create and approve pull requests** must be on for `changesets/action` to open the Version PR. Cloud agent tokens may still lack `workflow_dispatch` / `actions: write` to re-run workflows; a push to `main` is the reliable trigger.
- **Action:** Sen enabled the setting; trigger `changeset-version` via this merge to `main`.
- **Status:** fixed

### 2026-10-11 - Version PR CI: DCO and empty changesets

- **Lesson:** `changesets/action` commits as `github-actions[bot]` without `Signed-off-by`, so DCO fails. The Version PR also fails `changeset status` because it already consumed the changesets. First-time workflow approval can also leave runs in `action_required` for that bot.
- **Action:** Skip DCO for `*[bot]` authors; skip `changeset status` for `changeset-release/*` heads (still run release:validate + pins). Sen can approve waiting workflows once, or a signed empty commit from a human/agent can re-trigger.
- **Status:** fixed
