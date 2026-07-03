import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isPaywallEnabled } from "@/lib/config"
import { dodo } from "@/lib/dodo"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!isPaywallEnabled()) {
      return NextResponse.json({
        url: "/editor",
        message: "Paywall is currently disabled during alpha. Enjoy unlimited access!",
      })
    }

    const productId = process.env.DODO_PRODUCT_ID
    if (!productId) {
      console.error("DODO_PRODUCT_ID env var is not set")
      return NextResponse.json({ error: "Payment product not configured" }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: user.email!,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email!,
      },
      // user_id is echoed back on subscription.metadata so the webhook can identify the user
      metadata: { user_id: user.id },
      return_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/dashboard`,
    })

    if (!session.checkout_url) {
      return NextResponse.json({ error: "No checkout URL returned from Dodo" }, { status: 500 })
    }

    return NextResponse.json({ url: session.checkout_url })
  } catch (error: any) {
    console.error("Checkout route error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    )
  }
}
