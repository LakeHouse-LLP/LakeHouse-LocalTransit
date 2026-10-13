# Contributor listings guide

Zero-cost directories that route newcomers to **`good first issue`** / **`help wanted`** work. Do this only after labels exist and **3–5** starter issues are open ([starter-issues.md](starter-issues.md)).

Build repo URLs from `github.repository_owner` / `org.json` — do not hardcode the org login in templates.

## up-for-grabs.net

1. Confirm the repo is public and has `good first issue` and/or `help wanted` issues.
2. Follow [up-for-grabs](https://www.up-for-grabs.net/) project registration (usually a YAML entry in their repo).
3. Point tags/labels at exactly the GitHub label names we use.
4. Revisit when labels change.

## goodfirstissue.dev

1. Ensure issues use the literal label **`good first issue`**.
2. Many crawlers pick up GitHub search automatically; if a manual submit exists, use it once per repo.
3. Keep at least a few open `good first issue` items so the project does not look abandoned.

## CodeTriage

1. Sign in at [CodeTriage](https://www.codetriage.com/) (Sen or a trusted maintainer).
2. Add the repository so subscribers get a daily open issue.
3. Prefer repos with a steady trickle of well-labeled issues.

## Hacktoberfest (opt-in only)

Hacktoberfest is **opt-in** per repo and per year:

1. Sen decides whether to participate that October.
2. If yes, add the `hacktoberfest` **topic** (and follow that year’s rules for labels/PR merge windows).
3. If no, do **not** leave a stale `hacktoberfest` topic up year-round.
4. Spam PRs: close kindly; do not merge low-quality drive-by changes just for the event.

## After listing

- Watch Discussions / issues for first-time questions (welcome workflow helps).
- Keep [ROADMAP.md](../ROADMAP.md) honest so visitors know where help matters.
