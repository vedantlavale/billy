# Billy

**A free, open-source, fully client-side invoice editor.** Edit an invoice like a
document, then export a pixel-perfect PDF — entirely in your browser. No accounts,
no server, no data ever leaves your machine.

- **What-you-see-is-what-you-get PDF** — the PDF is rendered from the exact same
  DOM you edit (via `html-to-image` + `jsPDF`), so the export matches the preview.
- **Zero backend** — no auth, no database, no API. Your draft lives in
  `localStorage`; logos/stamps are embedded inline as data URLs.
- **Static** — ships as plain files (`next build` → `out/`), deployed to
  Cloudflare Pages.

## Monorepo layout

A [Turborepo](https://turborepo.com) managed with [Bun](https://bun.sh) workspaces:

```
billy/
├─ apps/
│  └─ web/                 # the Next.js app (static export) — landing + editor
├─ packages/
│  ├─ invoice-core/        # @billy/invoice-core — pure TS domain: types, totals,
│  │                       #   templates, theme, currencies, presets (no React)
│  ├─ design/              # @billy/design — the "Tally" design tokens (CSS +
│  │                       #   Tailwind theme), DESIGN.md, and DTCG tokens.json
│  └─ typescript-config/   # @billy/typescript-config — shared tsconfig base
├─ turbo.json
└─ package.json            # workspaces + Turbo pipeline
```

The design system is documented in [`packages/design/DESIGN.md`](packages/design/DESIGN.md).

## Getting started

Requires [Bun](https://bun.sh) (see `packageManager` in `package.json`).

```bash
bun install      # install all workspaces
bun run dev      # start the app (Turbo → next dev)
bun run build    # static production build → apps/web/out
bun run lint     # lint all workspaces
```

Open http://localhost:3000.

## Deployment (Cloudflare Pages)

The app is a static export (`output: 'export'` in `apps/web/next.config.ts`).

- **Build command:** `bun run build`
- **Output directory:** `apps/web/out`

Security headers are served via `apps/web/public/_headers`. Because there's no
server, PostHog analytics call their host directly (see
`apps/web/instrumentation-client.ts`); add a Cloudflare rule if you want
first-party proxying.

## Tech

Next.js 16 (App Router, static export) · React 19 · Tailwind CSS v4 · TypeScript ·
Turborepo · Bun.

## License

MIT
