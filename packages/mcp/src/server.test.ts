import { describe, expect, test } from "bun:test"
import { createMcpHandler } from "@modelcontextprotocol/server"

import { readInvoiceFromHash } from "@billy/invoice-core"

import { createBillyServer, type BillyServerOptions } from "./server"

/** Call the server the way a 2025-era HTTP client (Claude, ChatGPT) does. */
function client(options?: BillyServerOptions) {
  const handler = createMcpHandler(() => createBillyServer(options))
  let id = 0
  return async (method: string, params?: unknown) => {
    const response = await handler.fetch(
      new Request("http://localhost/mcp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
          "mcp-protocol-version": "2025-06-18",
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
      }),
    )
    const body = await response.text()
    const data = body.split("\n").find((line) => line.startsWith("data: "))
    return JSON.parse(data ? data.slice(6) : body).result
  }
}

const acme = {
  from: { name: "Vedant Studio", email: "hi@vedant.studio" },
  to: { name: "Acme Corp" },
  items: [{ description: "Design", quantity: 12, rate: 80 }],
  currency: "usd",
  dueInDays: 14,
}

describe("billy mcp server", () => {
  test("lists its tools with a JSON schema agents can fill", async () => {
    const { tools } = await client()("tools/list")
    expect(tools.map((t: { name: string }) => t.name)).toEqual(["create_invoice", "list_invoice_options"])
    expect(tools[0].inputSchema.required).toEqual(["to", "items"])
  })

  test("create_invoice returns a summary and a link that decodes to the same invoice", async () => {
    const result = await client()("tools/call", { name: "create_invoice", arguments: acme })
    expect(result.isError).toBeUndefined()
    expect(result.content[0].text).toContain("Total: $960.00")

    const { link, total, currency } = result.structuredContent
    expect({ total, currency }).toEqual({ total: 960, currency: "USD" })
    expect(result.content[1]).toMatchObject({ type: "resource_link", uri: link })

    const decoded = readInvoiceFromHash(new URL(link).hash)
    expect(decoded?.ok && decoded.data.clientName).toBe("Acme Corp")
  })

  test("points links at the configured origin", async () => {
    const result = await client({ linkBase: "http://localhost:3000/" })("tools/call", {
      name: "create_invoice",
      arguments: acme,
    })
    expect(result.structuredContent.link.startsWith("http://localhost:3000/editor#i=")).toBe(true)
  })

  test("fills gaps from saved defaults without overriding the agent", async () => {
    const call = client({ defaults: { from: { name: "Saved Co", address: "Pune" }, currency: "INR" } })
    const result = await call("tools/call", {
      name: "create_invoice",
      arguments: {
        to: acme.to,
        items: acme.items,
        dueInDays: acme.dueInDays,
        from: { email: "new@saved.co" },
      },
    })
    expect(result.isError).toBeUndefined()
    const decoded = readInvoiceFromHash(new URL(result.structuredContent.link).hash)
    if (!decoded?.ok) throw new Error("link did not decode")
    expect(decoded.data.businessName).toBe("Saved Co")
    expect(decoded.data.businessEmail).toBe("new@saved.co")
    expect(decoded.data.currency).toBe("INR")
  })

  test("hide the founders-only template from agents", async () => {
    const listed = await client()("tools/call", { name: "list_invoice_options" })
    expect(listed.structuredContent.templates.map((t: { id: string }) => t.id)).not.toContain("founders")

    const result = await client()("tools/call", {
      name: "create_invoice",
      arguments: { ...acme, templateId: "founders" },
    })
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain("templateId")
  })

  test("explains invalid input instead of failing silently", async () => {
    const result = await client()("tools/call", {
      name: "create_invoice",
      arguments: { to: { name: "Acme" }, items: [], currency: "XYZ" },
    })
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain("items")
    expect(result.content[0].text).toContain("Use one of: INR")
  })
})
