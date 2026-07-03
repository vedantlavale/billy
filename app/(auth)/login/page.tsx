"use client"

import { useActionState } from "react"
import Link from "next/link"
import { login, signInWithGoogle } from "@/app/auth/actions"
import posthog from "posthog-js"

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div
      className="flex min-h-dvh flex-col bg-white text-[#0B0B0F] selection:bg-[#0778F2]/15"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-[1.5rem] leading-none text-[#0B0B0F]"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          billy*
        </Link>
        <Link
          href="/signup"
          className="rounded-[9px] bg-[#0778F2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0561CC]"
        >
          Sign up
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-1.5 text-[1.75rem] font-bold tracking-[-0.02em] text-[#0B0B0F]">
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-[#82868F]">
            Sign in to your Billy account
          </p>

          <form action={action} className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#494E57]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-[10px] border border-[#EBEBEE] bg-white px-4 py-2.5 text-sm text-[#0B0B0F] outline-none transition-colors focus:border-[#0778F2] focus:ring-2 focus:ring-[#0778F2]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#494E57]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-[10px] border border-[#EBEBEE] bg-white px-4 py-2.5 text-sm text-[#0B0B0F] outline-none transition-colors focus:border-[#0778F2] focus:ring-2 focus:ring-[#0778F2]/20"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-[10px] bg-[#0778F2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0561CC] disabled:opacity-50"
            >
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EBEBEE]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#82868F]">or</span>
            </div>
          </div>

          <button
            onClick={() => {
              posthog.capture("google_sign_in_initiated", { page: "login" })
              signInWithGoogle()
            }}
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#EBEBEE] bg-white px-4 py-2.5 text-sm font-medium text-[#0B0B0F] transition-colors hover:bg-[#FAFAFB]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-[#82868F]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#0778F2] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
