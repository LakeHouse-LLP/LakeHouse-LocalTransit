# Brand usage rules (v0.3)

**LakeHouse Studio**: dark mode only. Tokens match `palette.json` / `tokens.json`. Canonical kit: `{owner}/.github/brand`.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `color.accent` | `#7DFFFF` | **Single** accent: links, focus rings, key highlights |
| `color.background` | `#1E1E1E` | Page / canvas (graphite 900) |
| `color.foreground` | `#F2EFE9` | Primary text |
| `font.family.sans` | Geist | UI, docs, headings |

Do not introduce a second accent color. Do not ship a light theme.

## Do

- Place the mark on `#1E1E1E` (or darker) surfaces.
- Keep clear space around the mark roughly equal to the cap-height of the wordmark.
- Point public links at the custom **`domain`** from `.lakehouse/org.json` (never `*.github.io`).
- Credit the brand as **`brand`** from `org.json` (`LakeHouse`; public styling name **LakeHouse Studio**).
- Use **Geist** (and Geist Mono for code) on the docs site theme.

## Do not

- Recolor the logo outside the palette without Sen approval.
- Stretch, rotate, or add multi-layer glow stacks.
- Use client marks, confidential firm marks, or third-party logos in this folder.
- Hardcode the GitHub **org login** into brand CDN paths.
- Add light-mode logo variants (dark-only brand).
- Use em dashes or en dashes in brand copy (see writing-style rules in AGENTS.md).

## Social preview

- Canvas **1280×640**: [`social-preview.png`](social-preview.png).
- Dark canvas + accent mark + product name; no client work.

## Questions

Sen decides exceptions. Track brand tasks in SenZhang-Todo when needed.
