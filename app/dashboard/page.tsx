"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { calculateTotals, formatCurrency } from "@/lib/invoice"
import { signOut } from "@/app/auth/actions"
import type { InvoiceData } from "@/lib/types"
import { useToast } from "@/components/ui/toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { MorphingSquare } from "@/components/ui/morphing-square"
import {
  UserDropdown,
  type UserDropdownAction,
} from "@/components/ui/user-dropdown"
import posthog from "posthog-js"

interface DatabaseInvoice {
  id: string
  user_id: string
  template_id: string
  data: InvoiceData
  status: string
  created_at: string
}

interface Profile {
  plan?: string | null
  invoice_count?: number | null
}

function getUserDisplayName(user: User) {
  return (
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    (typeof user.user_metadata?.name === "string" ? user.user_metadata.name : null) ||
    user.email?.split("@")[0] ||
    "Billy user"
  )
}

function getUserInitials(name: string, email?: string) {
  const source = name || email || ""
  const parts = source.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.trim().charAt(0).toUpperCase() || "?"
}

function getUserAvatar(user: User) {
  const avatarUrl = user.user_metadata?.avatar_url
  const picture = user.user_metadata?.picture

  return (
    (typeof avatarUrl === "string" ? avatarUrl : null) ||
    (typeof picture === "string" ? picture : null)
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [session, setSession] = React.useState<Session | null>(null)
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [invoices, setInvoices] = React.useState<DatabaseInvoice[]>([])
  const [loading, setLoading] = React.useState(true)
  const [signingOut, setSigningOut] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = React.useState<{ id: string; number: string } | null>(null)

  // Filters & Search State
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("newest")

  // Action states
  const [actionInProgress, setActionInProgress] = React.useState<string | null>(null) // Tracks row ID currently performing an async action (e.g. PDF generation, duplicate, delete)

  const supabase = React.useMemo(() => createClient(), [])

  const fetchUserData = React.useCallback(
    async (userId: string) => {
      try {
        // Fetch Profile
        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single()

        if (profileErr) throw profileErr
        setProfile(profileData)

        // Fetch invoices via the API, which strips the heavy base64 logo/stamp
        // images the list view never renders (keeps the payload small/fast).
        const invoiceRes = await fetch("/api/invoices")
        if (!invoiceRes.ok) throw new Error("Failed to load invoices")
        const { invoices: invoiceData } = await invoiceRes.json()
        setInvoices(invoiceData || [])
      } catch (err) {
        console.error("Error loading dashboard data:", err)
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login")
        return
      }
      setSession(session)
      fetchUserData(session.user.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login")
      } else {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, fetchUserData])

  const handleUserDropdownAction = async (action: UserDropdownAction) => {
    if (action === "dashboard") {
      return
    }

    if (action === "upgrade") {
      try {
        const response = await fetch("/api/billing/checkout", {
          method: "POST",
        })
        const data = await response.json()

        if (!response.ok || !data.url) {
          toast(data.error || "Unable to start checkout.", "error")
          return
        }

        window.location.assign(data.url)
      } catch {
        toast("Unable to start checkout.", "error")
      }
      return
    }

    if (action === "logout") {
      setSigningOut(true)
      await signOut()
    }
  }

  const handleDelete = (invoiceId: string, invoiceNumber: string) => {
    setInvoiceToDelete({ id: invoiceId, number: invoiceNumber })
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return
    const { id, number } = invoiceToDelete

    setActionInProgress(id)
    try {
      const response = await fetch(`/api/invoices?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        posthog.capture("invoice_deleted", { invoice_id: id, invoice_number: number })
        setInvoices((prev) => prev.filter((inv) => inv.id !== id))
        toast(`Invoice ${number} deleted.`, "info")

        // Clear id from localStorage if it matches the deleted invoice to prevent accidental resurrection/update
        try {
          const saved = localStorage.getItem("billy_invoice_data")
          if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed && parsed.id === id) {
              delete parsed.id
              localStorage.setItem("billy_invoice_data", JSON.stringify(parsed))
            }
          }
        } catch (e) {
          console.error("Failed to clean up localStorage on delete:", e)
        }
      } else {
        const err = await response.json()
        toast(err.error || "Failed to delete invoice", "error")
      }
    } catch (err) {
      console.error("Delete error:", err)
      toast("An error occurred while deleting the invoice.", "error")
    } finally {
      setActionInProgress(null)
      setInvoiceToDelete(null)
    }
  }

  const handleDuplicate = async (invoice: DatabaseInvoice) => {
    setActionInProgress(invoice.id)
    try {
      // The list payload omits logo/stamp images, so fetch the full invoice to
      // carry them into the copy.
      const fullRes = await fetch(`/api/invoices?id=${invoice.id}`)
      if (!fullRes.ok) throw new Error("Failed to load invoice")
      const { invoice: fullInvoice } = await fullRes.json()

      // Create a copy of the invoice data without the ID, and modify the number
      const duplicatedData: InvoiceData = {
        ...fullInvoice.data,
        invoiceNumber: `${fullInvoice.data.invoiceNumber || "INV"}-COPY`,
        invoiceDate: new Date().toISOString().slice(0, 10),
      }
      delete duplicatedData.id

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceData: duplicatedData }),
      })

      if (response.ok) {
        const { invoice: newInvoice } = await response.json()
        posthog.capture("invoice_duplicated", {
          source_invoice_id: invoice.id,
          source_invoice_number: invoice.data.invoiceNumber,
        })
        setInvoices((prev) => [newInvoice, ...prev])
        toast("Invoice duplicated successfully!", "success")
        // Refresh profile to update invoice count
        if (session?.user?.id) {
          fetchUserData(session.user.id)
        }
      } else {
        const err = await response.json()
        toast(err.error || "Failed to duplicate invoice", "error")
      }
    } catch (err) {
      console.error("Duplicate error:", err)
      toast("An error occurred while duplicating.", "error")
    } finally {
      setActionInProgress(null)
    }
  }

  const handleDownloadPdf = async (invoice: DatabaseInvoice) => {
    setActionInProgress(invoice.id)
    try {
      // The list payload omits logo/stamp images, so fetch the full invoice so
      // the rendered PDF includes them.
      const fullRes = await fetch(`/api/invoices?id=${invoice.id}`)
      if (!fullRes.ok) throw new Error("Failed to load invoice")
      const { invoice: fullInvoice } = await fullRes.json()

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: fullInvoice.template_id || "clean",
          invoiceData: fullInvoice.data,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoice-${invoice.data.invoiceNumber || "export"}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast("PDF downloaded successfully!", "success")
      } else {
        const err = await response.json()
        toast(err.error || "Failed to generate PDF", "error")
      }
    } catch (err) {
      console.error("PDF download error:", err)
      toast("An error occurred during PDF generation.", "error")
    } finally {
      setActionInProgress(null)
    }
  }

  const toggleStatus = async (invoice: DatabaseInvoice) => {
    // Cycles status: draft -> sent -> paid -> draft
    const statusCycle: Record<string, string> = {
      draft: "sent",
      sent: "paid",
      paid: "draft",
    }
    const nextStatus = statusCycle[invoice.status] || "draft"

    posthog.capture("invoice_status_updated", {
      invoice_id: invoice.id,
      invoice_number: invoice.data.invoiceNumber,
      previous_status: invoice.status,
      new_status: nextStatus,
    })
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, status: nextStatus } : inv))
    )

    try {
      await supabase
        .from("invoices")
        .update({ status: nextStatus })
        .eq("id", invoice.id)
    } catch (err) {
      console.error("Error updating status:", err)
      // Revert if error
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoice.id ? { ...inv, status: invoice.status } : inv))
      )
    }
  }

  const handleEdit = (invoice: DatabaseInvoice) => {
    // The editor refetches the full invoice (incl. logo/stamp) by id, so we
    // don't seed localStorage here — the list data omits those heavy images.
    router.push(`/editor?id=${invoice.id}`)
  }

  // Derived Totals Grouped by Currency
  const currencyTotals = React.useMemo(() => {
    const totals: Record<string, number> = {}
    invoices.forEach((inv) => {
      const currency = inv.data.currency || "INR"
      const invoiceTotals = calculateTotals(inv.data)
      totals[currency] = (totals[currency] || 0) + invoiceTotals.total
    })
    return totals
  }, [invoices])

  // Filtered & Sorted Invoices
  const filteredAndSortedInvoices = React.useMemo(() => {
    let result = [...invoices]

    // Search
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(
        (inv) =>
          inv.data.invoiceNumber?.toLowerCase().includes(query) ||
          inv.data.clientName?.toLowerCase().includes(query) ||
          inv.data.businessName?.toLowerCase().includes(query)
      )
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else if (sortBy === "amount_high") {
        return calculateTotals(b.data).total - calculateTotals(a.data).total
      } else if (sortBy === "amount_low") {
        return calculateTotals(a.data).total - calculateTotals(b.data).total
      }
      return 0
    })

    return result
  }, [invoices, search, statusFilter, sortBy])

  if (loading) {
    return (
      <div
        className="flex min-h-dvh flex-col items-center justify-center bg-[#FAFAF7]"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <MorphingSquare message="Loading your dashboard..." className="w-8 h-8" />
      </div>
    )
  }

  const freeInvoicesUsed = profile?.invoice_count || 0
  const freeLimit = 5
  const limitPercent = Math.min((freeInvoicesUsed / freeLimit) * 100, 100)
  const displayName = session?.user ? getUserDisplayName(session.user) : ""

  return (
    <main
      className="flex min-h-dvh flex-col bg-[#FAFAF7] text-[#0E1117] selection:bg-[#E4F2F2] selection:text-[#0D7377]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-[#E4E4DC] bg-[#FAFAF7]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className="text-xl font-normal italic text-[#0E1117]"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              billy
            </span>
            <span className="hidden rounded-full bg-[#E4F2F2] px-2.5 py-0.5 text-xs font-semibold text-[#0D7377] sm:inline-block">
              {profile?.plan === "pro" ? "Pro Plan" : "Free Plan"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/editor"
              className="rounded-md border border-[#E4E4DC] bg-white px-3.5 py-1.5 text-xs font-medium text-[#3A3F4B] transition-colors hover:border-[#0E1117] hover:text-[#0E1117]"
            >
              Open Editor
            </Link>
            <span className="h-4 w-px bg-[#E4E4DC]" />
            {session?.user && (
              <UserDropdown
                user={{
                  name: displayName,
                  email: session.user.email || "",
                  avatar: getUserAvatar(session.user),
                  initials: getUserInitials(displayName, session.user.email),
                }}
                signingOut={signingOut}
                onAction={handleUserDropdownAction}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-6xl flex-grow px-6 py-8">
        {/* Welcome and Summary Cards */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0E1117]">Invoices</h1>
            <p className="text-sm text-[#7C8090]">Manage your generated documents and track invoices.</p>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center justify-center gap-1 rounded-full bg-[#0D7377] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#0D7377]/95"
          >
            Create new invoice →
          </Link>
        </div>

        {/* Overview Stats Bento */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Total Invoiced */}
          <div className="rounded-xl border border-[#E4E4DC] bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold tracking-widest text-[#7C8090] uppercase">Total Invoiced</span>
            <div className="mt-2 space-y-1">
              {Object.keys(currencyTotals).length > 0 ? (
                Object.entries(currencyTotals).map(([currency, total]) => (
                  <div key={currency} className="text-2xl font-bold tracking-tight text-[#0E1117]">
                    {formatCurrency(total, currency)}
                  </div>
                ))
              ) : (
                <div className="text-2xl font-bold tracking-tight text-[#0E1117]">$0.00</div>
              )}
            </div>
          </div>

          {/* Card 2: Count */}
          <div className="rounded-xl border border-[#E4E4DC] bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold tracking-widest text-[#7C8090] uppercase">Invoices Created</span>
            <div className="mt-2 text-3xl font-bold tracking-tight text-[#0E1117]">{invoices.length}</div>
            <p className="mt-1 text-xs text-[#7C8090]">Total drafts and sent invoices saved.</p>
          </div>

          {/* Card 3: Free Plan limits */}
          <div className="rounded-xl border border-[#E4E4DC] bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-[#7C8090] uppercase">Monthly Usage</span>
              <span className="text-xs font-semibold text-[#0D7377]">
                {profile?.plan === "pro" ? "Unlimited" : `${freeInvoicesUsed} / ${freeLimit}`}
              </span>
            </div>
            {profile?.plan !== "pro" ? (
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-[#E4E4DC] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0D7377] transition-all duration-500"
                    style={{ width: `${limitPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[#7C8090]">
                  Free plan resets monthly. {freeLimit - freeInvoicesUsed} creation(s) remaining.
                </p>
              </div>
            ) : (
              <div className="mt-3">
                <div className="inline-flex rounded-full bg-[#E4F2F2] px-2.5 py-0.5 text-xs font-medium text-[#0D7377]">
                  Active Pro features
                </div>
                <p className="mt-2 text-xs text-[#7C8090]">Enjoy unlimited invoice saves and premium templates.</p>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar: Search, Filters, Sort */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[#E4E4DC] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#7C8090]">
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by client or invoice #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E4E4DC] bg-[#FAFAF7]/50 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[#0E1117] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#7C8090]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-[#E4E4DC] bg-white px-2.5 py-1.5 text-xs font-medium outline-none transition-colors hover:border-[#0E1117]"
              >
                <option value="all">All Invoices</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#7C8090]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-[#E4E4DC] bg-white px-2.5 py-1.5 text-xs font-medium outline-none transition-colors hover:border-[#0E1117]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount: High to Low</option>
                <option value="amount_low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoice List Content */}
        {filteredAndSortedInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E4DC] bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#E4F2F2] text-[#0D7377]">
              <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0E1117]">No invoices found</h3>
            <p className="mt-1 max-w-sm text-sm text-[#7C8090]">
              {search.trim() || statusFilter !== "all"
                ? "No invoices match your active filters. Try resetting search or select dropdowns."
                : "Get started by creating your first professional invoice. It will show up here."}
            </p>
            <div className="mt-6">
              {search.trim() || statusFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearch("")
                    setStatusFilter("all")
                    setSortBy("newest")
                  }}
                  className="rounded-full border border-[#E4E4DC] bg-[#FAFAF7] px-4 py-2 text-xs font-semibold text-[#3A3F4B] transition-colors hover:border-[#0E1117] hover:text-[#0E1117]"
                >
                  Clear all filters
                </button>
              ) : (
                <Link
                  href="/editor"
                  className="inline-flex rounded-full bg-[#0E1117] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:opacity-95"
                >
                  Create Invoice
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E4E4DC] bg-white shadow-sm">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="border-b border-[#E4E4DC] bg-[#FAFAF7]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-[#7C8090]">Invoice #</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-[#7C8090]">Client</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-[#7C8090]">Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-[#7C8090]">Amount</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-[#7C8090]">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-[#7C8090] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4DC]">
                {filteredAndSortedInvoices.map((invoice) => {
                  const totals = calculateTotals(invoice.data)
                  const currency = invoice.data.currency || "INR"
                  const isBusy = actionInProgress === invoice.id

                  return (
                    <tr key={invoice.id} className="transition-colors hover:bg-[#FAFAF7]/40">
                      {/* Invoice Number */}
                      <td className="px-6 py-4 font-semibold text-[#0E1117]">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="hover:underline text-left outline-none font-medium hover:text-[#0D7377]"
                        >
                          {invoice.data.invoiceNumber || "INV-UNTITLED"}
                        </button>
                      </td>

                      {/* Client Name */}
                      <td className="px-6 py-4 text-[#3A3F4B]">
                        {invoice.data.clientName || <span className="italic text-[#7C8090]">No client</span>}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-[#3A3F4B]">
                        {invoice.data.invoiceDate ? (
                          new Date(invoice.data.invoiceDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-semibold text-[#0E1117]">
                        {formatCurrency(totals.total, currency)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(invoice)}
                          disabled={isBusy}
                          className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none transition-colors duration-150 outline-none hover:opacity-85 ${
                            invoice.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : invoice.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          title="Click to toggle status"
                        >
                          <span className="mr-1.5 size-1.5 rounded-full bg-current" />
                          <span className="capitalize">{invoice.status}</span>
                        </button>
                      </td>

                      {/* Actions Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(invoice)}
                            disabled={isBusy}
                            className="rounded p-1.5 text-[#3A3F4B] transition-colors hover:bg-[#FAFAF7] hover:text-[#0E1117] disabled:opacity-50"
                            title="Edit Invoice"
                          >
                            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* PDF Download */}
                          <button
                            onClick={() => handleDownloadPdf(invoice)}
                            disabled={isBusy}
                            className="rounded p-1.5 text-[#3A3F4B] transition-colors hover:bg-[#FAFAF7] hover:text-[#0D7377] disabled:opacity-50"
                            title="Download PDF"
                          >
                            {isBusy ? (
                              <MorphingSquare className="size-4" />
                            ) : (
                              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(invoice)}
                            disabled={isBusy}
                            className="rounded p-1.5 text-[#3A3F4B] transition-colors hover:bg-[#FAFAF7] hover:text-[#0D7377] disabled:opacity-50"
                            title="Duplicate Invoice"
                          >
                            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(invoice.id, invoice.data.invoiceNumber || "INV-Untitled")}
                            disabled={isBusy}
                            className="rounded p-1.5 text-[#7C8090] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Delete Invoice"
                          >
                            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E4E4DC] bg-white py-8 text-center">
        <span
          className="text-md italic text-[#0E1117]"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          billy
        </span>
        <p className="mt-2 text-xs text-[#7C8090]">
          © 2026 · Invoice Management Dashboard · All data belongs to you.
        </p>
      </footer>
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setInvoiceToDelete(null)
        }}
        onConfirm={confirmDeleteInvoice}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${invoiceToDelete?.number || "INV-Untitled"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </main>
  )
}
