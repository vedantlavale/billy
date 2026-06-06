import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"
import { isWaitlistMode } from "@/lib/config"

const publicPaths = ["/login", "/signup", "/auth/callback"]

function isPathAllowedDuringWaitlist(pathname: string): boolean {
  if (pathname === "/") return true
  if (pathname.startsWith("/api/waitlist")) return true
  return false
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (isWaitlistMode() && !isPathAllowedDuringWaitlist(pathname)) {
    return Response.redirect(new URL("/", request.url))
  }

  const { supabaseResponse, user } = await updateSession(request)

  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  const isDashboard = pathname.startsWith("/dashboard")

  if (isDashboard && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return Response.redirect(loginUrl)
  }

  if (isPublic && user) {
    const target = isWaitlistMode() ? "/" : "/editor"
    return Response.redirect(new URL(target, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
