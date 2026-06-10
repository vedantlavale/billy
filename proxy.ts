import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

const publicPaths = ["/login", "/signup", "/auth/callback"]

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/api/metrics")) {
    return NextResponse.next()
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
    return Response.redirect(new URL("/editor", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/metrics|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
