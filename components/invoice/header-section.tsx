'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { LogoUpload } from "@/components/invoice/logo-upload"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function HeaderSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
      <div className="flex items-center gap-5">
        <LogoUpload
          logoUrl={state.logoUrl}
          onChange={(value) => dispatch({ type: "SET_LOGO", value })}
        />
        <div className="flex flex-col space-y-2">
          <div>
            <EditableText
              value={state.businessName}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "businessName", value })
              }
              placeholder="Your company"
              className="text-2xl font-semibold text-slate-900"
              displayAs="h1"
            />
          </div>
          <div>
            <EditableText
              value={state.businessTagline}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "businessTagline", value })
              }
              placeholder="Company tagline"
              className="text-sm uppercase tracking-[0.2em] text-slate-500"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3 text-sm text-slate-600 md:text-right">
        <div>
          <EditableText
            value={state.businessAddress}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "businessAddress", value })
            }
            placeholder="Business address"
            multiline
            rows={3}
            className="text-sm text-slate-600"
          />
        </div>
        <div>
          <EditableText
            value={state.businessEmail}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "businessEmail", value })
            }
            placeholder="Email"
            inputType="email"
            className="text-sm text-slate-600"
          />
        </div>
        <div>
          <EditableText
            value={state.businessPhone}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "businessPhone", value })
            }
            placeholder="Phone"
            inputType="tel"
            className="text-sm text-slate-600"
          />
        </div>
      </div>
    </section>
  )
}
