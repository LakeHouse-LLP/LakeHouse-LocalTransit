# Template-OpenSource

<!-- AUTO:header -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/readme-header.svg" type="image/svg+xml" />
  <img src="brand/readme-header.png" alt="LakeHouse Studio" width="1280" height="320" />
</picture>
<!-- /AUTO:header -->

**LakeHouse Studio** Template-OpenSource is the general-purpose open-source starter for designers and small offices building AEC and design tools (Revit, Rhino, Grasshopper, BIM): CI, release, SEO, and contributor defaults with **no** LakeHouse widget concepts. Create a plain-named public repo from this template (no `Template-` prefix); identity lives in [`.lakehouse/org.json`](./.lakehouse/org.json).

<!-- AUTO:badges -->
[![CI](https://img.shields.io/badge/CI-domain%20pending-lightgrey)](./docs/org.md)
[![Release](https://img.shields.io/badge/release-domain%20pending-lightgrey)](./docs/org.md)
[![License](https://img.shields.io/badge/license-license%20pending-lightgrey)](./LICENSE)
[![OpenSSF Scorecard](https://img.shields.io/badge/Scorecard-domain%20pending-lightgrey)](./docs/org.md)
<!-- /AUTO:badges -->

<!-- AUTO:toc -->
- [About](#about)
- [Quick start](#quick-start)
- [Releasing](#releasing)
- [Agent rules](#agent-rules)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
<!-- /AUTO:toc -->

## About

<!-- AUTO:repo-meta -->
| | |
| --- | --- |
| Brand | `LakeHouse` |
| Package scope | `@lakehouse` |
| Public domain | `REPLACE_WITH_CUSTOM_DOMAIN` (set a real custom domain in org.json; never assume a hostname; never `*.github.io`) |
| GitHub owner | runtime: `github.repository_owner` or `.lakehouse/org.json` `orgName` |
| Repository | `Template-LakeHouse-OpenSource` |
| Tier | `public` |
| License | `pending` (suggested: Apache-2.0) |
| Code owner | [@zsenarchitect](https://github.com/zsenarchitect) |
| Runners | GitHub-hosted only |
| Merge style | Merge commits only |
| Releases | changesets → CI `vX.Y.Z` tag → draft GH release + npm OIDC |
| Action pins | [`.lakehouse/pins.json`](./.lakehouse/pins.json) |
| Org runbook | `{owner}/.github` (see [docs/org.md](./docs/org.md)) |
<!-- /AUTO:repo-meta -->

Minimal public-template defaults for **non-LakeHouse** open-source products: OpenSSF-aligned CI, README autogen, changelog policy, gitleaks, changesets-driven releases, and guards that keep the org on **GitHub Free** with **GitHub-hosted runners only**. No `widget.json`, widget SDK, or host compatibility; use the sibling **Template-Widget** template for those. Org rename readiness and releasing: brand-stable `packageScope` + custom `domain` (never `*.github.io`); see [docs/org.md](./docs/org.md) and [docs/releasing.md](./docs/releasing.md).

## Quick start

```bash
npm install
npm run hooks:install
npm run readme:gen
npm run citation:gen
npm run check:all
```

## Releasing

Changesets → CI version PR → CI-only `vX.Y.Z` tag → build, checksums, provenance attestations → **draft** GitHub Release → npm OIDC trusted publishing.

- [docs/releasing.md](./docs/releasing.md)
- [docs/pre-release-checklist.md](./docs/pre-release-checklist.md)
- [docs/rollback.md](./docs/rollback.md)
- Media: [docs/media/](./docs/media/)

## Agent rules

See [AGENTS.md](./AGENTS.md) (imported by [CLAUDE.md](./CLAUDE.md)).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for DCO sign-off and the stacked-PR merge-commit workflow.

## Security

See [SECURITY.md](./SECURITY.md).


## Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/en/reference/emoji-key/)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org) specification. Contributions of any kind welcome!

## License

<!-- AUTO:license-notice -->
License is **pending** owner selection. Suggested default: [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). See [docs/license.md](./docs/license.md).
<!-- /AUTO:license-notice -->
