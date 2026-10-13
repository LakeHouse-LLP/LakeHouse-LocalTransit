# Repository metadata standard

Apply in the GitHub UI (Sen / owners only — agents never change settings).

| Field | Guidance |
| --- | --- |
| Description | Keyword-rich one–two sentences; lead with LakeHouse Studio / product + audience (see [discoverability.md](discoverability.md)) |
| Homepage | `https://` + real `domain` from `.lakehouse/org.json` once set (not `REPLACE_WITH_CUSTOM_DOMAIN`; never `*.github.io`) |
| Topics | **8–20** from the pool in [discoverability.md](discoverability.md); avoid client names and org-login stuffing |
| Social preview | 1280×640 PNG from `brand/social-preview.png` / `docs/media/social-preview.png` (dark-only, accent `#7DFFFF`) |
| Releases | Immutable releases on; draft-first workflow |
| Features | Discussions on for announcements; Wikis off unless needed |

Template repos keep the `Template-` prefix; projects created from them use **plain** names.
