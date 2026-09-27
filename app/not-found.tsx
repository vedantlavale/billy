import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center text-[#37352f]">
      <h1 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl">Nothing here yet.</h1>
      <p className="text-lg text-[#6b6a65]">A whole new billy is on its way.</p>
      <Link href="/" className="rounded-[7px] bg-[#0070d7] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#005fb8]">
        Back home
      </Link>
    </main>
  )
}
