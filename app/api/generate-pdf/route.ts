import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30
import {
  resolveEffectivePlan,
  isTemplateAccessible,
  canCreateInvoice,
  FREE_MONTHLY_LIMIT,
} from "@/lib/plans"
import { getPostHogClient } from "@/lib/posthog-server"
import { checkRateLimit } from "@/lib/rate-limit"

function validateInvoiceData(data: any): boolean {
  if (!data || typeof data !== "object") return false

  const stringFields = [
    "businessName",
    "businessTagline",
    "logoUrl",
    "businessAddress",
    "businessEmail",
    "businessPhone",
    "gstin",
    "clientName",
    "clientAddress",
    "clientEmail",
    "poNumber",
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
    "currency",
    "notes",
    "paymentTerms",
    "bankName",
    "bankAccount",
    "bankIfsc",
    "reverseChargeLabel",
    "stampUrl",
  ]

  for (const field of stringFields) {
    if (data[field] !== undefined && data[field] !== null && typeof data[field] !== "string") {
      return false
    }
  }

  // Safety length limits
  if (data.businessName && data.businessName.length > 200) return false
  if (data.clientName && data.clientName.length > 200) return false
  if (data.invoiceNumber && data.invoiceNumber.length > 50) return false

  // Line Items
  if (data.lineItems !== undefined) {
    if (!Array.isArray(data.lineItems)) return false
    for (const item of data.lineItems) {
      if (typeof item !== "object" || item === null) return false
      if (item.description !== undefined && typeof item.description !== "string") return false
      if (item.hsnCode !== undefined && typeof item.hsnCode !== "string") return false
      if (item.quantity !== undefined && typeof item.quantity !== "number") return false
      if (item.rate !== undefined && typeof item.rate !== "number") return false

      if (item.quantity > 1e9 || item.rate > 1e9) return false
    }
  }

  // Numeric bounds
  const numberFields = ["taxRate", "discountRate"]
  for (const field of numberFields) {
    if (data[field] !== undefined && data[field] !== null) {
      if (typeof data[field] !== "number" || isNaN(data[field]) || data[field] < 0 || data[field] > 1000) {
        return false
      }
    }
  }

  return true
}

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

    // 1. Sliding Window Rate Limiting (max 10 PDF gens per minute per user)
    const rateCheck = checkRateLimit(user.id, 10, 60 * 1000)
    if (rateCheck.limited) {
      return NextResponse.json(
        {
          error: "Too many PDF generation requests. Please wait a minute.",
          code: "rate_limited",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateCheck.resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // 2. Payload size guard (max 2MB payload limit to support Base64 logos/stamps)
    const contentLength = request.headers.get("content-length")
    if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payload too large (max 2MB)", code: "payload_too_large" },
        { status: 413 },
      )
    }

    const bodyText = await request.text()
    if (bodyText.length > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payload too large (max 2MB)", code: "payload_too_large" },
        { status: 413 },
      )
    }

    let parsedBody
    try {
      parsedBody = JSON.parse(bodyText)
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "invalid_json" },
        { status: 400 },
      )
    }

    const { templateId, invoiceData } = parsedBody

    // 3. Structural & Content Validation
    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid templateId", code: "invalid_input" },
        { status: 400 },
      )
    }

    if (!validateInvoiceData(invoiceData)) {
      return NextResponse.json(
        { error: "Invalid invoice data structure or content", code: "invalid_input" },
        { status: 400 },
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

    // 4. Atomic invoice count increment
    await supabase.rpc("increment_invoice_count", {
      target_user_id: user.id,
    })

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: user.id,
      event: "pdf_generated",
      properties: {
        template_id: templateId,
        plan: effective.plan,
        invoice_number: invoiceData?.invoiceNumber,
        currency: invoiceData?.currency,
        line_items_count: invoiceData?.lineItems?.length || 0,
        has_logo: !!invoiceData?.logoUrl,
        has_stamp: !!invoiceData?.stampUrl,
      },
    })

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
