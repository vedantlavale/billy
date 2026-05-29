import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

const publicPaths = ["/login", "/signup", "/auth/callback"]

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const pathname = request.nextUrl.pathname

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
