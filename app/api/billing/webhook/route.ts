import { NextResponse } from "next/server"
import { dodo } from "@/lib/dodo"
import { activateProPlan, deactivateProPlan } from "@/lib/billing"

export async function POST(request: Request) {
  const rawBody = await request.text()

  let event: ReturnType<typeof dodo.webhooks.unwrap>
  try {
    event = dodo.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      },
      key: process.env.DODO_WEBHOOK_SECRET,
    })
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "subscription.active":
      case "subscription.renewed": {
        const sub = event.data
        const userId = sub.metadata?.user_id
        if (!userId) {
          console.error("No user_id in subscription metadata for sub:", sub.subscription_id)
          return NextResponse.json({ error: "No user_id in subscription metadata" }, { status: 400 })
        }

        const periodEnd = new Date(sub.next_billing_date)
        // TimeInterval is 'Day' | 'Week' | 'Month' | 'Year' — lowercase for storage
        const planType = sub.payment_frequency_interval.toLowerCase()

        await activateProPlan(userId, sub.subscription_id, sub.product_id, planType, periodEnd)
        break
      }
      case "subscription.cancelled":
      case "subscription.expired": {
        await deactivateProPlan(event.data.subscription_id)
        break
      }
      default:
        console.log("Unhandled billing webhook event:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    )
  }
}
