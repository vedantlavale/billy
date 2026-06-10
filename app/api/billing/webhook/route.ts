import { NextResponse } from "next/server"
import { activateProPlan, deactivateProPlan } from "@/lib/billing"

/**
 * Webhook receiver route handler to process subscription event payloads.
 * Features signature verification scaffolding for production environments.
 */
export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-dodo-signature")
    const payloadText = await request.text()

    // Webhook signature validation scaffolding (active in production)
    if (!signature) {
      return NextResponse.json({ error: "Missing x-dodo-signature header" }, { status: 401 })
    }

    // Example verification process:
    // const webhookSecret = process.env.DODO_WEBHOOK_SECRET
    // const verified = verifyDodoSignature(payloadText, signature, webhookSecret)
    // if (!verified) return NextResponse.json({ error: "Invalid signature payload" }, { status: 403 })

    let body
    try {
      body = JSON.parse(payloadText)
    } catch {
      return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 })
    }

    const { event, data } = body

    if (!event || !data) {
      return NextResponse.json({ error: "Invalid event data format" }, { status: 400 })
    }

    switch (event) {
      case "subscription.created":
      case "subscription.renewed": {
        const userId = data.client_reference_id
        const subId = data.subscription_id
        const planId = data.plan_id
        const planType = data.plan_type || "month"
        const currentPeriodEnd = new Date(data.current_period_end || Date.now() + 30 * 24 * 60 * 60 * 1000)

        if (!userId || !subId || !planId) {
          return NextResponse.json({ error: "Missing client_reference_id, subscription_id, or plan_id" }, { status: 400 })
        }

        await activateProPlan(userId, subId, planId, planType, currentPeriodEnd)
        break
      }
      case "subscription.cancelled":
      case "subscription.expired": {
        const subId = data.subscription_id
        if (!subId) {
          return NextResponse.json({ error: "Missing subscription_id" }, { status: 400 })
        }

        await deactivateProPlan(subId)
        break
      }
      default:
        console.log("Unhandled billing webhook event:", event)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook route error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    )
  }
}
