import MaskedHeading from "@/components/MaskedHeading"

export default function ComingSoon() {
  return (
    <main className="flex min-h-dvh flex-col bg-white text-[#37352f]">
      <header className="flex items-center justify-center gap-2.5 pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.svg" alt="" width={32} height={32} />
        <span className="text-[26px] font-extrabold tracking-[-0.04em]">billy</span>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="w-full max-w-6xl">
          <MaskedHeading
            tag="h1"
            text="Launching soon"
            mediaType="video"
            src="/coming-soon/fill.mp4"
            poster="/coming-soon/fill-poster.jpg"
            reveal="rise"
            trigger="view"
            align="center"
            fillScale={1.25}
            parallax={26}
            drift={18}
            brightness={1}
            saturation={1}
            duration={1.1}
            stagger={0.09}
            textScale={0.115}
            weight={700}
            tracking={-0.03}
            lineHeight={1.06}
          />
        </div>
        <p className="mt-6 text-lg text-[#6b6a65] sm:text-xl">A whole new billy is on its way.</p>
      </section>

      <footer className="pb-8 text-center text-sm text-[#6b6a65]">© {new Date().getFullYear()} billy · trybilly.tech</footer>
    </main>
  )
}
