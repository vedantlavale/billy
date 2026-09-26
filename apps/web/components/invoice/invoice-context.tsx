'use client'

import * as React from "react"

import type { InvoiceData, LineItem } from "@billy/invoice-core"
import {
  applyProfessionPreset,
  createDefaultInvoice,
  createLineItem,
  nextInvoiceNumber,
  professionPresets,
  readInvoiceFromHash,
} from "@billy/invoice-core"

import { useToast } from "@/components/ui/toast"

type InvoiceAction =
  | { type: "UPDATE_FIELD"; field: keyof InvoiceData; value: InvoiceData[keyof InvoiceData] }
  | { type: "UPDATE_LINE_ITEM"; id: string; field: keyof LineItem; value: LineItem[keyof LineItem] }
  | { type: "ADD_LINE_ITEM" }
  | { type: "REMOVE_LINE_ITEM"; id: string }
  | { type: "SET_LOGO"; value: string | null }
  | { type: "SET_STAMP"; value: string | null }
  | { type: "RESET_INVOICE" }
  | { type: "SET_ID"; id: string }
  | { type: "LOAD_STATE"; payload: InvoiceData; history?: "reset" }
  | { type: "UNDO" }
  | { type: "REDO" }

const STORAGE_KEY = "billy_invoice_data"

const InvoiceStateContext = React.createContext<InvoiceData | null>(null)
const InvoiceDispatchContext = React.createContext<React.Dispatch<InvoiceAction> | null>(
  null
)

function invoiceReducer(state: InvoiceData, action: InvoiceAction): InvoiceData {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      }
    case "UPDATE_LINE_ITEM":
      return {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === action.id
            ? {
                ...item,
                [action.field]: action.value,
              }
            : item
        ),
      }
    case "ADD_LINE_ITEM": {
      const nextId = `item-${state.lineItems.length + 1}-${Date.now()}`
      return {
        ...state,
        lineItems: [...state.lineItems, createLineItem(nextId)],
      }
    }
    case "REMOVE_LINE_ITEM":
      return {
        ...state,
        lineItems: state.lineItems.filter((item) => item.id !== action.id),
      }
    case "SET_LOGO":
      return {
        ...state,
        logoUrl: action.value,
      }
    case "SET_STAMP":
      return {
        ...state,
        stampUrl: action.value,
      }
    case "RESET_INVOICE":
      return {
        ...createDefaultInvoice(),
        invoiceNumber: nextInvoiceNumber(state.invoiceNumber),
        // Preserve business details and logo on reset
        businessName: state.businessName,
        businessTagline: state.businessTagline,
        businessAddress: state.businessAddress,
        businessEmail: state.businessEmail,
        businessPhone: state.businessPhone,
        logoUrl: state.logoUrl,
        stampUrl: state.stampUrl,
        taxRate: state.taxRate,
        currency: state.currency,
        taxLabel: state.taxLabel,
        options: state.options,
        gstin: state.gstin,
        poNumber: state.poNumber,
        bankName: state.bankName,
        bankAccount: state.bankAccount,
        bankIfsc: state.bankIfsc,
        reverseChargeLabel: state.reverseChargeLabel,
      }
    case "SET_ID":
      return {
        ...state,
        id: action.id,
      }
    case "LOAD_STATE":
      return action.payload
    default:
      return state
  }
}

/* ── Invoices from a link ───────────────────────────────────────────────
   A link carries no images, and an agent may not know the user's business
   details. Fill those gaps from the draft already saved in this browser, but
   never with the sample content a fresh editor starts with. */

const BUSINESS_FIELDS = [
  "businessName",
  "businessTagline",
  "businessAddress",
  "businessEmail",
  "businessPhone",
  "gstin",
  "bankName",
  "bankAccount",
  "bankIfsc",
] as const satisfies readonly (keyof InvoiceData)[]

function withSavedBusiness(linked: InvoiceData, saved: InvoiceData | null): InvoiceData {
  if (!saved) return linked
  const sample = createDefaultInvoice()
  const merged: InvoiceData = {
    ...linked,
    logoUrl: linked.logoUrl ?? saved.logoUrl ?? null,
    stampUrl: linked.stampUrl ?? saved.stampUrl ?? null,
  }
  for (const field of BUSINESS_FIELDS) {
    const kept = saved[field]
    if (!merged[field] && typeof kept === "string" && kept && kept !== sample[field]) merged[field] = kept
  }
  return merged
}

/* ── Undo / redo ────────────────────────────────────────────────────────
   Every committed edit is one history step: EditableText commits on blur,
   so a whole field edit is undone at once, not per keystroke. The initial
   load from localStorage resets history rather than becoming an undo step. */

const HISTORY_LIMIT = 100

interface HistoryState {
  past: InvoiceData[]
  present: InvoiceData
  future: InvoiceData[]
}

