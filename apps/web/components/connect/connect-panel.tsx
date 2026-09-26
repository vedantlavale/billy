"use client"

import * as React from "react"

import { INVOICE_LINK_BASE } from "@billy/invoice-core"

import { CheckIcon } from "@/components/icons/rune"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs"

/* The MCP endpoint lives on the same origin as the page, so a preview or a
   local tunnel shows (and installs) its own endpoint. The static build
   renders the production address. */
const PRODUCTION_ENDPOINT = `${INVOICE_LINK_BASE}/mcp`
const noop = () => () => {}
function useEndpoint() {
  return React.useSyncExternalStore(
    noop,
    () => `${window.location.origin}/mcp`,
    () => PRODUCTION_ENDPOINT,
  )
}

function useCopy() {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }, [])

  return { copied, copy }
}

function CopyButton({ text, label = "Copy", tone = "ghost" }: { text: string; label?: string; tone?: "ghost" | "primary" }) {
  const { copied, copy } = useCopy()
  return (
    <button type="button" className={`lx-btn lx-btn-${tone} lx-copy-btn`} onClick={() => void copy(text)}>
      {copied ? (
        <>
          <CheckIcon size={15} /> Copied
        </>
      ) : (
        label
      )}
    </button>
  )
}

/** A one-line command or address with its own copy button. */
function CopyLine({ text, label }: { text: string; label: string }) {
  return (
    <div className="lx-copyline">
      <code aria-label={label}>{text}</code>
      <CopyButton text={text} />
    </div>
  )
}

const CLIENTS = [
  { id: "claude", label: "Claude" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "vscode", label: "VS Code" },
  { id: "codex", label: "Codex" },
] as const

function ClientSetup({ endpoint }: { endpoint: string }) {
  const cursorLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=billy&config=${encodeURIComponent(
    btoa(JSON.stringify({ url: endpoint })),
  )}`
  const vscodeLink = `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: "billy", type: "http", url: endpoint }))}`
  const cursorJson = JSON.stringify({ mcpServers: { billy: { url: endpoint } } }, null, 2)

  return (
    <Tabs defaultValue="claude" variant="segment">
      <TabsList aria-label="Choose your assistant" wrapperClassName="lx-connect-tabs">
        {CLIENTS.map((client) => (
          <TabsTrigger key={client.id} value={client.id} className="px-3 py-[6px]">
            {client.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="lx-connect-body">
        <TabsContent value="claude">
          <ol className="lx-substeps">
            <li>
              In Settings, open <b>Connectors</b> and choose <b>Add custom connector</b>.
            </li>
            <li>
              Name it <b>Billy</b> and paste the address. It has to end in <code>/mcp</code>.
            </li>
            <li>
              Under Authentication pick <b>No sign-in</b>, then <b>Add</b> and <b>Connect</b>.
            </li>
            <li>In a new chat, switch Billy on from the tools menu.</li>
          </ol>
        </TabsContent>

        <TabsContent value="chatgpt">
          <ol className="lx-substeps">
            <li>
              In Settings, turn on <b>developer mode</b>.
            </li>
            <li>
              Create a connector named <b>Billy</b> with the address.
            </li>
            <li>
              Set authentication to <b>none</b> and save.
            </li>
            <li>In a new chat, choose Billy from the tools.</li>
          </ol>
        </TabsContent>

        <TabsContent value="claude-code">
          <p className="lx-connect-for">Run this once in your terminal:</p>
          <CopyLine label="Claude Code command" text={`claude mcp add --transport http billy ${endpoint}`} />
        </TabsContent>

        <TabsContent value="cursor">
          <a className="lx-btn lx-btn-primary" href={cursorLink}>
            Add to Cursor
          </a>
          <p className="lx-connect-for lx-connect-or">
            Or add it to <code>~/.cursor/mcp.json</code>:
          </p>
          <div className="lx-codeblock">
            <pre>{cursorJson}</pre>
            <CopyButton text={cursorJson} />
          </div>
        </TabsContent>

        <TabsContent value="vscode">
          <a className="lx-btn lx-btn-primary" href={vscodeLink}>
            Install in VS Code
          </a>
          <p className="lx-connect-for lx-connect-or">Then use it from Copilot Chat in agent mode.</p>
        </TabsContent>

        <TabsContent value="codex">
          <p className="lx-connect-for">Run this once in your terminal:</p>
          <CopyLine label="Codex command" text={`codex mcp add billy --url ${endpoint}`} />
        </TabsContent>
      </div>
    </Tabs>
  )
}

/**
 * The whole setup as three numbered steps: copy the address, add it to your
 * assistant, ask. Everything a visitor has to do is on this one card.
 */
export function ConnectFlow({ prompts }: { prompts: string[] }) {
  const endpoint = useEndpoint()
  const [first, ...more] = prompts

  return (
    <ol className="lx-flow">
      <li className="lx-flow-step">
        <h2 className="lx-flow-title">Copy Billy&apos;s address</h2>
        <div className="lx-endpoint-row">
          <code>{endpoint}</code>
          <CopyButton text={endpoint} label="Copy" tone="primary" />
        </div>
        <p className="lx-flow-note">Free. No account, no API key.</p>
      </li>

      <li className="lx-flow-step">
        <h2 className="lx-flow-title">Add it to your assistant</h2>
        <ClientSetup endpoint={endpoint} />
      </li>

      <li className="lx-flow-step">
        <h2 className="lx-flow-title">Ask for an invoice</h2>
        <PromptLine text={first} />
        {more.length > 0 && (
          <details className="lx-flow-more">
            <summary>More examples</summary>
            {more.map((prompt) => (
              <PromptLine key={prompt} text={prompt} />
            ))}
          </details>
        )}
        <p className="lx-flow-note">
          You get back a summary and a link. It opens the finished invoice in Billy, ready to check and download.
        </p>
      </li>
    </ol>
  )
}

function PromptLine({ text }: { text: string }) {
  const { copied, copy } = useCopy()
  return (
    <button type="button" className="lx-ask" onClick={() => void copy(text)} aria-label={`Copy: ${text}`}>
      <span className="lx-ask-text">{text}</span>
      <span className="lx-ask-action" aria-hidden>
        {copied ? (
          <>
            <CheckIcon size={14} /> Copied
          </>
        ) : (
          "Copy"
        )}
      </span>
    </button>
  )
}
