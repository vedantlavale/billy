"use client"

import * as React from "react"

const professions = [
  {
    id: "freelancer",
    title: "Freelancer",
    description: "Designer, developer, writer, photographer, etc.",
  },
  {
    id: "gst_vendor",
    title: "GST Vendor / Business",
    description: "Registered business under GST",
  },
  {
    id: "agency",
    title: "Agency",
    description: "Creative agency, marketing firm, studio",
  },
  {
    id: "consultant",
    title: "Consultant",
    description: "Management, IT, strategy consultant",
  },
  {
    id: "other",
    title: "Other",
    description: "Something else entirely",
  },
]

interface OnboardingModalProps {
  onComplete: (profession: string) => Promise<void>
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [selected, setSelected] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [step, setStep] = React.useState(1)

  const handleSubmit = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await onComplete(selected)
    } finally {
      setSaving(false)
    }
  }

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.9_0.02_260)] text-xl">
              ✦
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              You&apos;re all set!
            </h2>
            <p className="mt-1 text-sm text-[oklch(0.48_0.02_260)]">
              We&apos;ve applied settings for{" "}
              <span className="font-medium text-[oklch(0.18_0.01_265)]">
                {professions.find((p) => p.id === selected)?.title}
              </span>
              . You can change these anytime in Settings.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full rounded-lg bg-[oklch(0.18_0.01_265)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Just a moment..." : "Start invoicing →"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            What best describes you?
          </h2>
          <p className="mt-1 text-sm text-[oklch(0.48_0.02_260)]">
            We&apos;ll tailor your invoice fields accordingly. You can change
            this later.
          </p>
        </div>

        <div className="mb-6 space-y-2">
          {professions.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                selected === p.id
                  ? "border-[oklch(0.35_0.03_255)] bg-[oklch(0.985_0.003_255)] ring-1 ring-[oklch(0.35_0.03_255)]"
                  : "border-[oklch(0.9_0.02_260)] bg-white hover:border-[oklch(0.7_0.02_260)]"
              }`}
            >
              <div className="font-medium text-[oklch(0.18_0.01_265)]">
                {p.title}
              </div>
              <div className="text-sm text-[oklch(0.52_0.02_260)]">
                {p.description}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep(2)}
          disabled={!selected}
          className="w-full rounded-lg bg-[oklch(0.18_0.01_265)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
