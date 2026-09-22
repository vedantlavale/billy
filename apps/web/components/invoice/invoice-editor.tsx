'use client'

import * as React from "react"
import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import {
  InvoiceProvider,
  useInvoiceState,
} from "@/components/invoice/invoice-context"
import { ResizableSplit } from "@/components/ui/resizable-split"
import { Toolbar } from "@/components/invoice/toolbar"
import { CustomizePanel } from "@/components/invoice/customize-panel"
import { getTemplate } from "@billy/invoice-core"

function EditorWorkspace() {
  const state = useInvoiceState()
  const template = React.useMemo(() => getTemplate(state.templateId), [state.templateId])
  const [customizeOpen, setCustomizeOpen] = React.useState(false)

  return (
    <div
      className="invoice-editor h-dvh flex flex-col"
      style={{
        // The desk (app shell behind the paper) is always the neutral Billy
        // surface, matching the landing page. Only the paper itself carries the
        // template's colors.
        backgroundColor: "#E0E0DF",
        color: template.colors.ink,
        "--invoice-ink": template.colors.ink,
        "--invoice-muted": template.colors.muted,
        "--invoice-subtle": template.colors.subtle,
        "--invoice-paper": template.colors.paper,
        "--invoice-border": template.colors.border,
        "--invoice-accent": template.colors.accent,
        "--invoice-desk": "#E0E0DF",
        "--invoice-panel": "#FFFFFF",
        "--invoice-panel-border": "#E4E2DD",
        "--invoice-toolbar": "#FFFFFF",
        "--invoice-primary": template.colors.primary,
        "--invoice-secondary": template.colors.secondary,
        "--invoice-font": template.cssFontFamily,
      } as React.CSSProperties}
    >
      <Toolbar
        customizeOpen={customizeOpen}
        onToggleCustomize={() => setCustomizeOpen((open) => !open)}
      />
      <div className="relative flex-1 min-h-0">
        <ResizableSplit
          defaultLeftPercent={50}
          minLeftPercent={30}
          maxLeftPercent={80}
          className="h-full"
          left={
            <main className="h-full overflow-auto p-4 sm:p-6 lg:p-8">
              <InvoiceCanvas />
            </main>
          }
          right={
            <aside
              className="editor-chrome h-full flex flex-col"
              style={{ borderColor: "var(--invoice-panel-border)", backgroundColor: "var(--invoice-panel)" }}
            >
              <InvoicePreview />
            </aside>
          }
        />
        {customizeOpen && <CustomizePanel onClose={() => setCustomizeOpen(false)} />}
      </div>
    </div>
  )
}

export default function InvoiceEditor() {
  return (
    <InvoiceProvider>
      <EditorWorkspace />
    </InvoiceProvider>
  )
}
