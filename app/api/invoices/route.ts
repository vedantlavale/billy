import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resolveEffectivePlan, canCreateInvoice } from "@/lib/plans"
import { getPostHogClient } from "@/lib/posthog-server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Auth required" }, { status: 401 })
    }

    const id = new URL(request.url).searchParams.get("id")

    // Single-invoice fetch (used by the editor to load /editor?id=<id>)
    if (id) {
      const { data: invoice, error } = await supabase
        .from("invoices")
        .select("id, user_id, template_id, data, status, created_at")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) throw error
      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
      }

      return NextResponse.json({ invoice })
    }

    // Explicit select columns to optimize queries
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("id, user_id, template_id, data, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error

    // Strip the heavy base64 logo/stamp images from the list payload — the
    // dashboard never renders them, and including them bloats the response to
    // multiple MB (slow download for users with many invoices). The full data
    // (with images) is still available via the single-invoice fetch above.
    const slimInvoices = (invoices || []).map((invoice) => {
      const { logoUrl, stampUrl, ...slimData } = invoice.data || {}
      return { ...invoice, data: slimData }
    })

    return NextResponse.json({ invoices: slimInvoices })
  } catch (err: any) {
    console.error("GET invoices error:", err)
    return NextResponse.json({ error: err.message || "Failed to load invoices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Auth required" }, { status: 401 })
    }

    const { invoiceData } = await request.json()
    if (!invoiceData) {
      return NextResponse.json({ error: "Missing invoiceData" }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, plan_type, plan_expires_at, invoice_count, invoice_reset_at")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const effective = resolveEffectivePlan(profile)

    // Check if we are updating an existing invoice
    if (invoiceData.id) {
      const { data, error } = await supabase
        .from("invoices")
        .update({
          data: invoiceData,
          template_id: invoiceData.templateId || "clean",
        })
        .eq("id", invoiceData.id)
        .eq("user_id", user.id)
        .select()

      if (error) throw error

      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: "Invoice not found. It may have been deleted.", code: "invoice_not_found" },
          { status: 404 }
        )
      }

      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: user.id,
        event: "invoice_updated",
        properties: {
          template_id: invoiceData.templateId || "clean",
          plan: effective.plan,
          invoice_number: invoiceData?.invoiceNumber,
        },
      })

      return NextResponse.json({ success: true, invoice: data[0] })
    } else {
      // Create new invoice: Check limits first
      const invoiceCheck = canCreateInvoice(profile, effective.plan)
      if (!invoiceCheck.allowed) {
        return NextResponse.json(
          { error: "Free plan limit reached", code: "limit_reached" },
          { status: 403 }
        )
      }

      const { data, error } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          template_id: invoiceData.templateId || "clean",
          data: invoiceData,
          status: "draft",
        })
        .select()
        .single()

      if (error) throw error

      // Increment count atomically
      await supabase.rpc("increment_invoice_count", {
        target_user_id: user.id,
      })

      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: user.id,
        event: "invoice_created",
        properties: {
          template_id: invoiceData.templateId || "clean",
          plan: effective.plan,
          invoice_number: invoiceData?.invoiceNumber,
        },
      })
      posthog.capture({
        distinctId: user.id,
        event: "invoice_saved",
        properties: {
          template_id: invoiceData.templateId || "clean",
          plan: effective.plan,
          invoice_number: invoiceData?.invoiceNumber,
        },
      })

      return NextResponse.json({ success: true, invoice: data })
    }
  } catch (err: any) {
    console.error("POST invoice error:", err)
    return NextResponse.json({ error: err.message || "Failed to save invoice" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Auth required" }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error: "Permission denied or invoice not found. Please ensure that you have run the delete RLS policy migration in your Supabase SQL Editor.",
          code: "delete_failed",
        },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("DELETE invoice error:", err)
    return NextResponse.json({ error: err.message || "Failed to delete invoice" }, { status: 500 })
  }
}
