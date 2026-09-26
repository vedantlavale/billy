/*
 * The Billy site Worker. Cloudflare serves the static export directly; only
 * /mcp reaches this code (`assets.run_worker_first` in wrangler.jsonc).
 *
 * /mcp is a stateless MCP endpoint for Claude, ChatGPT and terminal agents.
 * It holds no data: each request builds a server, turns the agent's input
 * into an editor link, and forgets it.
 */
import { createMcpHandler } from "@modelcontextprotocol/server"

import { createBillyServer } from "@billy/mcp"

interface Env {
  ASSETS: Fetcher
  MCP_RATE_LIMITER?: RateLimit
}

// Browser-based MCP clients (e.g. the MCP Inspector) call cross-origin.
// There are no cookies or credentials to protect, so any origin may call.
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-allow-headers":
    "authorization, content-type, accept, last-event-id, mcp-protocol-version, mcp-session-id",
  "access-control-expose-headers": "mcp-protocol-version, mcp-session-id",
  "access-control-max-age": "86400",
}

const mcp = createMcpHandler(({ requestInfo }) =>
  // Links point back at whichever deployment served the request, so a
  // preview or `wrangler dev` hands out links to its own editor.
  createBillyServer({ linkBase: requestInfo ? new URL(requestInfo.url).origin : undefined }),
)

function withCors(response: Response): Response {
  const headed = new Response(response.body, response)
  for (const [key, value] of Object.entries(CORS_HEADERS)) headed.headers.set(key, value)
  return headed
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname !== "/mcp") return env.ASSETS.fetch(request)

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS })

    if (env.MCP_RATE_LIMITER) {
      const key = request.headers.get("cf-connecting-ip") ?? "unknown"
      const { success } = await env.MCP_RATE_LIMITER.limit({ key })
      if (!success) return withCors(new Response("Too many requests. Try again in a minute.", { status: 429 }))
    }

    return withCors(await mcp.fetch(request))
  },
} satisfies ExportedHandler<Env>
