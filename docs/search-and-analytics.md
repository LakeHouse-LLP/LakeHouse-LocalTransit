# Search Console, Bing, and analytics (Sen-only)

Agents must **not** complete these UI/account steps. Sen owns verification and property access.

Domain: value of `domain` in [`.lakehouse/org.json`](../.lakehouse/org.json) (replace `REPLACE_WITH_CUSTOM_DOMAIN` first). Never verify `*.github.io` as the public property of record.

## Google Search Console

1. Add a **Domain** property (or URL-prefix `https://<domain>/`).
2. Verify via DNS (TXT) at your DNS host — preferred over HTML file upload.
3. Submit `https://<domain>/sitemap.xml` once the Astro Starlight site is live.
4. Monitor Coverage / Experience; fix canonical and 404 issues before launches.

## Bing Webmaster Tools

1. Add the same site.
2. Prefer **Import from Search Console** if available; otherwise DNS/Meta verify.
3. Submit the same sitemap URL.
4. Optional: enable Bing IndexNow only if it stays free and does not require paid tiers.

## Analytics (pick)

**Recommendation: [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)** for the org docs site.

| Option | Why consider | Why not default |
| --- | --- | --- |
| **Cloudflare Web Analytics** | Free, privacy-friendly, **no cookies**, tiny beacon; fits custom-domain DNS on Cloudflare | Needs a Cloudflare account |
| GoatCounter | Free tier, privacy-friendly, very simple | Extra host/account if DNS is already on Cloudflare |

**Justification:** LakeHouse Studio’s public docs will use a custom domain; Cloudflare Web Analytics avoids cookie banners and paid product analytics while staying ZERO COST. If the domain is **not** on Cloudflare, Sen may use **GoatCounter** instead — same privacy bar, still free.

### Sen setup steps (Cloudflare Web Analytics)

1. Create/open Cloudflare account; add the site or use analytics-only.
2. Create a Web Analytics site for `https://<domain>/`.
3. Add the beacon snippet to the Starlight layout (or host-level inject).
4. Confirm page views on a staging URL before launch.
5. Do **not** add Google Analytics / ad pixels.

## Data hygiene

- No client names in page paths or event names.
- No confidential firm content in public docs.
- Keep analytics privacy-friendly; no cross-site advertising IDs.
