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
import { useAuth } from "@/lib/auth-context"
import posthog from "posthog-js"

export function TemplateSelector() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { isAuthenticated } = useAuth()
  const current = getTemplate(state.templateId)

  const handleChange = (value: string) => {
    const template = TEMPLATES.find((t) => t.id === value)
    if (template?.pro && !isAuthenticated) {
      return
    }
    posthog.capture("template_selected", { template_id: value, is_pro: template?.pro ?? false })
    dispatch({ type: "UPDATE_FIELD", field: "templateId", value })
  }

  return (
    <Select
      value={state.templateId}
      onValueChange={handleChange}
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
        {TEMPLATES.map((template) => {
          const isLocked = template.pro && !isAuthenticated

          return (
            <SelectItem
              key={template.id}
              value={template.id}
              disabled={isLocked}
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: template.colors.accent }}
                />
                <span>{template.name}</span>
                {isLocked && (
                  <span className="text-[11px] text-[oklch(0.52_0.02_260)]">
                    🔒
                  </span>
                )}
                {template.pro && isAuthenticated && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    PRO
                  </span>
                )}
                {template.pro && !isAuthenticated && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    PRO
                  </span>
                )}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
