# Contributing to LakeHouse Studio

Thanks for stopping by. We are glad you are here. This guide gets you productive quickly on **Mac or Windows**. Sen reviews and merges; please open a **draft PR** and do not merge into `Template-*` or `.github` yourself.

House rules (agents and humans): [AGENTS.md](AGENTS.md). Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Governance and response times: [GOVERNANCE.md](GOVERNANCE.md).

Identity / domain: [`.lakehouse/org.json`](.lakehouse/org.json).

This template is for **general-purpose** open-source products (**no** LakeHouse widget concepts: `widget.json`, widget SDK, host compat). Use **Template-Widget** for those.

## Writing style

Copy in README, docs, UI strings, and PR titles follows LakeHouse Studio WRITING-STYLE (canonical kit: `{owner}/.github/brand` when published; summary in [AGENTS.md](AGENTS.md)):

- **No em dashes or en dashes.** Use a period, comma, colon, parentheses, or hyphen ranges (`1-2 weeks`).
- **No hype or filler wording** from brand WRITING-STYLE §7 (see [`scripts/check-writing-style.mjs`](scripts/check-writing-style.mjs) and [AGENTS.md](AGENTS.md)).
- Warm, plain, confident. First sentence says what it does and for whom.
- Brand casing: **LakeHouse** / **LakeHouse Studio**.

CI enforces a cheap lint: `npm run check:writing-style`.

## Find something to work on

1. Browse issues labeled **`good first issue`** or **`help wanted`** (see [docs/starter-issues.md](docs/starter-issues.md)).
2. Say hi in **Discussions** (Ideas / Q&A / Show and tell; Sen enables categories).
3. Skim [ROADMAP.md](ROADMAP.md) so your idea fits the direction.

## 5-minute setup (Mac & Windows)

Works the same on macOS and Windows (PowerShell or Terminal). Need **Git**, **Node.js 22+**, and a GitHub account.

```bash
# 1) Fork the repo on GitHub, then clone your fork (replace OWNER/REPO)
git clone https://github.com/OWNER/REPO.git
cd REPO

# 2) Install + hooks
npm ci
npm run hooks:install

# 3) Smoke checks
npm run check:all

# 4) Create a branch and open a draft PR when ready
git checkout -b fix/my-change
```

### Codespaces / Dev Container

Open the repo in **GitHub Codespaces** or VS Code Dev Containers. The checked-in [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json) provides Node 22 and the GitHub CLI. First boot may take a few minutes; then run `npm run check:all`.

### DCO (public repos)

Sign off commits:

```bash
git commit -s -m "Describe your change"
```

## Pull requests (short path)

1. Keep the PR small; prefer [stacked PRs](docs/stacked-prs.md) for larger work.
2. Fill the PR template (summary, stack, tests, checklist).
3. Touch `CHANGELOG.md` / `.changeset/` **or** add the `skip-changelog` label.
4. Wait for CI (GitHub-hosted on public repos). Maintainers will not run untrusted fork code on self-hosted runners. See [docs/maintainer-playbook.md](docs/maintainer-playbook.md).
5. Sen merges via the **merge queue** with a **merge commit** only (never squash/rebase-merge). Contributors and agents do not enqueue or merge.

## Merge queue (public repos)

On GitHub Free, the merge queue is available for **public** org repos only (this template and products created from it). Private templates stay on manual bottom-up merge commits.

- Required checks re-run on `merge_group` (GitHub-hosted runners; never self-hosted on public).
- **Only PRs targeting `main` enter the queue.** Stacked PRs whose base is another feature branch stay outside the queue until retargeted.
- Stack flow: merge bottom-up → retarget the next PR to `main` → Sen enqueues it. Details: [docs/stacked-prs.md](docs/stacked-prs.md).

## Org constraints (summary)

- **ZERO COST**: GitHub Free only.
- **Runners**: Public uses GitHub-hosted only. Never self-hosted on public.
- **Epics**: [SenZhang-Plus/SenZhang-Todo](https://github.com/SenZhang-Plus/SenZhang-Todo), not GitHub Issues.
- **Identity**: Do not hardcode the GitHub org login; use `org.json` or `${{ github.repository_owner }}`.
- Prefer org reusable workflows/docs in `{owner}/.github` when published; local copies carry a `TODO` until then.

## Changelog & releases

- Keep a Changelog + changesets. See [docs/releasing.md](docs/releasing.md).

## Recognition

We use [All Contributors](https://allcontributors.org/). After your PR lands, you may appear in the README contributors table (see [`.all-contributorsrc`](.all-contributorsrc)).

## Questions

Use **Discussions** (not blank issues). Support expectations: [SUPPORT.md](SUPPORT.md).
