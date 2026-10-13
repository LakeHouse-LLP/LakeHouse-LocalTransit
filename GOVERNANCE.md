# Governance

**LakeHouse Studio** public repos are stewarded by **Sen** (sole owner). There is no second owner and no auto-archive.

## Decisions

| Topic | Who |
| --- | --- |
| Merge to `main`, `Template-*`, `.github` | Sen |
| Org/repo settings, rulesets, secrets, Discussions categories | Sen only ([docs/sen-only-github-settings.md](docs/sen-only-github-settings.md)) |
| Roadmap direction | Sen; community Ideas welcome in Discussions |
| Security advisories | Sen ([SECURITY.md](SECURITY.md)) |

Agents and contributors open **draft** PRs; they do not merge protected/template/defaults repos.

## Response-time goals

These are **goals**, not SLAs — life and day-job come first.

| Incoming | Goal |
| --- | --- |
| Security report (private vulnerability reporting) | Acknowledge within **3 business days** |
| `good first issue` / `help wanted` questions | First reply within **1 week** |
| Outside PRs | First review within **1–2 weeks** |
| General Discussions (Q&A / Ideas) | Best effort within **2 weeks** |

If Sen is heads-down, a short “got it — will review soon” comment counts as the first reply.

## Stale policy

**No automated stale bot.**

**Why:** This org is ZERO COST with a single maintainer. Bots that auto-close issues/PRs often punish patient newcomers and create noise without reclaiming meaningful capacity. Instead:

- Maintainers (Sen) may manually close inactive items with a kind note and a link to reopen.
- Prefer labels (`needs-triage`, `good first issue`) over timers.
- Draft PRs from community members are left open unless the author walks away or the approach is abandoned.

## Discussions categories (recommended)

Sen enables Discussions and creates at least:

1. **Ideas** — feature brainstorming
2. **Q&A** — support questions (mark answers)
3. **Show and tell** — demos, screenshots, workflows

Creating categories is a **Sen-only** UI step.

## Related

- [SUPPORT.md](SUPPORT.md) — where to ask for help
- [docs/maintainer-playbook.md](docs/maintainer-playbook.md) — reviewing outside PRs safely
- [CONTRIBUTING.md](CONTRIBUTING.md) — contributor setup
