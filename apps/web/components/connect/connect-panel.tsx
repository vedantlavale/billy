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

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="lx-steps">{children}</ol>
}

/** The address people paste into Claude or ChatGPT. */
export function EndpointField() {
  const endpoint = useEndpoint()
  return (
    <div className="lx-endpoint">
      <span className="lx-endpoint-label">Billy&apos;s connector address</span>
      <div className="lx-endpoint-row">
        <code>{endpoint}</code>
        <CopyButton text={endpoint} label="Copy address" tone="primary" />
      </div>
      <span className="lx-endpoint-note">Free. No account, no API key, no sign-in.</span>
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

export function ConnectPanel() {
  const endpoint = useEndpoint()

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
          <p className="lx-connect-for">Claude on the web, desktop and mobile apps.</p>
          <Steps>
            <li>
              In Settings, open <b>Connectors</b> and choose <b>Add custom connector</b>.
            </li>
            <li>
              Name it <b>Billy</b> and paste the address above. It has to end in <code>/mcp</code>.
            </li>
            <li>
              Under Authentication pick <b>No sign-in</b>, then <b>Add</b> and <b>Connect</b>.
            </li>
            <li>In a new chat, switch Billy on from the tools menu and ask for an invoice.</li>
          </Steps>
        </TabsContent>

        <TabsContent value="chatgpt">
          <p className="lx-connect-for">ChatGPT on the web, with developer mode.</p>
          <Steps>
            <li>
              In Settings, turn on <b>developer mode</b>.
            </li>
            <li>
              Create a connector named <b>Billy</b> with the address above.
            </li>
            <li>
              Set authentication to <b>none</b> and save.
            </li>
            <li>In a new chat, choose Billy from the tools and ask for an invoice.</li>
          </Steps>
        </TabsContent>

        <TabsContent value="claude-code">
          <p className="lx-connect-for">One command in your terminal.</p>
          <CopyLine label="Claude Code command" text={`claude mcp add --transport http billy ${endpoint}`} />
          <p className="lx-connect-after">Then start a new session and ask for an invoice.</p>
        </TabsContent>

        <TabsContent value="cursor">
          <p className="lx-connect-for">One click, then confirm in Cursor.</p>
          <a className="lx-btn lx-btn-primary lx-btn-lg" href={cursorLink}>
            Add to Cursor
          </a>
          <p className="lx-connect-after">
            Or add it to <code>~/.cursor/mcp.json</code> yourself:
          </p>
          <div className="lx-codeblock">
            <pre>{cursorJson}</pre>
            <CopyButton text={cursorJson} />
          </div>
        </TabsContent>

        <TabsContent value="vscode">
          <p className="lx-connect-for">One click, then confirm in VS Code. Works with Copilot Chat in agent mode.</p>
          <a className="lx-btn lx-btn-primary lx-btn-lg" href={vscodeLink}>
            Install in VS Code
          </a>
        </TabsContent>

        <TabsContent value="codex">
          <p className="lx-connect-for">One command in your terminal.</p>
          <CopyLine label="Codex command" text={`codex mcp add billy --url ${endpoint}`} />
          <p className="lx-connect-after">
            Then start Codex and run <code>/mcp</code> to check Billy is listed.
          </p>
        </TabsContent>
      </div>
    </Tabs>
  )
}

/** An example request, ready to paste into a chat. */
export function PromptCard({ text }: { text: string }) {
  const { copied, copy } = useCopy()
  return (
    <button type="button" className="lx-prompt" onClick={() => void copy(text)}>
      <span className="lx-prompt-text">&ldquo;{text}&rdquo;</span>
      <span className="lx-prompt-action">
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
