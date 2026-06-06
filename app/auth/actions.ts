"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getPostHogClient } from "@/lib/posthog-server"

export async function signup(
  prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const posthog = getPostHogClient()
    posthog.identify({ distinctId: data.user.id, properties: { email: data.user.email } })
    posthog.capture({ distinctId: data.user.id, event: "user_signed_up", properties: { email: data.user.email, provider: "email" } })
  }

  revalidatePath("/", "layout")
  redirect("/editor")
}

export async function login(
  prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const posthog = getPostHogClient()
    posthog.capture({ distinctId: data.user.id, event: "user_logged_in", properties: { email: data.user.email, provider: "email" } })
  }

  revalidatePath("/", "layout")
  redirect("/editor")
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
