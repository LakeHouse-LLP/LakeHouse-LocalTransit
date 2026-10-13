# Media convention

Place product screenshots, demo GIFs/MP4s, and README imagery here.

## Layout

| Path | Purpose |
| --- | --- |
| `readme-header.svg` / `.png` | Mirror of [`brand/readme-header.*`](../../brand/) (README prefers `brand/`) |
| `logo-dark.svg` / `logo-light.svg` | L1 mark copies for local docs (dark-only brand; light file is mono mark) |
| `social-preview.png` | 1280×640 repo social preview (dark-only, accent `#7DFFFF`; also in [`brand/`](../../brand/)) |
| `screenshots/` | UI stills |
| `demos/` | Short GIF/MP4 walkthroughs |

Org-wide brand masters live in [`brand/`](../../brand/) locally. Canonical kit: `{owner}/.github/brand`. **TODO:** prefer org `brand/` once that draft lands on `main`.

## Rules

- **Alt text** required for every informative image in docs/README.
- **No client data**, no placeholder firm names, no confidential project graphics.
- Prefer SVG/PNG for UI; GIF/MP4 for motion demos.
- **Size limits (git):** aim ≤ 1 MB per file in-repo; ≤ 5 MB hard cap.
- Larger media → **Git LFS** or attach to the **GitHub Release** (not the git tree).
- Never use `*.github.io` for canonical media URLs; use the custom domain from `.lakehouse/org.json` when set (not the `REPLACE_WITH_CUSTOM_DOMAIN` placeholder).
