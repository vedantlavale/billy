"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { TEMPLATES, getTemplate } from "@/lib/templates"

export function TemplateSelector() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const current = getTemplate(state.templateId)

  return (
    <Select
      value={state.templateId}
      onValueChange={(value) =>
        dispatch({ type: "UPDATE_FIELD", field: "templateId", value })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: current.colors.accent }}
            />
            <span>{current.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {TEMPLATES.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: template.colors.accent }}
              />
              <span>{template.name}</span>
              {template.pro && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  PRO
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
