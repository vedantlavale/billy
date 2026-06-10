import { createClient } from "./supabase/server"

/**
 * Activates the Pro plan for a user profile and records the subscription details.
 */
export async function activateProPlan(
  userId: string,
  dodoSubscriptionId: string,
  dodoPlanId: string,
  planType: string,
  currentPeriodEnd: Date,
) {
  const supabase = await createClient()

  // 1. Upsert subscription record
  const { error: subError } = await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      dodo_subscription_id: dodoSubscriptionId,
      dodo_plan_id: dodoPlanId,
      plan_type: planType,
      status: "active",
      current_period_end: currentPeriodEnd.toISOString(),
    }, { onConflict: "user_id" })

  if (subError) throw subError

  // 2. Update user profile to 'pro' plan
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      plan_type: planType,
      plan_expires_at: currentPeriodEnd.toISOString(),
    })
    .eq("id", userId)

  if (profileError) throw profileError

  return { success: true }
}

/**
 * Deactivates/cancels the Pro plan, reverting the user profile to free.
 */
export async function deactivateProPlan(dodoSubscriptionId: string) {
  const supabase = await createClient()

  // 1. Fetch user_id associated with this subscription
  const { data: sub, error: fetchError } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("dodo_subscription_id", dodoSubscriptionId)
    .single()

  if (fetchError || !sub) {
    console.error("Subscription record not found for Dodo ID:", dodoSubscriptionId)
    return { success: false, error: "Subscription not found" }
  }

  // 2. Update subscription status in DB
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("dodo_subscription_id", dodoSubscriptionId)

  if (subError) throw subError

  // 3. Revert user profile to free tier
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      plan: "free",
      plan_type: null,
      plan_expires_at: null,
    })
    .eq("id", sub.user_id)

  if (profileError) throw profileError

  return { success: true }
}
