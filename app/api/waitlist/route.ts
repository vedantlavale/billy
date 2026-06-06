import { NextResponse } from "next/server"
import { createWaitlistClient } from "@/lib/supabase/waitlist"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_BODY_BYTES = 4096

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0)
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const email =
      typeof body === "object" && body !== null && "email" in body
        ? String((body as { email: unknown }).email ?? "").trim().toLowerCase()
        : ""

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 })
    }

    const supabase = createWaitlistClient()
    const { error } = await supabase.from("waitlist").insert({ email })

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, alreadyOnList: true })
      }
      console.error("Waitlist insert error:", error)
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, alreadyOnList: false })
  } catch (err) {
    console.error("Waitlist route error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
