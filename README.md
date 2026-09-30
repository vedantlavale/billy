# billy

**A free, open-source invoice editor that runs entirely in your browser.** Edit an
invoice like a document and export a pixel-perfect PDF. No accounts, no server,
nothing leaves your machine.

Live at [trybilly.tech](https://trybilly.tech).

## Branches

| Branch | What it is |
| --- | --- |
| `main` | The "Launching soon" waitlist page served at trybilly.tech |
| `launch-alpha` | The product: the invoice editor and the full landing page (Turborepo, `apps/web`) |

## Run it locally

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # static export to out/
bun run lint
```

The site is a fully static Next.js export (`output: "export"`). `wrangler.jsonc`
serves `out/` as a Cloudflare Workers static-assets Worker. Waitlist signups go
to [Loops](https://loops.so); override the form with `NEXT_PUBLIC_LOOPS_FORM_ID`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). Bundled third-party files keep their own licenses, listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
