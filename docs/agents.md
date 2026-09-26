# Billy for AI assistants

Tell an assistant who you're billing and for what, and it hands back a link
that opens the finished invoice in Billy. Review it, then download the PDF.

Billy stores nothing. The whole invoice is packed into the part of the link
after `#`, which browsers never send to a server. Logos and stamps aren't in
the link: add them once in the editor and that browser keeps them.

## Connect an assistant

The setup page for people is `/connect` (`apps/web/app/connect/page.tsx`); keep
it and this table in step. The endpoint is `https://trybilly.tech/mcp`. No
account or key is needed.

| Client | How |
| --- | --- |
| Claude (web, desktop) | Add a custom connector in Settings and paste the URL |
| ChatGPT | Turn on developer mode, add a connector with the URL and no authentication |
| Claude Code | `claude mcp add --transport http billy https://trybilly.tech/mcp` |
| Cursor, Codex, others | Add a remote (streamable HTTP) MCP server with the URL |
| Offline or local | `claude mcp add billy -- npx -y trybilly mcp` runs the same tools over stdio |

Then ask something like: "Invoice Acme Corp for 12 hours of design at $80,
due in 14 days. I'm Vedant Studio, hi@vedant.studio."

## From the terminal

```bash
npx trybilly init                       # save your details once
npx trybilly new --to "Acme Corp" --item "Design:12:80" --currency USD --due 14 --open
echo '{"to":{"name":"Acme"},"items":[{"description":"Audit","rate":5000}],"currency":"INR"}' \
  | npx trybilly new --from-json - --json
```

`billy new` asks for anything missing when run in a terminal. `--json`
prints `{ link, invoiceNumber, currency, total, warnings }` for scripts.

## Tools

- `create_invoice`: client, line items and currency are required. Everything
  else is optional: sender details, tax (or the Indian GST split), discount,
  dates, invoice number, notes, bank details, template, profession preset.
  It returns a summary to check, the link, and warnings such as a missing
  sender email.
- `list_invoice_options`: templates, currencies and presets.

## Develop

```bash
bun test --cwd packages/invoice-core    # schema, link codec
bun test --cwd packages/mcp             # tools over HTTP
bun test --cwd packages/cli             # flag parsing
bun run build && (cd apps/mcp && bun run dev)   # site + /mcp on wrangler
npx @modelcontextprotocol/inspector     # point it at http://localhost:8787/mcp
```

Set `BILLY_URL` to make the CLI hand out links to another deployment.
