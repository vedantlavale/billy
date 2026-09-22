'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { LogoUpload } from "@/components/invoice/logo-upload"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function HeaderSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section data-break-block className="header-section flex flex-col gap-6 border-b border-[var(--invoice-border)] pb-4 md:flex-row md:items-start md:justify-between">
      <div className="header-brand flex items-center gap-5">
        <div className="header-title-container hidden">
          <h1 className="header-title text-4xl font-bold tracking-widest text-[var(--invoice-ink)]">INVOICE</h1>
        </div>
        <LogoUpload
          logoUrl={state.logoUrl}
          onChange={(value) => dispatch({ type: "SET_LOGO", value })}
        />
        <div className="header-company flex flex-col space-y-2">
          <div>
            <EditableText
              value={state.businessName}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "businessName", value })
              }
              placeholder="Your company"
              className="company-name text-2xl font-semibold text-[var(--invoice-ink)]"
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
              className="company-tagline text-sm uppercase tracking-[0.2em] text-[var(--invoice-subtle)]"
            />
          </div>
        </div>
      </div>
      <div className="header-contact flex flex-col space-y-3 text-sm text-[var(--invoice-muted)] md:text-right">
        <div>
          <EditableText
            value={state.businessAddress}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "businessAddress", value })
            }
            placeholder="Business address"
            multiline
            rows={3}
            className="text-sm text-[var(--invoice-muted)]"
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
            className="text-sm text-[var(--invoice-muted)]"
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
            className="text-sm text-[var(--invoice-muted)]"
          />
        </div>
        {state.options.showGSTIN && (
          <div>
            <EditableText
              value={state.gstin}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "gstin", value })
              }
              placeholder="GSTIN"
              className="text-sm text-[var(--invoice-muted)]"
            />
          </div>
        )}
      </div>
    </section>
  )
}
