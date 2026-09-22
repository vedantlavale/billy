"use client"

import * as React from "react"
import { CURRENCIES, TEMPLATES, type InvoiceData } from "@billy/invoice-core"

import type { Command } from "@/components/invoice/command-palette"
import { useInvoiceDispatch, useInvoiceHistory, useInvoiceState } from "@/components/invoice/invoice-context"
import type { EditorMode } from "@/components/invoice/toolbar"
import { PAYMENT_TERMS, addDays, currentTermDays } from "@/lib/payment-terms"

type Options = InvoiceData["options"]

const FIELD_TOGGLES: { key: keyof Options; label: string; keywords?: string }[] = [
  { key: "showPONumber", label: "PO number", keywords: "purchase order" },
  { key: "showBankDetails", label: "Bank details", keywords: "account ifsc" },
  { key: "showDigitalStamp", label: "Digital stamp", keywords: "signature seal" },
  { key: "showGSTIN", label: "GSTIN", keywords: "gst tax number" },
  { key: "showHSNCode", label: "HSN / SAC column", keywords: "gst code" },
  { key: "showReverseCharge", label: "Reverse charge note", keywords: "gst" },
]

/** Start editing the description of the last line item (after adding one). */
function focusLastLineItem() {
  requestAnimationFrame(() => {
    const rows = document.querySelectorAll<HTMLElement>(".invoice-canvas .line-item-row")
    rows[rows.length - 1]?.querySelector<HTMLElement>(".invoice-field")?.click()
  })
}

export function useEditorCommands({
  mod,
  mode,
  setMode,
  onExport,
  onNew,
}: {
  mod: string
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  onExport: () => void
  onNew: () => void
}): Command[] {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { canUndo, canRedo } = useInvoiceHistory()

  return React.useMemo(() => {
    const setOptions = (patch: Partial<Options>) =>
      dispatch({ type: "UPDATE_FIELD", field: "options", value: { ...state.options, ...patch } })
    const term = currentTermDays(state.invoiceDate, state.dueDate)
    const taxMode = state.options.showIGST ? "inter" : state.options.showCGST || state.options.showSGST ? "intra" : "standard"

    const commands: Command[] = [
      {
        id: "add-line",
        group: "Invoice",
        label: "Add line item",
        keywords: "new row item service",
        run: () => {
          setMode("edit")
          dispatch({ type: "ADD_LINE_ITEM" })
          focusLastLineItem()
        },
      },
      { id: "download", group: "Invoice", label: "Download PDF", keywords: "export print save", shortcut: [mod, "P"], run: onExport },
      {
        id: "mode",
        group: "Invoice",
        label: mode === "edit" ? "Preview invoice" : "Back to editing",
        keywords: "edit preview view mode",
        shortcut: [mod, "E"],
        run: () => setMode(mode === "edit" ? "preview" : "edit"),
      },
      { id: "new", group: "Invoice", label: "New invoice", keywords: "reset clear fresh next number", run: onNew },
      { id: "undo", group: "History", label: canUndo ? "Undo" : "Undo (nothing to undo)", shortcut: [mod, "Z"], run: () => dispatch({ type: "UNDO" }) },
      { id: "redo", group: "History", label: canRedo ? "Redo" : "Redo (nothing to redo)", shortcut: ["⇧", mod, "Z"], run: () => dispatch({ type: "REDO" }) },
      ...PAYMENT_TERMS.map((t) => ({
        id: `term-${t.days}`,
        group: "Payment terms",
        label: t.days === 0 ? "Due on receipt" : `Due in ${t.days} days (${t.label})`,
        keywords: "due date net terms",
        hint: term === t.days ? "Current" : undefined,
        run: () => dispatch({ type: "UPDATE_FIELD", field: "dueDate", value: addDays(state.invoiceDate, t.days) }),
      })),
      ...FIELD_TOGGLES.map((f) => ({
        id: `toggle-${f.key}`,
        group: "Fields",
        label: `${state.options[f.key] ? "Hide" : "Show"} ${f.label}`,
        keywords: `toggle field optional ${f.keywords ?? ""}`,
        hint: state.options[f.key] ? "On" : "Off",
        keepOpen: true,
        run: () => setOptions({ [f.key]: !state.options[f.key] }),
      })),
      ...(
        [
          { id: "standard", label: "Single tax line" },
          { id: "intra", label: "CGST + SGST (same state)" },
          { id: "inter", label: "IGST (other state)" },
        ] as const
      ).map((t) => ({
        id: `tax-${t.id}`,
        group: "Tax",
        label: t.label,
        keywords: "gst tax type",
        hint: taxMode === t.id ? "Current" : undefined,
        run: () => setOptions({ showCGST: t.id === "intra", showSGST: t.id === "intra", showIGST: t.id === "inter" }),
      })),
      ...TEMPLATES.map((t) => ({
        id: `template-${t.id}`,
        group: "Template",
        label: t.name,
        keywords: `template look theme style ${t.description}`,
        hint: state.templateId === t.id ? "Current" : undefined,
        run: () => dispatch({ type: "UPDATE_FIELD", field: "templateId", value: t.id }),
      })),
      ...CURRENCIES.map((c) => ({
        id: `currency-${c.code}`,
        group: "Currency",
        label: `${c.code} · ${c.name}`,
        keywords: `currency money ${c.symbol}`,
        hint: state.currency === c.code ? "Current" : undefined,
        run: () => dispatch({ type: "UPDATE_FIELD", field: "currency", value: c.code }),
      })),
    ]
    return commands
  }, [state, dispatch, canUndo, canRedo, mod, mode, setMode, onExport, onNew])
}
