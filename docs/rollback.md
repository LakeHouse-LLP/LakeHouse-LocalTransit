# Rollback and yank procedure

Public flagship packages and GitHub Releases.

## Prefer a forward fix

1. Publish a patch (`vX.Y.Z+1`) that fixes the issue.
2. Keep the bad release **draft** unpublished if it never went live.
3. If already published, document the breakage in the patch release notes and CHANGELOG **Security** / **Fixed** sections.

## Yank npm (OIDC / registry)

1. Sen (or npm owner) runs `npm unpublish {{PACKAGE}}@X.Y.Z` **only within the registry’s unpublish window**, or deprecate:

   ```bash
   npm deprecate {{PACKAGE}}@X.Y.Z "Broken release; use X.Y.Z+1"
   ```

2. Do **not** reuse the same version number after a yank. Always bump.
3. Record the yank in `CHANGELOG.md` under the next release.

## GitHub Release

1. If still **draft**: delete the draft release in the UI (Sen). Leave the git tag unless the tag itself is wrong.
2. If **published**: mark as **Latest** on the fixed release; edit the bad release body with a banner linking to the fix. Prefer not to delete published releases when **immutable releases** are on.
3. Tags are **immutable** (no move/delete) once protection is enabled — if a tag must be abandoned, publish a superseding version and stop referring to the bad tag.

## Bad CI tag (never created by hand)

If CI tagged incorrectly before publish:

1. Do not force-push or delete the tag unless Sen disables protection temporarily.
2. Cut the next correct SemVer from a new version PR.
3. Open an incident note in Discussions if users could have consumed the tag.

## Checklist after rollback

- [ ] npm deprecate/unpublish completed
- [ ] Release notes banner / Discussions post
- [ ] CHANGELOG updated
- [ ] Attestations for the good release verified
