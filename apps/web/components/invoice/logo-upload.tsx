'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import { MorphingSquare } from "@/components/ui/morphing-square"
import { useReadOnly } from "@/components/invoice/render-mode"
import { uploadInvoiceAsset } from "@/lib/storage"
import posthog from "posthog-js"
import { ImagePlusIcon } from "@/components/icons/rune"

export interface LogoUploadProps {
  logoUrl: string | null
  onChange: (value: string | null) => void
  className?: string
}

export function LogoUpload({ logoUrl, onChange, className }: LogoUploadProps) {
  const readOnly = useReadOnly()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Static preview: show the logo if set, otherwise an empty same-size box so
  // the header layout is unchanged. No dashed border / upload affordance.
  if (readOnly) {
    return (
      <div className={cn("flex items-center", className)}>
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company logo"
              className="h-full w-full object-contain"
            />
          ) : null}
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
      const url = await uploadInvoiceAsset(file, "logo")
      onChange(url)
      posthog.capture("logo_uploaded")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("group flex flex-col gap-1", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-dashed border-[var(--invoice-border)] bg-white/70 text-[var(--invoice-subtle)] transition hover:border-[var(--invoice-subtle)] hover:text-[var(--invoice-muted)] disabled:cursor-not-allowed disabled:opacity-70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070D7]/50"
        )}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Company logo"
            className="h-full w-full object-contain"
          />
        ) : (
          <ImagePlusIcon size={26} />
        )}
        {uploading ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(55,53,47,0.6)]">
            <MorphingSquare className="w-5 h-5 [&>div:last-child]:text-white" />
          </span>
        ) : (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(55,53,47,0.6)] text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            {logoUrl ? "Change" : "Upload"}
          </span>
        )}
      </button>
      {error && <span className="max-w-20 text-[10px] leading-tight text-[#D92D20]">{error}</span>}
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
