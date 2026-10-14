/**
 * A little Billy for every early bird: the receipt-with-a-face mascot from the
 * brand mark, with a face picked from their number. Same number, same face, so
 * nothing is stored or fetched, and a person with no name still gets one. Blues
 * only, per DESIGN.md.
 */

const TINTS = [
  ["#2F6BFF", "#6FD0FF"],
  ["#2563EB", "#60A5FA"],
  ["#1D4ED8", "#7DB4FF"],
  ["#3C8DFF", "#9AD7FF"],
  ["#0A64D6", "#5AC8FA"],
  ["#3B5BDB", "#74A7FF"],
  ["#1E5BD8", "#4FB3FF"],
  ["#4C6FFF", "#8FCBFF"],
] as const
const TILTS = [-8, -4, 0, 4, 8] as const

const INK = "#2563EB"
const NAVY = "#1E3A8A"
const PAPER = "#EEF4FF"
const LINE = "#B9CFF5"
const CHEEK = "#BFD7FF"
const TONGUE = "#8EC5FF"

const BODIES = [
  // Torn zigzag edge, as in the brand mark.
  "M25 22A7 7 0 0 1 32 15H68A7 7 0 0 1 75 22V84L70 77.5L65 84L60 77.5L55 84L50 77.5L45 84L40 77.5L35 84L30 77.5L25 84Z",
  // Scalloped edge.
  "M25 22A7 7 0 0 1 32 15H68A7 7 0 0 1 75 22V80A5 5 0 0 1 65 80A5 5 0 0 1 55 80A5 5 0 0 1 45 80A5 5 0 0 1 35 80A5 5 0 0 1 25 80Z",
  // A plain ticket.
  "M25 22A7 7 0 0 1 32 15H68A7 7 0 0 1 75 22V77A8 8 0 0 1 67 85H33A8 8 0 0 1 25 77Z",
] as const

// How many choices each part has; their product is how many faces exist.
const N = { eyes: 8, mouth: 8, brows: 3, top: 10, wear: 4, float: 6, cheeks: 2, tint: TINTS.length, tilt: TILTS.length, body: BODIES.length }
const TOTAL = Object.values(N).reduce((a, b) => a * b, 1)

/** Splits a number into face choices. The multiplier has no factor in common with TOTAL, so no two numbers under TOTAL share a face. */
function pick(n: number) {
  let i = (n * 104723 + 977) % TOTAL
  const take = (base: number) => {
    const v = i % base
    i = Math.floor(i / base)
    return v
  }
  return {
    eyes: take(N.eyes),
    mouth: take(N.mouth),
    brows: take(N.brows),
    top: take(N.top),
    wear: take(N.wear),
    float: take(N.float),
    cheeks: take(N.cheeks) === 1,
    tint: take(N.tint),
    tilt: take(N.tilt),
    body: take(N.body),
  }
}

const stroke = (width: number, color = INK) =>
  ({ fill: "none", stroke: color, strokeWidth: width, strokeLinecap: "round", strokeLinejoin: "round" }) as const

