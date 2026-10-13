# Docs site decision

## Decision

**One org docs site** on the custom domain from [`.lakehouse/org.json`](../.lakehouse/org.json), built with **[Astro Starlight](https://starlight.astro.build/)**.

### Why one site (not per-repo sites as the primary)

| Factor | One org site | Per-repo GitHub Pages |
| --- | --- | --- |
| SEO authority | Single host concentrates links and sitemap | Split across `*.github.io` / many hosts (we forbid github.io for public links) |
| Nav and search | Shared IA for LakeHouse Studio | Fragmented |
| Brand | One dark theme: base `#1E1E1E`, accent `#7DFFFF`, font Geist | Easy to drift |
| Cost | One free deploy | Many deploys to keep updated |

Per-repo `docs/` remains source content for this template; the org site **pulls or mirrors** public guides. Product READMEs stay the GitHub landing page; deep docs live on `domain`.

### Why Astro Starlight

- Matches the monorepo's **Astro** choice (one skill graph for agents and humans).
- Excellent content collections, OG tags, and static output for free hosts.
- Accessible defaults; easy **dark-only** theme with a single accent token.

### Hosting (zero cost)

Prefer **GitHub Pages** (org site) **or Vercel free**, with the **custom domain** from `org.json`. Never publish public docs as `*.github.io` links in READMEs. Always use the custom domain once DNS exists.

## Required on the docs site

- `sitemap.xml` and `robots.txt`
- **Canonical** URLs on the custom domain
- Open Graph + Twitter/X cards (use `brand/social-preview.png` or page-specific 1280×640)
- **JSON-LD**: `Organization` (LakeHouse Studio) + `SoftwareApplication` per product
- Meta descriptions on every page
- Fast, accessible pages; optional **Lighthouse CI** budget only if the action remains free of charge
- **Dark-mode-only** theme from [`brand/palette.json`](../brand/palette.json):
  - Background / canvas: `#1E1E1E`
  - Accent: `#7DFFFF` (`color.accent`)
  - Font family: **Geist** (UI and body), Geist Mono (code), Noto Sans SC (Chinese)

Starlight theme sketch (org site, not this template):

```css
:root {
  --sl-color-accent: #7dffff;
  --sl-color-bg: #1e1e1e;
  --sl-font: "Geist", system-ui, sans-serif;
  --sl-font-mono: "Geist Mono", ui-monospace, monospace;
}
```

## Implementation note

**TODO:** Org Starlight site lives outside this template (Sen chooses repo when DNS is ready). Until `domain` is set, keep content here under `docs/` and do not advertise github.io URLs. Prefer org `.github` → `docs/docs-site.md` when published. Brand masters: `{owner}/.github/brand`.
