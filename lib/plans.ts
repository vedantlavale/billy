export const PAID_TEMPLATES = ["minimal-teal"]

export const FREE_TEMPLATES = ["clean", "modern-green", "corporate-blue"]

export const FREE_MONTHLY_LIMIT = 5

export interface PlanInfo {
  plan: string
  plan_type: string | null
  plan_expires_at: string | null
  invoice_count: number
  invoice_reset_at: string
}

export function resolveEffectivePlan(profile: PlanInfo): {
  plan: string
  plan_type: string | null
} {
  const now = new Date()

  if (
    profile.plan === "pro" &&
    profile.plan_type === "day" &&
    profile.plan_expires_at &&
    new Date(profile.plan_expires_at) < now
  ) {
    return { plan: "free", plan_type: null }
  }

  return { plan: profile.plan, plan_type: profile.plan_type }
}

export function isTemplateAccessible(
  templateId: string,
  effectivePlan: string,
): boolean {
  if (PAID_TEMPLATES.includes(templateId)) {
    return effectivePlan === "pro"
  }
  return true
}

export function canCreateInvoice(
  profile: PlanInfo,
  effectivePlan: string,
): { allowed: boolean; reason?: string } {
  if (effectivePlan === "pro") {
    return { allowed: true }
  }

  const now = new Date()
  const resetDate = new Date(profile.invoice_reset_at)
  const monthPassed =
    now >
    new Date(resetDate.getFullYear(), resetDate.getMonth() + 1, resetDate.getDate())

  const count = monthPassed ? 0 : profile.invoice_count

  if (count >= FREE_MONTHLY_LIMIT) {
    return {
      allowed: false,
      reason: "limit_reached",
    }
  }

  return { allowed: true }
}

export function hasGstAccess(effectivePlan: string): boolean {
  return effectivePlan === "pro"
}
