import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resolveEffectivePlan, canCreateInvoice } from "@/lib/plans"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Auth required" }, { status: 401 })
    }

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ invoices })
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

      // Increment count
      const newCount = (profile.invoice_count || 0) + 1
      await supabase
        .from("profiles")
        .update({ invoice_count: newCount })
        .eq("id", user.id)

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
