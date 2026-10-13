# Maintainer playbook — reviewing outside PRs safely

For Sen (and any future maintainers) reviewing community PRs on **public** LakeHouse Studio repos. ZERO COST; never weaken runner or secrets rules to go faster.

## Hard rules

1. **Never run fork code on self-hosted runners.** Public repos use **GitHub-hosted** runners only. Self-hosted is for private repos — and even then, do not process untrusted PR code from the internet on those machines.
2. **Require approval for first-time contributors’ workflows** — Sen enables “require approval for all outside collaborators” / first-time contributors in Actions settings ([sen-only-github-settings.md](sen-only-github-settings.md)). Do not auto-run new workflows from unknown authors.
3. **Never use `pull_request_target` together with a checkout of PR (fork) code.** That combination can exfiltrate secrets. Prefer `pull_request` for CI. The **welcome** workflow may use `pull_request_target` **only** for comment-only actions (no `actions/checkout` of the PR head).
4. **Limit secrets.** Prefer OIDC (e.g. npm trusted publishing). No long-lived tokens in public workflows. Fork PR CI must not receive org secrets.
5. **Do not ask contributors to paste secrets** into issues or logs.

## Review checklist

- [ ] CI on `pull_request` is green (or failures understood)
- [ ] Diff matches the issue / stated intent; no unrelated drive-bys
- [ ] No client or confidential firm content; no credentials
- [ ] No LakeHouse widget surfaces introduced into Template-OpenSource descendants
- [ ] CHANGELOG/changeset or `skip-changelog`
- [ ] DCO sign-off on public repos
- [ ] Workflows/actions pinned by SHA when changed; listed in `.lakehouse/pins.json`
- [ ] Maintainer has **not** run the PR locally with production credentials

## Merge

- Merge **commits only** (never squash/rebase-merge on GitHub).
- Prefer small or stacked PRs ([CONTRIBUTING.md](../CONTRIBUTING.md)).
- Thank the contributor; all-contributors credit when appropriate (`.all-contributorsrc`).

## Hostile or spam PRs

- Close with a short polite explanation.
- During Hacktoberfest, do not merge junk for event credit ([contributor-listings.md](contributor-listings.md)).
- Report abuse through GitHub if needed.

## Welcome automation

Use [`.github/workflows/welcome.yml`](../.github/workflows/welcome.yml) (`actions/first-interaction`, SHA-pinned) so first issues/PRs get a kind pointer to CONTRIBUTING and `good first issue`. Keep its permissions minimal (`issues: write`, `pull-requests: write` only as required).

**TODO:** prefer org `{owner}/.github` welcome reusable workflow / template when published.
