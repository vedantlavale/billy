"use client"

import * as React from "react"

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  profile: any | null
}

const AuthContext = React.createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  profile: null,
})

export function useAuth() {
  return React.useContext(AuthContext)
}

export function AuthProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: AuthState
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
