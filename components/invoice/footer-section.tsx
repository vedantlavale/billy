'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { StampUpload } from "@/components/invoice/stamp-upload"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function FooterSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section className="space-y-6 border-t border-slate-200 pt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Notes
            </p>
            <EditableText
              value={state.notes}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "notes", value })
              }
              placeholder="Add a note or thank you message"
              multiline
              rows={4}
              className="text-sm text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Payment Terms
            </p>
            <EditableText
              value={state.paymentTerms}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "paymentTerms", value })
              }
              placeholder="Payment terms"
              className="text-sm text-slate-600"
            />
          </div>
        </div>
        <div className="flex items-end justify-end">
          <StampUpload
            stampUrl={state.stampUrl}
            onChange={(value) =>
              dispatch({ type: "SET_STAMP", value })
            }
          />
        </div>
      </div>
    </section>
  )
}
