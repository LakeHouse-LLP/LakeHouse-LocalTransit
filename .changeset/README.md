# Changesets

This project uses [changesets](https://github.com/changesets/changesets) to version packages and update `CHANGELOG.md`.

```bash
npx changeset                 # record a change (Added/Changed/Fixed/…)
npm run changeset:version     # apply versions (CI version PR)
```

Release tags (`vX.Y.Z`) are created **only by CI** after the version PR merges. See [docs/releasing.md](../docs/releasing.md).
