import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createWaitlistClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables for waitlist client.\n" +
        "Copy .env.example to .env.local and fill in:\n" +
        "  NEXT_PUBLIC_SUPABASE_URL\n" +
        "  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
