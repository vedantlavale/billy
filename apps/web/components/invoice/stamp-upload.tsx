'use client'

import * as React from "react"
import posthog from "posthog-js"

import { useReadOnly } from "@/components/invoice/render-mode"
import { MorphingSquare } from "@/components/ui/morphing-square"
import { uploadInvoiceAsset } from "@/lib/storage"
import { ShieldCheckIcon } from "@/components/icons/rune"

export interface StampUploadProps {
  stampUrl: string | null
  onChange: (value: string | null) => void
}

export function StampUpload({ stampUrl, onChange }: StampUploadProps) {
  const readOnly = useReadOnly()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Static preview: render the stamp label + image only (no upload box / remove
  // control). If no stamp is set there's nothing to show.
  if (readOnly) {
    if (!stampUrl) return null
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
          Stamp / Authorised Signatory
        </p>
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg">
          <img src={stampUrl} alt="Stamp" className="h-full w-full object-contain" />
        </div>
      </div>
    )
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Allow re-selecting the same file after an error/replace.
    event.target.value = ""
    if (!file) {
      return
    }

    setError(null)
    setUploading(true)
    try {
      const url = await uploadInvoiceAsset(file, "stamp")
      onChange(url)
      posthog.capture("stamp_uploaded")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
          Stamp / Authorised Signatory
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-[var(--invoice-border)] bg-white/70 text-[var(--invoice-subtle)] transition hover:border-[var(--invoice-subtle)] hover:text-[var(--invoice-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070D7]/50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {stampUrl ? (
            <img
              src={stampUrl}
              alt="Stamp"
              className="h-full w-full object-contain"
            />
          ) : (
            <ShieldCheckIcon size={28} strokeWidth={1.5} />
          )}
          {uploading ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(55,53,47,0.6)]">
              <MorphingSquare className="w-5 h-5 [&>div:last-child]:text-white" />
            </span>
          ) : (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(55,53,47,0.6)] text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              {stampUrl ? "Change" : "Upload"}
            </span>
          )}
        </button>
        {error && <p className="max-w-24 text-[10px] leading-tight text-[#D92D20]">{error}</p>}
      </div>
      {stampUrl && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mb-1 text-xs text-[var(--invoice-subtle)] underline transition hover:text-[#D92D20]"
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
