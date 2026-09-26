#!/usr/bin/env node
import { spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import { createInterface, type Interface } from "node:readline/promises"
import { parseArgs } from "node:util"

import { CURRENCIES, INVOICE_LINK_BASE, TEMPLATES, buildInvoiceLink, calculateTotals } from "@billy/invoice-core"
import { parseInvoiceInput, summarizeInvoice, type InvoiceInput } from "@billy/invoice-core/agent"
import { createBillyServer, withDefaults } from "@billy/mcp"

import { flagsToInput, parseItem, type NewFlags } from "./args"
import { loadProfile, profilePath, saveProfile, type Profile } from "./profile"

const VERSION = "0.1.0"

const HELP = `billy: make invoices from your terminal or your AI assistant.

Usage
  billy init                  Save your business details once
  billy new [options]         Create an invoice and print its Billy link
  billy mcp                   Serve Billy to a local MCP client over stdio
  billy profile               Show your saved details

billy new options
  --to <name>                 Client name
  --to-email <email>          Client email
  --to-address <text>         Client address (\\n for new lines)
  --item <desc:qty:rate>      Line item, repeatable. "Design:12:80" or "Logo:400"
  --currency <code>           ${CURRENCIES.map((c) => c.code).join(", ")}
  --tax <percent>             Tax rate, e.g. 18
  --tax-label <text>          e.g. VAT, GST, Sales tax
  --gst <cgst_sgst|igst>      Indian GST split
  --discount <percent>        Discount off the subtotal
  --number <text>             Invoice number
  --date <YYYY-MM-DD>         Issue date (default today)
  --due <days|YYYY-MM-DD>     Due date (default 7 days)
  --po <text>                 Client PO number
  --notes <text>              Note to the client
  --terms <text>              Payment terms
  --template <id>             ${TEMPLATES.map((t) => t.id).join(", ")}
  --from-json <file|->        Start from a JSON invoice (same shape as the MCP tool)
  --json                      Print the result as JSON
  --open                      Open the invoice in your browser

Anything you leave out is asked for when you run it in a terminal.
The invoice lives in the link. Billy never stores it.

Use with an AI assistant
  claude mcp add billy -- npx -y trybilly mcp
  Or connect any remote MCP client to ${INVOICE_LINK_BASE}/mcp`

function fail(message: string): never {
  process.stderr.write(`billy: ${message}\n`)
  process.exit(1)
}

function linkBase(): string {
  return process.env.BILLY_URL || INVOICE_LINK_BASE
}

async function ask(rl: Interface, question: string, fallback?: string): Promise<string> {
  const hint = fallback ? ` (${fallback})` : ""
  const answer = (await rl.question(`${question}${hint}: `)).trim()
  return answer || fallback || ""
}

function openInBrowser(url: string) {
  const [command, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]]
  spawn(command, args, { stdio: "ignore", detached: true }).unref()
}

async function readJsonInput(source: string): Promise<Partial<InvoiceInput>> {
  let text: string
  if (source === "-") {
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer)
    text = Buffer.concat(chunks).toString("utf8")
  } else {
    text = await readFile(source, "utf8")
  }
  try {
    return JSON.parse(text) as Partial<InvoiceInput>
  } catch (error) {
    fail(`${source === "-" ? "stdin" : source} is not valid JSON: ${(error as Error).message}`)
  }
}

async function init(argv: string[]) {
  const { values } = parseArgs({
    args: argv,
    options: {
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      address: { type: "string" },
      gstin: { type: "string" },
      currency: { type: "string" },
      template: { type: "string" },
    },
  })
  const saved = await loadProfile()
  const from = { ...saved.from }
  const profile: Profile = { ...saved }

  const given = Object.values(values).some(Boolean)
  if (given) {
    if (values.name) from.name = values.name
    if (values.email) from.email = values.email
    if (values.phone) from.phone = values.phone
    if (values.address) from.address = values.address.replaceAll("\\n", "\n")
    if (values.gstin) from.gstin = values.gstin
    if (values.currency) profile.currency = values.currency.toUpperCase()
    if (values.template) profile.templateId = values.template
  } else {
    if (!process.stdin.isTTY) fail("run `billy init` in a terminal, or pass --name, --email and friends")
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    process.stdout.write("Your details go on every invoice. Press Enter to keep what's shown.\n\n")
    from.name = await ask(rl, "Business or your name", from.name)
    from.email = await ask(rl, "Email", from.email)
    from.phone = await ask(rl, "Phone", from.phone)
    from.address = (await ask(rl, "Address (\\n for new lines)", from.address?.replaceAll("\n", "\\n"))).replaceAll("\\n", "\n")
    from.gstin = await ask(rl, "GSTIN (India only, optional)", from.gstin)
    profile.currency = (await ask(rl, "Usual currency", profile.currency ?? "USD")).toUpperCase()
    rl.close()
  }

  profile.from = Object.fromEntries(Object.entries(from).filter(([, v]) => v)) as Profile["from"]
  if (profile.currency && !CURRENCIES.some((c) => c.code === profile.currency)) {
    fail(`unsupported currency ${profile.currency}. Use one of: ${CURRENCIES.map((c) => c.code).join(", ")}`)
  }
  if (profile.templateId && !TEMPLATES.some((t) => t.id === profile.templateId)) {
    fail(`unknown template ${profile.templateId}. Use one of: ${TEMPLATES.map((t) => t.id).join(", ")}`)
  }

  await saveProfile(profile)
  process.stdout.write(`\nSaved to ${profilePath()}\n`)
}

