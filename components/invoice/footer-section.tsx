'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { StampUpload } from "@/components/invoice/stamp-upload"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function FooterSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section data-break-block className="footer-section space-y-6 border-t border-slate-200 pt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="footer-info space-y-4">
          <div className="footer-item space-y-2">
            <p className="footer-label text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
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
              className="footer-value text-sm text-slate-600"
            />
          </div>
          <div className="footer-item space-y-2">
            <p className="footer-label text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Payment Terms
            </p>
            <EditableText
              value={state.paymentTerms}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "paymentTerms", value })
              }
              placeholder="Payment terms"
              className="footer-value text-sm text-slate-600"
            />
          </div>
          {state.options.showBankDetails && (
            <div className="footer-item space-y-2">
              <p className="footer-label text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Bank Details
              </p>
              <div className="space-y-1.5 text-sm text-slate-600">
                <EditableText
                  value={state.bankName}
                  onCommit={(value) =>
                    dispatch({ type: "UPDATE_FIELD", field: "bankName", value })
                  }
                  placeholder="Bank name"
                  className="text-sm"
                />
                <EditableText
                  value={state.bankAccount}
                  onCommit={(value) =>
                    dispatch({ type: "UPDATE_FIELD", field: "bankAccount", value })
                  }
                  placeholder="Account number"
                  className="text-sm"
                />
                <EditableText
                  value={state.bankIfsc}
                  onCommit={(value) =>
                    dispatch({ type: "UPDATE_FIELD", field: "bankIfsc", value })
                  }
                  placeholder="IFSC code"
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end justify-end gap-4">
          {state.options.showDigitalStamp && (
            <StampUpload
              stampUrl={state.stampUrl}
              onChange={(value) =>
                dispatch({ type: "SET_STAMP", value })
              }
            />
          )}
          {state.options.showReverseCharge && (
            <p className="text-xs font-medium text-slate-500">
              {state.reverseChargeLabel}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
