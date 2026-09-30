import { SPONSORS, SPONSOR_MAILTO } from "@/lib/sponsors"

/**
 * Sponsors under the signup. Until the first one signs, it's a single
 * invitation; after that, their logos with the invitation beside them. Every
 * "sponsor" action is a mailto, there's no checkout.
 */
export function Sponsors() {
  return (
    <div className="flex flex-col items-center gap-3">
      {SPONSORS.length > 0 && (
        <>
          <p className="text-xs font-semibold tracking-[0.08em] text-[#6b6a65] uppercase">Sponsored by</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {SPONSORS.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer sponsored" className="block opacity-80 transition-opacity hover:opacity-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.logo} alt={s.name} className="h-6 w-auto" />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="text-sm text-[#6b6a65]">
        <a
          href={SPONSOR_MAILTO}
          className="font-semibold text-[#0070d7] underline decoration-[#0070d7]/30 underline-offset-4 transition-colors hover:decoration-[#0070d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070d7]/25"
        >
          {SPONSORS.length > 0 ? "Become a sponsor" : "Be our first sponsor"}
        </a>
      </p>
    </div>
  )
}
