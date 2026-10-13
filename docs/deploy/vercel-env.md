# Vercel environment variables (Template-OpenSource)

**Canonical rule:** organization `.github` repository → `docs/deploy/vercel-env.md`  
Resolve owner from `github.repository_owner` / `.lakehouse/org.json`, then open `{owner}/.github` (see [docs/org.md](../org.md)) — do not hardcode the org login.  
**TODO:** Prefer that org file once its draft lands on `main`. This stub is the Template-OpenSource pointer only.

## Rule (summary)

- Values used by **more than one** Vercel project → **team Shared Environment Variables**, linked into each project.
- **Project-level** vars only when the value is truly project-specific.
- Prefer **Vercel OIDC federation** over long-lived tokens or cloud keys.
- Agents must **not** create, edit, or delete Vercel env vars (`vercel env add` / `rm` / dashboard edits) without Sen’s explicit approval — see [AGENTS.md](../../AGENTS.md) Never do.

## Naming

- `UPPER_SNAKE_CASE`, prefixed by domain or service (e.g. `DOCS_`, `API_`).
- `NEXT_PUBLIC_` / public prefixes **only** for values that are safe to expose to clients.

## Environments

| Target | Secrets |
| --- | --- |
| Production | Production secrets only |
| Preview | Non-production / scoped preview secrets — **never** production secrets |
| Development | Local/dev secrets — **never** production secrets |

## Local development

```bash
vercel env pull
```

The CLI writes a gitignored local env file (a `.env*` name). See [`.gitignore`](../../.gitignore); gitleaks denies committed env files. Never commit values.

## Secrets inventory (names only)

Keep a private inventory (Sen’s vault / owner’s vault — Google Drive). **Names only in git** — never values.

| Name | Scope (shared \| project) | Linked projects | Environments | Owner | Source of truth | Rotation cadence | Last rotated |
| --- | --- | --- | --- | --- | --- | --- | --- |
| _example_ | shared | _(list)_ | Production | Sen | owner’s vault | 90d | _YYYY-MM-DD_ |

## Rotation checklist

1. Create the new value in the owner’s vault.
2. Update Shared (or project) env on Vercel for the right environments only.
3. Redeploy / verify Preview, then Production.
4. Revoke the old value; record **Last rotated** in the inventory.
5. Confirm no long-lived tokens remain where OIDC can replace them.
