import DodoPayments from "dodopayments"

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
})
