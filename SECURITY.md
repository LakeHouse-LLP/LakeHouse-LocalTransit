# Security policy

## Reporting

Please report suspected vulnerabilities privately to the owner:

- GitHub: [@zsenarchitect](https://github.com/zsenarchitect)

Do not open a public issue for exploitable vulnerabilities until a fix or advisory is ready.

## Scope

This template and projects derived from it aim for OpenSSF good practices: dependency updates, CodeQL, Scorecard, gitleaks, and least-privilege workflows.

## Owner one-time GitHub settings (not changed by agents)

Agents must not change repository settings. The owner should enable (when ready):

- **Dependency graph** (+ Dependabot alerts) so `actions/dependency-review-action` can be added to CI
- **Code scanning** / Scorecard SARIF upload (workflows already present)
- Branch protection requiring merge commits only

Org identity / rename notes: [docs/org.md](./docs/org.md). Action pins and reusable workflow catalog: [`.lakehouse/pins.json`](./.lakehouse/pins.json).

Releases use npm OIDC trusted publishing and build provenance attestations — see [docs/releasing.md](./docs/releasing.md) and [docs/rollback.md](./docs/rollback.md).

## Supported versions

Only the default branch (`main`) and the latest release tag receive security fixes unless noted otherwise in the release notes.
