"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { OnboardingModal } from "@/components/onboarding/OnboardingModal"
import { professionPresets } from "@/lib/presets"
import { AuthProvider } from "@/lib/auth-context"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [session, setSession] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [profile, setProfile] = React.useState<any>(null)

  React.useEffect(() => {
    let supabase: ReturnType<typeof createClient>

    try {
      supabase = createClient()
    } catch {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
          })
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleOnboardingComplete = async (profession: string) => {
    let supabase: ReturnType<typeof createClient>

    try {
      supabase = createClient()
    } catch {
      return
    }

    await supabase
      .from("profiles")
      .update({
        profession,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", session?.user?.id)

    if (profession in professionPresets) {
      localStorage.setItem("billy_profession_preset", profession)
    }

    setProfile((prev: any) => ({
      ...prev,
      profession,
      onboarding_completed: true,
    }))
  }

  const isAuthenticated = !!session?.user
  const showOnboarding =
    isAuthenticated && profile && !profile.onboarding_completed

  if (loading) return <>{children}</>

  return (
    <AuthProvider value={{ isAuthenticated, user: session?.user, profile }}>
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      {children}
    </AuthProvider>
  )
}
