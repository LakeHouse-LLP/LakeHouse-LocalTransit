# Pre-release checklist

Complete before publishing a draft GitHub Release / npm package.

## Legal and provenance

- [ ] `LICENSE` finalized (or explicit pending waiver acknowledged by Sen)
- [ ] License headers on source where required by the chosen license
- [ ] Third-party notices updated in [`NOTICE`](../NOTICE)
- [ ] `CITATION.cff` regenerated (`npm run citation:gen`)

## Security

- [ ] `npm run check:gitleaks` clean (full history in CI)
- [ ] CodeQL / Scorecard workflows green on the release commit
- [ ] No open untriaged security advisories that block the release
- [ ] Dependency review enabled when Dependency graph is on (Sen setting)

## Docs and UX

- [ ] README AUTO blocks fresh (`npm run readme:check`)
- [ ] [docs/media/](./media/) screenshots/demos updated; alt text present; no client content
- [ ] Links checked (lychee / weekly workflow)
- [ ] Accessibility smoke pass on documented UI (if any)
- [ ] Supported Revit / Rhino / OS matrix filled in release notes when applicable

## Version consistency

- [ ] Changesets applied; `package.json` version matches intended `vX.Y.Z`
- [ ] `CHANGELOG.md` has the release section (no silent skips without `skip-changelog`)
- [ ] Tag will be CI-created only (`scripts/release-tag.mjs`)

## Announce

- [ ] Draft release notes reviewed (highlights, breaking/upgrade, checksums, attestations)
- [ ] GitHub Discussions announcement prepared (or explicitly skipped)
- [ ] npm trusted publishing configured for this workflow (Sen)
