import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isPaywallEnabled } from "@/lib/config"

/**
 * Endpoint to create a billing checkout session.
 * Gated by isPaywallEnabled() configuration.
 */
export async function POST(request: Request) {
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

    // Scaffolding Dodo Payments checkout session redirect
    // const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY
    // const dodoClient = new DodoPayments(dodoApiKey)
    
    const checkoutUrl = `https://test.dodopayments.com/checkout?client_reference_id=${user.id}&email=${encodeURIComponent(user.email || "")}`

    return NextResponse.json({
      url: checkoutUrl,
      message: "Checkout session url successfully generated (scaffold).",
    })
  } catch (error: any) {
    console.error("Checkout route error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    )
  }
}
