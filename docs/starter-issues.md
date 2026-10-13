# Seeding starter issues

Each public repo created from Template-OpenSource should keep **3–5** open issues labeled for newcomers.

## Labels

Defined in [`.github/labels.yml`](../.github/labels.yml):

| Label | Use |
| --- | --- |
| `good first issue` | Small, well-scoped, docs or tidy code; safe for first-time contributors |
| `help wanted` | Clear problem; may need a bit more context or design judgment |

Also use `documentation`, `bug`, `enhancement`, `needs-triage` as appropriate.

## How to seed (per repo)

1. Ensure labels from `.github/labels.yml` exist in the GitHub UI (or sync via org label-sync when published).
2. Open **3–5** issues before advertising the repo (listings, launch posts).
3. Each starter issue should include:
   - **Why it matters** (one sentence)
   - **Acceptance criteria** (checklist)
   - **Pointers** (files/folders to touch)
   - **Out of scope** (what not to do)
   - Estimate: “good first” ≈ under an evening
4. Prefer docs typos, README examples, test fixtures, small copy, and tightly scoped bugs over architecture rewrites.
5. Assign no one; let contributors self-select. Answer questions within the [GOVERNANCE.md](../GOVERNANCE.md) response goals.

## Example titles

- Docs: add a screenshot alt-text pass for `docs/media/`
- Good first issue: correct the sample config path in README
- Help wanted: add a unit test for X edge case
- Docs: translate the 5-minute setup notes for Windows Terminal

## Maintenance

When a starter issue closes, open a replacement so the count stays in the 3–5 range before the next listing refresh ([docs/contributor-listings.md](contributor-listings.md)).
