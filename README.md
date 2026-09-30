# Billy

**A free, open-source, fully client-side invoice editor.** Edit an invoice like a
document, then export a pixel-perfect PDF, entirely in your browser. No accounts,
no server, no data ever leaves your machine.

- **What-you-see-is-what-you-get PDF.** The PDF is rendered from the exact same
  DOM you edit (via `html-to-image` + `jsPDF`), so the export matches the preview.
- **Zero backend.** No auth, no database, no API. Your draft lives in
  `localStorage`; logos and stamps are embedded inline as data URLs.
- **Static.** Ships as plain files (`next build` → `apps/web/out`), served by a
  Cloudflare Workers static-assets Worker.

## Monorepo layout

A [Turborepo](https://turborepo.com) managed with [Bun](https://bun.sh) workspaces:

```
billy/
├─ apps/
│  └─ web/                 # the Next.js app (static export): landing + editor
│     ├─ app/              #   routes: /, /editor, /founders
│     ├─ components/       #   invoice/ (editor), landing/, founders/, motion/, ui/, icons/
│     └─ lib/              #   PDF export, storage, founder numbers
├─ packages/
│  ├─ invoice-core/        # @billy/invoice-core — pure TS domain: types, totals,
│  │                       #   templates, theme, currencies, presets (no React)
│  ├─ design/              # @billy/design — the "Tally" design tokens (CSS +
│  │                       #   Tailwind theme), DESIGN.md, and DTCG tokens.json
│  └─ typescript-config/   # @billy/typescript-config — shared tsconfig base
├─ scripts/founders/       # launch-day CLIs (founder numbers, unlock links)
├─ skills/                 # agent skills for the dev workflow (see AGENTS.md)
├─ DESIGN.md               # design spec of record
├─ wrangler.jsonc          # Cloudflare Worker that serves apps/web/out
├─ turbo.json
└─ package.json            # workspaces + Turbo pipeline
```

The design spec of record is the root [`DESIGN.md`](DESIGN.md); it overrides
`packages/design/DESIGN.md` where they disagree.

## Getting started

Requires [Bun](https://bun.sh) (see `packageManager` in `package.json`).

```bash
bun install      # install all workspaces
bun run dev      # start the app (Turbo → next dev)
bun run build    # static production build → apps/web/out
bun run lint     # lint all workspaces
```

Open http://localhost:3000.

## Deployment (Cloudflare Workers)

The app is a static export (`output: 'export'` in `apps/web/next.config.ts`).
`wrangler.jsonc` at the root is an assets-only Worker that serves
`apps/web/out`; Cloudflare's Workers Builds deploys it from `launch-alpha`.

- **Build command:** `bun run build`
- **Output directory:** `apps/web/out`

Security headers are served via `apps/web/public/_headers`. Because there's no
server, PostHog analytics call their host directly (see
`apps/web/instrumentation-client.ts`); add a Cloudflare rule if you want
first-party proxying.

## Tech

Next.js 16 (App Router, static export) · React 19 · Tailwind CSS v4 · TypeScript ·
Turborepo · Bun.

## Contributing

See [CONTRIBUTING.md](https://github.com/vedantlavale/billy/blob/main/CONTRIBUTING.md).

## License

[MIT](LICENSE). Bundled third-party files keep their own licenses, listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
