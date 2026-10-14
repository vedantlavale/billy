<p align="center">
  <a href="https://trybilly.tech">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png">
      <img src="docs/logo-light.png" alt="billy" height="48">
    </picture>
  </a>
</p>

<h1 align="center">Invoicing that feels like typing a document</h1>

<p align="center">
  A free, open-source invoice editor. Click any line and write, then download a print-ready PDF.<br>
  No account, no server, and your invoice never leaves your browser.
</p>

<p align="center">
  <a href="https://trybilly.tech"><b>Try it at trybilly.tech</b></a> ·
  <a href="#features">Features</a> ·
  <a href="#run-it-locally">Run it locally</a> ·
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-0070d7"></a>
</p>

<p align="center">
  <img src="docs/screenshots/landing.png" alt="The billy landing page: Invoicing that feels like typing a document" width="860">
</p>

## Why billy

- **You edit the invoice itself.** There are no forms or dialogs. Click the company name, a line item or the due date and type.
- **The PDF matches the screen.** The editor, the preview and the export all render the same page, so what you see is what you download.
- **Nothing to sign up for, nothing uploaded.** There are no accounts, no backend and no database. Your draft is saved in your browser's local storage.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/editor.png" alt="The editor: an invoice you edit by clicking on it"></td>
    <td width="50%"><img src="docs/screenshots/templates.png" alt="The template rail with the Studio template selected"></td>
  </tr>
  <tr>
    <td align="center"><sub>Click any text to edit it</sub></td>
    <td align="center"><sub>Pick a template, set currency and terms</sub></td>
  </tr>
</table>

## Features

**Editing**
- Click-to-edit fields right on the document, with autosave to your browser
- Undo and redo, a <kbd>⌘K</kbd> command palette and keyboard shortcuts
- Multi-page invoices
- An editor that works on a phone

**Look**
- Ten templates: Clean, Modern Green, Minimal Teal, Corporate Blue, Mono Classic, Mono Elegant, Studio, Ledger, Receipt and Letterhead
- An extra Early Bird template for the people who joined the waitlist
- Logo and digital stamp upload

**Money**
- Ten currencies: INR, USD, EUR, GBP, JPY, AUD, CAD, SGD, AED and SAR
- Tax and discount, payment terms (on receipt, Net 7, 15 or 30), bank details, PO numbers, notes and terms

**Made for India as well**
- GSTIN, HSN and SAC codes, CGST, SGST and IGST lines, and reverse charge
- Quick presets for freelancers, GST vendors, agencies and consultants that switch on the fields each one needs

**Export**
- A print-ready PDF generated in the browser

<p align="center">
  <img src="docs/screenshots/mobile.png" alt="The editor on a phone" width="220">
  &nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/early-birds.png" alt="The early birds wall, with a generated mascot face for every person" width="600">
</p>
<p align="center"><sub>On a phone, and the early birds wall (placeholder names)</sub></p>

## Privacy

Your invoice, client details and logo stay on your device. billy makes two kinds of third-party request:

- **PostHog analytics.** Event names and anonymous properties only, never the contents of an invoice. See [`apps/web/instrumentation-client.ts`](apps/web/instrumentation-client.ts).
- **GitHub.** The landing page asks the GitHub API for the star count.

Nothing else leaves your browser, and there is no server that could store it.

## How it works

```
browser: /  (landing)   and   /editor  →  InvoicePage  →  localStorage
                                              │
                          canvas, preview and PDF all render this one page
```

- `apps/web/components/invoice/invoice-page.tsx` is the single layout used for the canvas, the preview and the PDF, so the three cannot drift apart.
- The PDF is made in the browser from that same page (`html-to-image` and `jsPDF`).
- `packages/invoice-core` holds the pure TypeScript domain: types, totals, templates, themes, currencies and presets. It has no React in it and it is the only part with unit tests.
- The site is a Next.js static export. There are no route handlers, server actions or middleware.

## Run it locally

You need [Bun](https://bun.sh) (the version is pinned in `packageManager` in `package.json`).

```bash
bun install        # install every workspace
bun run dev        # start the app on http://localhost:3000
bun run build      # static production build into apps/web/out
bun run lint       # lint
```

Checks for the domain package:

```bash
cd packages/invoice-core
bun test           # unit tests
bunx tsc --noEmit  # typecheck
```

## Project layout

A [Turborepo](https://turborepo.com) on Bun workspaces:

```
billy/
├─ apps/
│  └─ web/                 # the Next.js app: landing page, editor and early birds wall
│     ├─ app/              #   routes: /, /editor, /early-birds
│     ├─ components/       #   invoice/ (editor), landing/, founders/, ui/, icons/
│     └─ lib/              #   PDF export, storage, early bird helpers
├─ packages/
│  ├─ invoice-core/        # @billy/invoice-core: types, totals, templates, currencies, presets
│  ├─ design/              # @billy/design: design tokens
│  └─ typescript-config/   # shared tsconfig base
├─ scripts/founders/       # launch-day CLIs for early bird numbers and unlock links
├─ docs/                   # notes and the screenshots used above
├─ DESIGN.md               # the design spec of record
└─ vercel.json              # Vercel build settings and security headers
```

## Deployment

The app is a static export (`output: 'export'` in `apps/web/next.config.ts`), deployed on [Vercel](https://vercel.com) from `main`. DNS is on Cloudflare.

- **Install command:** `bun install`
- **Build command:** `bun run build`
- **Output directory:** `apps/web/out`
- **Environment:** `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` for analytics. It is read at build time, and analytics stay off without it.

These are set in `vercel.json`, which also adds the security headers.

## Contributing

Contributions are welcome. billy is small, so the process is light. The short version is below, and [`CONTRIBUTING.md`](CONTRIBUTING.md) has the rest.

- Open an issue first for anything bigger than a small fix, so we can agree on the approach before you write code. Typos and obvious bugs can go straight to a pull request.
- Branch from `main` and keep each pull request to one change.
- Before you push, check that `bun run build` passes and that `bun run lint` reports nothing new.
- For anything visible, include before and after screenshots at desktop and phone widths.
- Match the code around your change. The UI follows [`DESIGN.md`](DESIGN.md), and user-facing copy uses plain punctuation, so no em-dashes.
- Using an AI coding agent? Read [`AGENTS.md`](AGENTS.md) first.

By contributing, you agree that your work is licensed under the MIT license.

If billy saves you time, a star on GitHub helps other people find it.

## License

[MIT](LICENSE). Bundled third-party files keep their own licenses, listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