function historyReducer(history: HistoryState, action: InvoiceAction): HistoryState {
  const { past, present, future } = history
  switch (action.type) {
    case "UNDO": {
      if (past.length === 0) return history
      return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] }
    }
    case "REDO": {
      if (future.length === 0) return history
      return { past: [...past, present], present: future[0], future: future.slice(1) }
    }
    default: {
      const next = invoiceReducer(present, action)
      if (next === present) return history
      if (action.type === "LOAD_STATE" && action.history === "reset") {
        return { past: [], present: next, future: [] }
      }
      return { past: [...past, present].slice(-HISTORY_LIMIT), present: next, future: [] }
    }
  }
}

interface InvoiceHistory {
  canUndo: boolean
  canRedo: boolean
}

const InvoiceHistoryContext = React.createContext<InvoiceHistory>({ canUndo: false, canRedo: false })

/** Whether undo/redo are available. Dispatch `{ type: "UNDO" | "REDO" }` to use them. */
export function useInvoiceHistory() {
  return React.useContext(InvoiceHistoryContext)
}

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = React.useReducer(historyReducer, undefined, () => ({
    past: [],
    present: createDefaultInvoice(),
    future: [],
  }))
  const state = history.present
  const historyValue = React.useMemo(
    () => ({ canUndo: history.past.length > 0, canRedo: history.future.length > 0 }),
    [history.past.length, history.future.length],
  )

  const { toast } = useToast()
  const stateRef = React.useRef(state)
  React.useLayoutEffect(() => {
    stateRef.current = state
  }, [state])

  // Apply an invoice carried in the link (#i=…) on top of `current`, the
  // draft being replaced. On top of a real draft this is an ordinary edit,
  // so Undo brings the old draft back.
  const importFromHash = React.useCallback(
    (current: InvoiceData | null) => {
      const linked = readInvoiceFromHash(window.location.hash)
      if (!linked) return
      // Drop the hash so a refresh doesn't load the link over later edits.
      window.history.replaceState(null, "", window.location.pathname + window.location.search)

      if (!linked.ok) {
        toast(
          linked.reason === "unsupported"
            ? "This invoice link is from a newer version of Billy. Refresh and try again."
            : "This invoice link is damaged. Ask your assistant for a new one.",
          "error",
        )
        return
      }

      dispatch({
        type: "LOAD_STATE",
        payload: withSavedBusiness(linked.data, current),
        history: current ? undefined : "reset",
      })
      toast(
        current ? "Invoice loaded from your link. Undo brings back your previous draft." : "Invoice loaded from your link.",
        "info",
      )
    },
    [toast],
  )

  // Load the saved draft once on mount, then any invoice in the link. The ref
  // keeps Strict Mode's second mount from loading twice.
  const loadedRef = React.useRef(false)
  React.useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    let saved: InvoiceData | null = null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) saved = JSON.parse(raw) as InvoiceData
    } catch (error) {
      console.error("Failed to load invoice from localStorage:", error)
    }

    if (saved) {
      dispatch({ type: "LOAD_STATE", payload: saved, history: "reset" })
    } else {
      const presetId = localStorage.getItem("billy_profession_preset")
      if (presetId && presetId in professionPresets) {
        const updated = applyProfessionPreset(createDefaultInvoice(), presetId as keyof typeof professionPresets)
        dispatch({ type: "LOAD_STATE", payload: updated, history: "reset" })
        localStorage.removeItem("billy_profession_preset")
      }
    }

    importFromHash(saved)
  }, [importFromHash])

  // A link opened while the editor is already showing only changes the hash.
  React.useEffect(() => {
    const onHashChange = () => importFromHash(stateRef.current)
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [importFromHash])

  // Save state to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error("Failed to save invoice to localStorage:", error)
    }
  }, [state])

  return (
    <InvoiceStateContext.Provider value={state}>
      <InvoiceDispatchContext.Provider value={dispatch}>
        <InvoiceHistoryContext.Provider value={historyValue}>{children}</InvoiceHistoryContext.Provider>
      </InvoiceDispatchContext.Provider>
    </InvoiceStateContext.Provider>
  )
}

/**
 * A read-only, controlled provider that supplies a fixed `InvoiceData` (and a
 * no-op dispatch) to the invoice component tree. Used by the client-side PDF
 * exporter to render an off-screen copy of the SAME `InvoicePage` used on
 * screen — guaranteeing the exported PDF is what-you-see-is-what-you-get.
 */
export function InvoiceStateProvider({
  data,
  children,
}: {
  data: InvoiceData
  children: React.ReactNode
}) {
  const noop = React.useCallback<React.Dispatch<InvoiceAction>>(() => {}, [])
  return (
    <InvoiceStateContext.Provider value={data}>
      <InvoiceDispatchContext.Provider value={noop}>
        {children}
      </InvoiceDispatchContext.Provider>
    </InvoiceStateContext.Provider>
  )
}

export function useInvoiceState() {
  const context = React.useContext(InvoiceStateContext)
  if (!context) {
    throw new Error("useInvoiceState must be used within InvoiceProvider")
  }
  return context
}

export function useInvoiceDispatch() {
  const context = React.useContext(InvoiceDispatchContext)
  if (!context) {
    throw new Error("useInvoiceDispatch must be used within InvoiceProvider")
  }
  return context
}