/** A four-point sparkle centred on (x, y), r points out. */
const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`

function Eye({ kind, x, right }: { kind: number; x: number; right: boolean }) {
  if (kind === 4) kind = right ? 2 : 1 // wink
  switch (kind) {
    case 0:
      return (
        <>
          <ellipse cx={x} cy="42" rx="5.2" ry="8" fill={INK} />
          <circle cx={x - 1.6} cy="38.6" r="1.7" fill="#fff" />
        </>
      )
    case 2:
      return <path d={`M${x - 5.5} 45Q${x} 36 ${x + 5.5} 45`} {...stroke(3.4)} />
    case 3:
      return <path d={`M${x - 5.5} 41Q${x} 47 ${x + 5.5} 41`} {...stroke(3.4)} />
    case 5:
      return <path d={sparkle(x, 42.5, 7.5)} fill={INK} />
    case 6:
      return (
        <>
          <circle cx={x} cy="43" r="7" fill="#fff" stroke={INK} strokeWidth="2.6" />
          <circle cx={x + 0.8} cy="43.6" r="3.4" fill={INK} />
        </>
      )
    case 7:
      return <path d={`M${x - 5} 43H${x + 5}`} {...stroke(3.6)} />
    default:
      return (
        <>
          <circle cx={x} cy="43" r="5.6" fill={INK} />
          <circle cx={x - 1.6} cy="40.6" r="1.7" fill="#fff" />
        </>
      )
  }
}

function Brows({ kind }: { kind: number }) {
  if (kind === 1) return <path d="M35.5 31.5Q40.5 28 45.5 31.5M54.5 31.5Q59.5 28 64.5 31.5" {...stroke(2.8)} />
  if (kind === 2) return <path d="M35.5 30.5L45.5 33M64.5 30.5L54.5 33" {...stroke(3)} />
  return null
}

function Mouth({ kind }: { kind: number }) {
  switch (kind) {
    case 1:
      return <path d="M43 56H57A7 7 0 0 1 43 56Z" fill={INK} />
    case 2:
      return <ellipse cx="50" cy="59" rx="3" ry="3.6" fill={INK} />
    case 3:
      return <path d="M42 57Q46 62 50 57Q54 62 58 57" {...stroke(3)} />
    case 4:
      return <path d="M46.5 58.5Q50 61.5 53.5 58.5" {...stroke(3)} />
    case 5:
      return (
        <>
          <ellipse cx="53" cy="62" rx="3" ry="3.4" fill={TONGUE} />
          <path d="M44 56Q50 63 56 56" {...stroke(3)} />
        </>
      )
    case 6:
      return (
        <>
          <path d="M42 55H58A8 8 0 0 1 42 55Z" fill={INK} />
          <path d="M45 55H55V57.8H45Z" fill="#fff" />
        </>
      )
    case 7:
      return <path d="M45.5 59H54.5" {...stroke(3)} />
    default:
      return <path d="M44 57Q50 64 56 57" {...stroke(3)} />
  }
}

function Wear({ kind }: { kind: number }) {
  if (kind === 1)
    return (
      <>
        <circle cx="40.5" cy="43" r="8.6" fill="#fff" fillOpacity=".5" stroke={INK} strokeWidth="2.4" />
        <circle cx="59.5" cy="43" r="8.6" fill="#fff" fillOpacity=".5" stroke={INK} strokeWidth="2.4" />
      </>
    )
  if (kind === 2)
    return (
      <>
        <rect x="31.5" y="36" width="17.5" height="14" rx="4" fill="#fff" fillOpacity=".5" stroke={INK} strokeWidth="2.4" />
        <rect x="51" y="36" width="17.5" height="14" rx="4" fill="#fff" fillOpacity=".5" stroke={INK} strokeWidth="2.4" />
      </>
    )
  if (kind === 3)
    return (
      <>
        <rect x="31.5" y="36" width="17.5" height="14" rx="4" fill={NAVY} />
        <rect x="51" y="36" width="17.5" height="14" rx="4" fill={NAVY} />
        <path d="M35 40.5L38.5 40.5M54.5 40.5L58 40.5" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
      </>
    )
  return null
}

function Top({ kind }: { kind: number }) {
  const feather = { ...stroke(3.2, PAPER) }
  switch (kind) {
    case 1:
      return <path d="M50 15Q46 7 53 4" {...feather} />
    case 2:
      return <path d="M46 15Q41 8 46 5M54 15Q59 8 54 5" {...feather} />
    case 3:
      return <path d="M44 15Q40 9 43 6M50 15V4M56 15Q60 9 57 6" {...feather} />
    case 4:
      return (
        <>
          <path d="M38.5 16L50 2L61.5 16Z" fill={PAPER} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="50" cy="2.2" r="2.8" fill={PAPER} />
          <circle cx="50" cy="8" r="1.5" fill={INK} />
          <circle cx="46.2" cy="13" r="1.5" fill={INK} />
          <circle cx="53.8" cy="13" r="1.5" fill={INK} />
        </>
      )
    case 5:
      return <path d="M35 16V6.5L42.5 11.5L50 3L57.5 11.5L65 6.5V16Z" fill={PAPER} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" />
    case 6:
      return (
        <g stroke={PAPER} strokeWidth="1.6" strokeLinejoin="round" fill={NAVY}>
          <path d="M33 17L22.5 10V24Z" />
          <path d="M33 17L43.5 10V24Z" />
          <circle cx="33" cy="17" r="3.2" />
        </g>
      )
    case 7:
      return (
        <>
          <path d="M50 15V9" {...stroke(3, PAPER)} />
          <path d="M50 10Q41 8 40 2Q48 1.5 50 10Z" fill={PAPER} />
          <path d="M50 10Q59 7 61 1Q52.5 0.5 50 10Z" fill={PAPER} />
        </>
      )
    case 8:
      return (
        <>
          <path d="M26 34Q24 6 50 6Q76 6 74 34" {...stroke(3.4, PAPER)} />
          <rect x="19.5" y="27" width="9.5" height="19" rx="4.75" fill={NAVY} stroke={PAPER} strokeWidth="1.8" />
          <rect x="71" y="27" width="9.5" height="19" rx="4.75" fill={NAVY} stroke={PAPER} strokeWidth="1.8" />
        </>
      )
    case 9:
      return (
        <>
          <path d="M30 16Q31 3 50 3Q69 3 70 16Z" fill={NAVY} stroke={PAPER} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M31 11.5H69" {...stroke(2, PAPER)} />
          <circle cx="50" cy="2.5" r="3.2" fill={PAPER} />
        </>
      )
    default:
      return null
  }
}

function Floater({ kind }: { kind: number }) {
  switch (kind) {
    case 1:
      return <path d={sparkle(86, 26, 7)} fill={PAPER} />
    case 2:
      return <path d="M88 38C79 32 80 24 84.5 24C86.5 24 88 25.6 88 27C88 25.6 89.5 24 91.5 24C96 24 97 32 88 38Z" fill={PAPER} />
    case 3:
      return (
        <>
          <ellipse cx="11" cy="36" rx="3.4" ry="2.5" fill={PAPER} transform="rotate(-20 11 36)" />
          <path d="M13.8 35V23L20 25.5" {...stroke(2.4, PAPER)} />
        </>
      )
    case 4:
      return <path d="M86 28Q92 37 86 42Q80 37 86 28Z" fill="#BFE3FF" />
    case 5:
      return (
        <>
          <path d={sparkle(13, 28, 5)} fill={PAPER} />
          <path d={sparkle(87, 22, 7.5)} fill={PAPER} />
        </>
      )
    default:
      return null
  }
}

export function EarlyBirdFace({ number, className }: { number: number; className?: string }) {
  const f = pick(number)
  const [from, to] = TINTS[f.tint]
  return (
    <span className={className} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} aria-hidden>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <Floater kind={f.float} />
        <g transform={`rotate(${TILTS[f.tilt]} 50 56)`}>
          {f.top !== 8 && <Top kind={f.top} />}
          <path fill={PAPER} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" d={BODIES[f.body]} />
          {f.top === 8 && <Top kind={f.top} />}
          {f.cheeks && (
            <>
              <ellipse cx="33.5" cy="54" rx="4.2" ry="2.6" fill={CHEEK} />
              <ellipse cx="66.5" cy="54" rx="4.2" ry="2.6" fill={CHEEK} />
            </>
          )}
          <Eye kind={f.eyes} x={40.5} right={false} />
          <Eye kind={f.eyes} x={59.5} right />
          <Brows kind={f.brows} />
          <Wear kind={f.wear} />
          <Mouth kind={f.mouth} />
          <path d="M38 72H62" stroke={LINE} strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  )
}
