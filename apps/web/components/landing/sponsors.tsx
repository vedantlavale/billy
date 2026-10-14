import { DoodleSparkles } from "@/components/landing/doodles"
import { Reveal } from "@/components/landing/reveal"
import { SPONSORS, SPONSOR_EMAIL, SPONSOR_MAILTO } from "@/lib/sponsors"

/**
 * The ask for sponsors. Until the first one signs it is a single invitation;
 * after that their logos sit above it. The button is a mailto.
 */
export function Sponsors() {
  const hasSponsors = SPONSORS.length > 0
  return (
    <section className="lx-sponsors" id="sponsors" aria-labelledby="sponsors-title">
      <Reveal className="lx-sponsors-card">
        <DoodleSparkles className="lx-doodle lx-sponsors-doodle" />
        <p className="lx-kicker">Sponsors</p>
        <h2 className="lx-h2" id="sponsors-title">
          Help keep billy free
        </h2>
        <p className="lx-body">
          billy is free and open source. If it saves you or your team time, sponsoring helps keep it going.
        </p>

        {hasSponsors && (
          <ul className="lx-sponsors-logos" aria-label="Current sponsors">
            {SPONSORS.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer sponsored">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.logo} alt={s.name} height={28} />
                </a>
              </li>
            ))}
          </ul>
        )}

        <a className="lx-btn lx-btn-ghost lx-btn-lg" href={SPONSOR_MAILTO}>
          {hasSponsors ? "Become a sponsor" : "Be our first sponsor"}
        </a>
        <p className="lx-sponsors-note">Opens an email to {SPONSOR_EMAIL}.</p>
      </Reveal>
    </section>
  )
}
