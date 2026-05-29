import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  resolveEffectivePlan,
  isTemplateAccessible,
  canCreateInvoice,
  FREE_MONTHLY_LIMIT,
} from "@/lib/plans"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to generate PDF", code: "auth_required" },
        { status: 401 },
      )
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, plan_type, plan_expires_at, invoice_count, invoice_reset_at")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 },
      )
    }

    const effective = resolveEffectivePlan(profile)

    if (effective.plan === "free" && profile.plan_type === "day") {
      await supabase
        .from("profiles")
        .update({ plan: "free", plan_type: null, plan_expires_at: null })
        .eq("id", user.id)
    }

    const { templateId, invoiceData } = await request.json()

    if (!isTemplateAccessible(templateId, effective.plan)) {
      return NextResponse.json(
        { error: "Upgrade required for this template", code: "upgrade_required" },
        { status: 403 },
        )
    }

    const invoiceCheck = canCreateInvoice(profile, effective.plan)
    if (!invoiceCheck.allowed) {
      return NextResponse.json(
        {
          error: `Free plan limit of ${FREE_MONTHLY_LIMIT} invoices reached`,
          code: "limit_reached",
        },
        { status: 403 },
        )
    }

    const { generatePdf } = await import("@/lib/pdf/generate")
    const pdf = await generatePdf(invoiceData)

    await supabase.from("invoices").insert({
      user_id: user.id,
      template_id: templateId,
      data: invoiceData,
      status: "draft",
    })

    const newCount = (profile.invoice_count || 0) + 1
    await supabase
      .from("profiles")
      .update({ invoice_count: newCount })
      .eq("id", user.id)

    return new NextResponse(new Blob([pdf as BlobPart], { type: "application/pdf" }), {
      headers: {
        "Content-Disposition": `attachment; filename="invoice.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate PDF",
        code: "generation_failed",
      },
      { status: 500 },
    )
  }
}
