'use client'

import * as React from "react"

import type { InvoiceData, LineItem } from "@/lib/types"

type InvoiceAction =
  | { type: "UPDATE_FIELD"; field: keyof InvoiceData; value: InvoiceData[keyof InvoiceData] }
  | { type: "UPDATE_LINE_ITEM"; id: string; field: keyof LineItem; value: LineItem[keyof LineItem] }
  | { type: "ADD_LINE_ITEM" }
  | { type: "REMOVE_LINE_ITEM"; id: string }
  | { type: "SET_LOGO"; value: string | null }
  | { type: "SET_STAMP"; value: string | null }
  | { type: "RESET_INVOICE" }
  | { type: "LOAD_STATE"; payload: InvoiceData }

const STORAGE_KEY = "billy_invoice_data"

function createDefaultInvoice(): InvoiceData {
  const today = new Date()
  const inSevenDays = new Date(today)
  inSevenDays.setDate(today.getDate() + 7)

  return {
    businessName: "Your Company",
    businessTagline: "Design & Product Studio",
    logoUrl: null,
    businessAddress: "123 Market Street\nSan Francisco, CA 94103",
    businessEmail: "hello@yourcompany.com",
    businessPhone: "+1 (555) 555-5555",
    clientName: "Acme Corp",
    clientAddress: "456 Mission Avenue\nSan Francisco, CA 94105",
    clientEmail: "finance@acme.com",
    invoiceNumber: "INV-1024",
    invoiceDate: today.toISOString().slice(0, 10),
    dueDate: inSevenDays.toISOString().slice(0, 10),
    lineItems: [
      {
        id: "item-1",
        description: "Website redesign",
        quantity: 1,
        rate: 1200,
      },
      {
        id: "item-2",
        description: "Brand guidelines",
        quantity: 1,
        rate: 650,
      },
    ],
    taxRate: 8.25,
    discountRate: 0,
    currency: "INR",
    templateId: "clean",
    stampUrl: null,
    notes: "Thank you for your business. Please reach out if you have any questions.",
    paymentTerms: "Payment due within 7 days via bank transfer or card.",
  }
}

const InvoiceStateContext = React.createContext<InvoiceData | null>(null)
const InvoiceDispatchContext = React.createContext<React.Dispatch<InvoiceAction> | null>(
  null
)

function createLineItem(id: string): LineItem {
  return {
    id,
    description: "New line item",
    quantity: 1,
    rate: 0,
  }
}

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
      }
    case "LOAD_STATE":
      return action.payload
    default:
      return state
  }
}

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(
    invoiceReducer,
    undefined,
    createDefaultInvoice
  )

  // Load state from localStorage on initial mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as InvoiceData
        dispatch({ type: "LOAD_STATE", payload: parsed })
      }
    } catch (error) {
      console.error("Failed to load invoice from localStorage:", error)
    }
  }, [])

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
