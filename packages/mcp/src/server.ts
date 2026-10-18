import { McpServer } from "@modelcontextprotocol/server"
import { z } from "zod"

import { CURRENCIES, INVOICE_LINK_BASE, SELECTABLE_TEMPLATES, buildInvoiceLink, calculateTotals, professionPresets } from "@billy/invoice-core"
import { invoiceInputSchema, parseInvoiceInput, summarizeInvoice, type InvoiceInput } from "@billy/invoice-core/agent"

export interface BillyServerOptions {
  /** Origin the editor links point at. Defaults to the production site. */
  linkBase?: string
  /**
   * Details to fall back on when the agent leaves them out, e.g. the sender
   * profile a CLI user saved with `billy init`.
   */
  defaults?: Partial<Pick<InvoiceInput, "from" | "bank" | "currency" | "templateId" | "preset" | "taxRate" | "taxLabel" | "paymentTerms" | "notes">>
  version?: string
}

const INSTRUCTIONS = `Billy turns what the user tells you into a finished invoice.

1. Gather: the client's name, what was delivered with quantities and prices, and the currency. Ask for anything you can't infer. Ask for the user's own business name, email and address once, then reuse them.
2. Call create_invoice. It returns a summary and a link.
3. Check the summary against what the user asked for, then give them the link exactly as returned. It opens the invoice, fully filled in, in the Billy editor, where they can adjust it and download the PDF.

Billy stores nothing: the whole invoice lives in the link. Logos and stamps are added in the editor and remembered in that browser.`

const CREATE_DESCRIPTION = `Create an invoice and get a link that opens it in the Billy editor, ready to review and download as a PDF.
Nothing is stored; the invoice lives in the link. Required: client name and at least one line item. The currency comes from the user's saved profile when omitted; ask the user for one when no profile exists.
Leave out anything the user didn't mention rather than inventing it (tax defaults to 0, due date to 7 days).`

const createOutput = z.object({
  link: z.string().describe("Editor link; give it to the user exactly as returned"),
  invoiceNumber: z.string(),
  currency: z.string(),
  total: z.number(),
  warnings: z.array(z.string()),
})

/*
 * The tool boundary takes a looser shape than the domain does: `withDefaults`
 * fills gaps from the saved profile (`billy init`) before the invoice is
 * validated, so the currency may arrive late. `parseInvoiceInput` still
 * demands one before an invoice is built.
 */
const createInputSchema = invoiceInputSchema.extend({
  currency: invoiceInputSchema.shape.currency.optional(),
})

/** `args` with gaps filled from saved defaults. What the caller sent always wins. */
export function withDefaults(args: InvoiceInput, defaults: BillyServerOptions["defaults"] = {}): InvoiceInput {
  const { from, bank, ...rest } = defaults
  return {
    ...rest,
    ...args,
    from: from || args.from ? { ...from, ...args.from } : undefined,
    bank: bank || args.bank ? { ...bank, ...args.bank } : undefined,
  }
}

/** A Billy MCP server. Stateless, so HTTP can build one per request. */
export function createBillyServer(options: BillyServerOptions = {}): McpServer {
  const linkBase = options.linkBase ?? INVOICE_LINK_BASE
  const server = new McpServer(
    { name: "billy", title: "Billy", version: options.version ?? "0.1.0", websiteUrl: INVOICE_LINK_BASE },
    { instructions: INSTRUCTIONS },
  )

  server.registerTool(
    "create_invoice",
    {
      title: "Create invoice",
      description: CREATE_DESCRIPTION,
      inputSchema: createInputSchema,
      outputSchema: createOutput,
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (args) => {
      const result = parseInvoiceInput(withDefaults(args as InvoiceInput, options.defaults))
      if (!result.ok) {
        return {
          isError: true,
          content: [{ type: "text", text: `Couldn't build the invoice:\n${result.errors.map((e) => `- ${e}`).join("\n")}` }],
        }
      }

      const { data, warnings } = result
      const link = buildInvoiceLink(data, linkBase)
      const output = {
        link,
        invoiceNumber: data.invoiceNumber,
        currency: data.currency,
        total: calculateTotals(data).total,
        warnings,
      }
      const text = [
        summarizeInvoice(data),
        ...(warnings.length ? ["", "Warnings:", ...warnings.map((w) => `- ${w}`)] : []),
        "",
        `Open in Billy: ${link}`,
      ].join("\n")

      return {
        content: [
          { type: "text", text },
          {
            type: "resource_link",
            uri: link,
            name: `${data.invoiceNumber || "invoice"}`,
            title: `Invoice ${data.invoiceNumber} for ${data.clientName}`,
            description: "Opens the invoice in the Billy editor",
            mimeType: "text/html",
          },
        ],
        structuredContent: output,
      }
    },
  )

  server.registerTool(
    "list_invoice_options",
    {
      title: "List invoice options",
      description: "Templates, currencies and profession presets create_invoice accepts.",
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      const options = {
        templates: SELECTABLE_TEMPLATES.map(({ id, name, description }) => ({ id, name, description })),
        currencies: CURRENCIES.map(({ code, name, symbol }) => ({ code, name, symbol })),
        presets: Object.entries(professionPresets).map(([id, preset]) => ({
          id,
          shows: Object.entries(preset)
            .filter(([key, on]) => key.startsWith("show") && on === true)
            .map(([key]) => key.replace(/^show/, "")),
        })),
      }
      return {
        content: [{ type: "text", text: JSON.stringify(options, null, 2) }],
        structuredContent: options,
      }
    },
  )

  return server
}
