'use client'

import * as React from "react"
import Link from "next/link"

import { Kbd, useModKey } from "@/components/invoice/editor-ui"
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs"
import { useInvoiceDispatch, useInvoiceHistory, useInvoiceState } from "@/components/invoice/invoice-context"
import { CloudIcon, EyeIcon, FileDownIcon, FilePlusIcon, PencilIcon, RedoIcon, SearchIcon, SlidersIcon, SpinnerIcon, UndoIcon } from "@/components/icons/rune"

export type EditorMode = "edit" | "preview"

interface ToolbarProps {
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  onOpenSettings: () => void
  onNew: () => void
  onExport: () => void
  onOpenCommands: () => void
  exporting: boolean
}

/**
 * The invoice auto-saves to localStorage on every change (see
 * InvoiceProvider). This mirrors that as a quiet status so people know their
 * edits are safe without a save button.
 */
function SaveStatus() {
  const state = useInvoiceState()
  const [saving, setSaving] = React.useState(false)
  const first = React.useRef(true)

  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setSaving(true)
    const timer = window.setTimeout(() => setSaving(false), 700)
    return () => window.clearTimeout(timer)
  }, [state])

  return (
    <span
      className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium leading-4 xl:inline-flex"
      aria-live="polite"
      title="Saved in this browser. Nothing leaves your device."
    >
      {saving ? (
        <SpinnerIcon size={14} className="animate-spin" aria-hidden />
      ) : (
        <CloudIcon size={14} aria-hidden />
      )}
      {saving ? "Saving…" : "Saved on this device"}
    </span>
  )
}

export function Toolbar({
  mode,
  onModeChange,
  onOpenSettings,
  onNew,
  onExport,
  onOpenCommands,
  exporting,
}: ToolbarProps) {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { canUndo, canRedo } = useInvoiceHistory()
  const mod = useModKey()

  return (
    <header className="ed-topbar ed-chrome toolbar editor-chrome">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href="/"
          aria-label="Billy home"
          className="shrink-0 font-serif text-[26px] leading-none"
        >
          billy*
        </Link>
        <span className="hidden h-5 w-px bg-[#E5E7EB] sm:block" aria-hidden />
        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span className="truncate text-sm font-semibold leading-5">
            {state.invoiceNumber || "Untitled"}
          </span>
          {state.clientName && (
            <span className="hidden truncate text-sm leading-5 xl:inline">· {state.clientName}</span>
          )}
        </div>
        <SaveStatus />
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => onModeChange(value as EditorMode)}
        variant="segment"
      >
        <TabsList aria-label="Editor mode">
          <TabsTrigger value="edit" aria-label="Edit" title={`Edit (${mod} E)`} className="gap-1.5 px-3 py-[5px]">
            <PencilIcon size={14} aria-hidden />
            <span className="hidden sm:inline">Edit</span>
          </TabsTrigger>
          <TabsTrigger value="preview" aria-label="Preview" title={`Preview (${mod} E)`} className="gap-1.5 px-3 py-[5px]">
            <EyeIcon size={14} aria-hidden />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-1 items-center justify-end gap-2">
        <button
          type="button"
          onClick={onOpenCommands}
          className="ed-btn ed-btn--secondary ed-btn--commands"
          title={`Search commands (${mod} K)`}
          aria-label="Search commands"
          aria-keyshortcuts="Meta+K Control+K"
        >
          <SearchIcon size={15} aria-hidden />
          <span className="ed-btn-label">Commands</span>
          <Kbd>{mod}K</Kbd>
        </button>
        <div className="ed-history" role="group" aria-label="History">
          <button
            type="button"
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!canUndo}
            className="ed-btn ed-btn--ghost ed-btn--icon"
            title={`Undo (${mod} Z)`}
            aria-label="Undo"
            aria-keyshortcuts="Meta+Z Control+Z"
          >
            <UndoIcon size={16} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "REDO" })}
            disabled={!canRedo}
            className="ed-btn ed-btn--ghost ed-btn--icon"
            title={`Redo (⇧ ${mod} Z)`}
            aria-label="Redo"
            aria-keyshortcuts="Shift+Meta+Z Control+Y"
          >
            <RedoIcon size={16} aria-hidden />
          </button>
        </div>
        <span className="ed-divider" aria-hidden />
        <button
          type="button"
          onClick={onOpenSettings}
          className="ed-btn ed-btn--secondary ed-btn--icon lg:hidden"
          aria-label="Invoice settings"
        >
          <SlidersIcon size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onNew}
          className="ed-btn ed-btn--ghost ed-btn--collapse"
          title="Start a new invoice"
          aria-label="New invoice"
        >
          <FilePlusIcon size={16} aria-hidden />
          <span className="ed-btn-label">New</span>
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="ed-btn ed-btn--primary ed-btn--collapse"
          title={`Download PDF (${mod} P)`}
          aria-label="Download PDF"
        >
          {exporting ? (
            <SpinnerIcon size={16} className="animate-spin" aria-hidden />
          ) : (
            <FileDownIcon size={16} aria-hidden />
          )}
          <span className="ed-btn-label">{exporting ? "Preparing…" : "Download PDF"}</span>
          <span className="hidden xl:inline-flex" aria-hidden>
            <Kbd>{mod}P</Kbd>
          </span>
        </button>
      </div>
    </header>
  )
}