async function create(argv: string[]) {
  const { values } = parseArgs({
    args: argv,
    options: {
      to: { type: "string" },
      "to-email": { type: "string" },
      "to-address": { type: "string" },
      item: { type: "string", multiple: true },
      currency: { type: "string" },
      tax: { type: "string" },
      "tax-label": { type: "string" },
      gst: { type: "string" },
      discount: { type: "string" },
      number: { type: "string" },
      date: { type: "string" },
      due: { type: "string" },
      po: { type: "string" },
      notes: { type: "string" },
      terms: { type: "string" },
      template: { type: "string" },
      "from-json": { type: "string" },
      json: { type: "boolean" },
      open: { type: "boolean" },
    },
  })

  const profile = await loadProfile()
  let input: Partial<InvoiceInput>
  try {
    const fromJson = values["from-json"] ? await readJsonInput(values["from-json"]) : {}
    input = { ...fromJson, ...flagsToInput(values as NewFlags) }
  } catch (error) {
    fail((error as Error).message)
  }

  // Ask for whatever is still missing, when there's someone to ask.
  const interactive = process.stdin.isTTY && values["from-json"] !== "-"
  if (interactive && (!input.to?.name || !input.items?.length || !(input.currency || profile.currency))) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    if (!input.to?.name) input.to = { ...input.to, name: await ask(rl, "Client") }
    if (!input.items?.length) {
      input.items = []
      process.stdout.write('Line items as "description:quantity:rate" or "description:rate". Empty line to finish.\n')
      for (;;) {
        const line = await ask(rl, `Item ${input.items.length + 1}`)
        if (!line) break
        try {
          input.items.push(parseItem(line))
        } catch (error) {
          process.stdout.write(`${(error as Error).message}\n`)
        }
      }
    }
    if (!input.currency && !profile.currency) input.currency = await ask(rl, "Currency", "USD")
    rl.close()
  }

  const result = parseInvoiceInput(withDefaults(input as InvoiceInput, profile))
  if (!result.ok) fail(`couldn't build the invoice:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`)

  const { data, warnings } = result
  const link = buildInvoiceLink(data, linkBase())

  if (values.json) {
    const output = { link, invoiceNumber: data.invoiceNumber, currency: data.currency, total: calculateTotals(data).total, warnings }
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`)
  } else {
    process.stdout.write(`\n${summarizeInvoice(data)}\n\n`)
    for (const warning of warnings) process.stderr.write(`! ${warning}\n`)
    if (warnings.length && !profile.from?.name) process.stderr.write("  Run `billy init` to save your details once.\n")
    process.stdout.write(`${warnings.length ? "\n" : ""}Open in Billy:\n${link}\n`)
  }
  if (values.open) openInBrowser(link)
}

async function mcp() {
  const profile = await loadProfile()
  const { serveStdio } = await import("@modelcontextprotocol/server/stdio")
  // stdout carries the protocol, so nothing else may be written to it.
  serveStdio(() => createBillyServer({ defaults: profile, linkBase: linkBase(), version: VERSION }), {
    onerror: (error) => process.stderr.write(`billy mcp: ${error.message}\n`),
  })
}

async function showProfile() {
  const profile = await loadProfile()
  process.stdout.write(`${profilePath()}\n${JSON.stringify(profile, null, 2)}\n`)
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  switch (command) {
    case "init":
      return init(rest)
    case "new":
      return create(rest)
    case "mcp":
      return mcp()
    case "profile":
      return showProfile()
    case "-v":
    case "--version":
      process.stdout.write(`${VERSION}\n`)
      return
    case undefined:
    case "help":
    case "-h":
    case "--help":
      process.stdout.write(`${HELP}\n`)
      return
    default:
      fail(`unknown command "${command}". Run \`billy --help\`.`)
  }
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)))
