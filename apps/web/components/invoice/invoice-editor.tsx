'use client'

import * as React from "react"
import posthog from "posthog-js"

import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import {
  InvoiceProvider,
  useInvoiceDispatch,
  useInvoiceState,
} from "@/components/invoice/invoice-context"
import { CommandPalette } from "@/components/invoice/command-palette"
import { useModKey } from "@/components/invoice/editor-ui"
import { InspectorPanel } from "@/components/invoice/inspector-panel"
import { useEditorCommands } from "@/components/invoice/use-editor-commands"
import { Toolbar, type EditorMode } from "@/components/invoice/toolbar"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/toast"
import { exportInvoicePdf } from "@/lib/pdf/client-export"
import { getTemplate } from "@billy/invoice-core"

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
}

function EditorWorkspace() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { toast } = useToast()
  const template = React.useMemo(() => getTemplate(state.templateId), [state.templateId])

  const [mode, setMode] = React.useState<EditorMode>("edit")
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [confirmNew, setConfirmNew] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)

  // Read through a ref so the keyboard handler below never goes stale.
  const stateRef = React.useRef(state)
  React.useLayoutEffect(() => {
    stateRef.current = state
  }, [state])
  const exportingRef = React.useRef(false)

  const handleExport = React.useCallback(async () => {
    if (exportingRef.current) return
    if (document.activeElement instanceof HTMLElement) {
      // Commit any field that's mid-edit before we snapshot the state.
      document.activeElement.blur()
    }
    exportingRef.current = true
    setExporting(true)
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const data = stateRef.current
    try {
      await exportInvoicePdf(data)
      posthog.capture("invoice_pdf_exported", {
        template_id: data.templateId,
        invoice_number: data.invoiceNumber,
        method: "client",
      })
      toast("PDF downloaded")
    } catch (error) {
      console.error("PDF export failed:", error)
      toast("Couldn't generate the PDF. Please try again.", "error")
    } finally {
      exportingRef.current = false
      setExporting(false)
    }
  }, [toast])

  const handleNew = React.useCallback(() => {
    posthog.capture("invoice_reset", { template_id: stateRef.current.templateId })
    dispatch({ type: "RESET_INVOICE" })
    setMode("edit")
    toast("Started a new invoice. Your business details were kept.", "info")
  }, [dispatch, toast])

  const closeConfirm = React.useCallback(() => setConfirmNew(false), [])
  const closeSettings = React.useCallback(() => setSettingsOpen(false), [])

  const mod = useModKey()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const closePalette = React.useCallback(() => setPaletteOpen(false), [])
  const openNewConfirm = React.useCallback(() => setConfirmNew(true), [])
  const commands = useEditorCommands({
    mod,
    mode,
    setMode,
    onExport: () => void handleExport(),
    onNew: openNewConfirm,
  })

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return
      const key = event.key.toLowerCase()

      // ⌘K works everywhere, even mid-edit, so it's always one chord away.
      if (key === "k" && !event.shiftKey) {
        event.preventDefault()
        setPaletteOpen((open) => !open)
        return
      }

      // Undo/redo step through invoice history, but stand aside while a
      // text field is focused so the browser's own text undo keeps working.
      const redo = (key === "z" && event.shiftKey) || (key === "y" && !event.shiftKey)
      if ((key === "z" || redo) && !isEditableTarget(event.target)) {
        event.preventDefault()
        dispatch({ type: redo ? "REDO" : "UNDO" })
        return
      }

      if (event.shiftKey) return
      if (key === "p") {
        // Replace the browser's print dialog with our real PDF export.
        event.preventDefault()
        void handleExport()
      } else if (key === "e") {
        event.preventDefault()
        setMode((current) => (current === "edit" ? "preview" : "edit"))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleExport, dispatch])

  return (
    <div
      className="invoice-editor ed-root flex h-dvh flex-col"
      style={{
        color: template.colors.ink,
        "--invoice-ink": template.colors.ink,
        "--invoice-muted": template.colors.muted,
        "--invoice-subtle": template.colors.subtle,
        "--invoice-paper": template.colors.paper,
        "--invoice-border": template.colors.border,
        "--invoice-accent": template.colors.accent,
        "--invoice-desk": "#F3F4F6",
        "--invoice-panel": "#FFFFFF",
        "--invoice-panel-border": "#E5E7EB",
        "--invoice-panel-soft": "#F3F4F6",
        "--invoice-toolbar": "#FFFFFF",
        "--invoice-primary": template.colors.primary,
        "--invoice-secondary": template.colors.secondary,
        "--invoice-font": template.cssFontFamily,
      } as React.CSSProperties}
    >
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        onOpenSettings={() => setSettingsOpen(true)}
        onNew={() => setConfirmNew(true)}
        onExport={() => void handleExport()}
        onOpenCommands={() => setPaletteOpen(true)}
        exporting={exporting}
      />

      <div className="flex min-h-0 flex-1">
        <InspectorPanel variant="rail" />
        <InvoiceCanvas mode={mode} />
      </div>

      {settingsOpen && <InspectorPanel variant="drawer" onClose={closeSettings} />}

      <CommandPalette open={paletteOpen} onClose={closePalette} commands={commands} />

      <ConfirmDialog
        isOpen={confirmNew}
        onClose={closeConfirm}
        onConfirm={handleNew}
        title="Start a new invoice?"
        description="Client, line items and dates will be cleared. Your business details, logo, tax rate and currency stay."
        confirmText="Start new"
        type="danger"
      />
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
