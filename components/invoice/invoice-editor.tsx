'use client'

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import {
  InvoiceProvider,
  useInvoiceDispatch,
  useInvoiceState,
} from "@/components/invoice/invoice-context"
import type { InvoiceData } from "@/lib/types"
import { ResizableSplit } from "@/components/ui/resizable-split"
import { Toolbar } from "@/components/invoice/toolbar"
import { getTemplate } from "@/lib/templates"

function EditorWorkspace() {
  const state = useInvoiceState()
  const template = React.useMemo(() => getTemplate(state.templateId), [state.templateId])

  return (
    <div
      className="invoice-editor h-dvh flex flex-col"
      style={{
        backgroundColor: template.colors.desk,
        color: template.colors.ink,
        "--invoice-ink": template.colors.ink,
        "--invoice-muted": template.colors.muted,
        "--invoice-subtle": template.colors.subtle,
        "--invoice-paper": template.colors.paper,
        "--invoice-border": template.colors.border,
        "--invoice-accent": template.colors.accent,
        "--invoice-desk": template.colors.desk,
        "--invoice-panel": template.colors.panel,
        "--invoice-panel-border": template.colors.panelBorder,
        "--invoice-toolbar": template.colors.toolbar,
        "--invoice-primary": template.colors.primary,
        "--invoice-secondary": template.colors.secondary,
        "--invoice-font": template.cssFontFamily,
      } as React.CSSProperties}
    >
      <Toolbar />
      <div className="flex-1 min-h-0">
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
      </div>
    </div>
  )
}

/**
 * When the editor is opened as /editor?id=<id>, load that saved invoice from the
 * server so editing updates the existing row (instead of creating a duplicate)
 * and the dashboard "Edit" action works. Renders nothing.
 */
function InvoiceLoader() {
  const dispatch = useInvoiceDispatch()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  React.useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      try {
        const response = await fetch(`/api/invoices?id=${encodeURIComponent(id)}`)
        if (!response.ok) return
        const { invoice } = await response.json()
        if (cancelled || !invoice?.data) return

        const loaded: InvoiceData = {
          ...invoice.data,
          id: invoice.id,
          templateId: invoice.template_id || invoice.data.templateId,
        }
        dispatch({ type: "LOAD_STATE", payload: loaded })
      } catch (error) {
        console.error("Failed to load invoice:", error)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, dispatch])

  return null
}

export default function InvoiceEditor() {
  return (
    <InvoiceProvider>
      <React.Suspense fallback={null}>
        <InvoiceLoader />
      </React.Suspense>
      <EditorWorkspace />
    </InvoiceProvider>
  )
}
