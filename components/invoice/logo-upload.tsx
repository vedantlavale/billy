'use client'

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ImageUpload01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import posthog from "posthog-js"

export interface LogoUploadProps {
  logoUrl: string | null
  onChange: (value: string | null) => void
  className?: string
}

export function LogoUpload({ logoUrl, onChange, className }: LogoUploadProps) {
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
        posthog.capture("logo_uploaded")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={cn("group flex items-center", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white/70 text-slate-400 transition hover:border-slate-400 hover:text-slate-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
        )}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Company logo"
            className="h-full w-full object-contain"
          />
        ) : (
          <HugeiconsIcon icon={ImageUpload01Icon} size={26} />
        )}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/60 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
          {logoUrl ? "Change" : "Upload"}
        </span>
      </button>
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
