import Link from "next/link"

const features = [
  {
    title: "Direct Inline Editing",
    description: "Click any field on the invoice and type. No forms, no dialogs — just edit the document itself.",
  },
  {
    title: "Native PDF Export",
    description: "Export polished, print-ready PDFs using your browser's built-in print. Zero extra dependencies.",
  },
  {
    title: "Logo & Branding",
    description: "Upload your logo and customize your business details. Everything stays on your machine.",
  },
  {
    title: "Line Items & Totals",
    description: "Add, remove, and edit line items freely. Taxes, discounts, and totals calculate in real time.",
  },
]

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight text-slate-800">billy</span>
        <Link
          href="/editor"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Open Editor
        </Link>
      </nav>

      <section className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-12 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
          Lightweight invoice editor
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Edit invoices the way
          <br />
          you edit a document.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-500">
          Billy is a direct-manipulation invoice editor that lives entirely in your browser.
          Click to edit, print to PDF. No sign-up, no servers, no data leaves your machine.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/editor"
            className="rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
          >
            Start Editing
          </Link>
          <Link
            href="/editor"
            className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Try Demo →
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white px-8 py-10 text-left"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
              {feature.title}
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <footer className="mx-auto mt-24 flex w-full max-w-5xl items-center justify-between px-6 py-8 text-xs text-slate-400">
        <span>billy — lightweight invoice editor</span>
        <span>All data stays in your browser.</span>
      </footer>
    </main>
  )
}
