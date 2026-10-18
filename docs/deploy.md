# Deploying billy

Production runs on a Cloudflare Worker. [`wrangler.jsonc`](../wrangler.jsonc)
routes `trybilly.tech` and `www.trybilly.tech` to the Worker named `billy`,
which serves the static export from `apps/web/out`. [Vercel](https://vercel.com)
stays around for pull-request previews.

## The pipeline

Cloudflare Workers Builds is connected to this repository: every push to `main`
runs the build and deploys the Worker. Pull-request preview builds exist too,
but they fail repo-wide right now, so PR previews come from Vercel.

From the repo root, by hand:

```bash
bun run build                     # static export to apps/web/out
bunx wrangler deploy --dry-run    # check the Worker config without deploying
bunx wrangler deploy              # deploy to production
bunx wrangler versions upload     # deploy a preview version only
```

The Worker's build environment needs `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
(Workers Builds settings), or analytics stay off in production. It is set.

## Routes and redirects

- The `routes` block in `wrangler.jsonc` attaches when the Worker deploys. Both
  hostnames resolve to the Worker, not to Vercel.
- `trybilly.tech` is expected to redirect to `www.trybilly.tech` (the canonical
  host, `SITE_URL` in `apps/web/lib/seo.ts`). Vercel used to issue that 308. To
  keep it, add a dashboard rule once: zone `trybilly.tech` → Rules → Redirect
  Rules → when incoming requests match `http.host eq "trybilly.tech"`, redirect
  to `https://www.trybilly.tech`, keep the path and query, status 308. Without
  the rule the apex serves the site directly, which also works.

## Rollback

- **Bad Worker version:** `bunx wrangler rollback` goes back to the previous
  deployment.
- **Back to Vercel:** keep the production domains attached in the Vercel project
  (routes win while they are up, so the project sits as a hot standby). To roll
  back, remove the `routes` block from `wrangler.jsonc` and redeploy; Vercel
  answers the hostnames again. If the domains were removed from the project,
  re-add them first.
