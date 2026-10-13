# Stacked pull requests

Keep each PR small and reviewable. Stack dependent work as a chain of PRs.

## Workflow

1. Open PR1 targeting `main`.
2. Branch PR2 from PR1's branch; open PR2 targeting PR1's branch (not `main` yet).
3. CI must run on every PR in the stack (`pull_request` with **no** `branches:` filter).
4. Required workflows also listen for `merge_group:` so merges that enter the queue are re-checked.
5. Merge **bottom-up** using a **merge commit** (never squash/rebase-merge).
6. After PR1 lands on `main`, retarget PR2 to `main`, then Sen enqueues it (merge queue).
7. Repeat for the rest of the stack.

## Merge queue interaction

| PR base | In merge queue? |
| --- | --- |
| `main` | Yes — Sen enqueues after review; queue runs required checks on `merge_group` |
| Feature branch (stacked) | No — merge or retarget first |

Agents and contributors **never** enqueue or merge. Sen enables the queue via a branch ruleset (see [sen-only-github-settings.md](sen-only-github-settings.md)).

## Checklist

- [ ] Each PR has a focused diff and a CHANGELOG entry (or `skip-changelog`).
- [ ] Commits include a DCO `Signed-off-by:` trailer.
- [ ] Base branch retargeted after the parent merges.
- [ ] No force-push; no rewriting of already-reviewed history on shared branches.
