'use client'

import * as React from "react"
import posthog from "posthog-js"

export interface StampUploadProps {
  stampUrl: string | null
  onChange: (value: string | null) => void
}

export function StampUpload({ stampUrl, onChange }: StampUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        onChange(result)
        posthog.capture("stamp_uploaded")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Stamp / Authorised Signatory
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white/70 text-slate-400 transition hover:border-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
        >
          {stampUrl ? (
            <img
              src={stampUrl}
              alt="Stamp"
              className="h-full w-full object-contain"
            />
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
              <path d="M8 3.5a9 9 0 1 1 7 16.5" />
            </svg>
          )}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/60 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            {stampUrl ? "Change" : "Upload"}
          </span>
        </button>
      </div>
      {stampUrl && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mb-1 text-xs text-slate-400 underline transition hover:text-red-500"
        >
          Remove
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
