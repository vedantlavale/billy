import type { SVGProps } from "react"

type DoodleProps = SVGProps<SVGSVGElement>

function doodleDefaults(props: DoodleProps): DoodleProps {
  return {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  }
}

/* ── Hero doodles ── */

export function DoodleFace(props: DoodleProps) {
  return (
    <svg viewBox="0 0 100 110" {...doodleDefaults(props)}>
      <path d="M30 22 C48 8 78 12 86 36 C93 58 84 86 60 94 C38 101 18 86 16 62 C14 44 20 30 30 22" />
      <path d="M38 16 C44 10 52 12 56 8" />
      <path d="M40 44 C42 42 44 43 45 45" />
      <path d="M62 42 C65 39 69 40 70 44" />
      <path d="M52 50 C50 56 49 60 53 62" />
      <path d="M40 72 C48 80 62 80 70 70" />
    </svg>
  )
}

export function DoodleUnderlineSquiggle(props: DoodleProps) {
  return (
    <svg
      viewBox="0 0 220 24"
      preserveAspectRatio="none"
      {...doodleDefaults({ strokeWidth: 5, ...props })}
    >
      <path d="M5 14 C15 5 25 5 35 14 C45 23 55 23 65 14 C75 5 85 5 95 14 C105 23 115 23 125 14 C135 5 145 5 155 14 C165 23 175 23 185 14 C195 6 205 6 215 12" pathLength={1} />
    </svg>
  )
}

export function DoodleCoin(props: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" {...doodleDefaults(props)}>
      <path d="M30 6 C44 6 54 17 54 30 C54 43 44 54 30 54 C16 54 6 43 6 30 C6 17 16 6 30 6" />
      <path d="M30 16 C38 16 44 22 44 30 C44 38 38 44 30 44 C22 44 16 38 16 30 C16 22 22 16 30 16" strokeDasharray="4 6" />
      <path d="M30 21 L30 39" strokeWidth={3} />
      <path d="M25 26 C25 22 34 22 34 26 C34 30 25 30 25 34 C25 38 34 38 34 34" strokeWidth={3} />
    </svg>
  )
}

export function DoodleSparkles(props: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" {...doodleDefaults(props)}>
      <path d="M20 8 L23 17 L32 20 L23 23 L20 32 L17 23 L8 20 L17 17 Z" />
      <path d="M45 28 L47 34 L53 36 L47 38 L45 44 L43 38 L37 36 L43 34 Z" />
    </svg>
  )
}

export function DoodleArcArrow(props: DoodleProps) {
  return (
    <svg viewBox="0 0 100 60" {...doodleDefaults(props)}>
      <path d="M6 44 C24 6 68 2 92 22" pathLength={1} />
      <path d="M80 16 L92 22 L84 33" pathLength={1} />
    </svg>
  )
}

/* ── Section doodles ── */

export function DoodleStamp(props: DoodleProps) {
  return (
    <svg viewBox="0 0 110 110" {...doodleDefaults(props)}>
      <path d="M55 8 C82 8 102 28 102 55 C102 82 82 103 55 102 C28 101 8 81 9 54 C10 28 29 8 55 8" />
      <path d="M55 21 C74 21 89 36 89 55 C89 74 74 90 55 89 C36 88 21 73 22 54 C23 36 37 21 55 21" strokeDasharray="6 8" />
      <path d="M42 55 C48 62 52 66 55 68 C62 58 70 48 78 42" />
    </svg>
  )
}

export function DoodleSquiggleFlourish(props: DoodleProps) {
  return (
    <svg viewBox="0 0 90 40" {...doodleDefaults(props)}>
      <path d="M6 30 C14 12 22 12 30 24 C38 36 46 36 54 22 C62 10 72 10 84 18" />
    </svg>
  )
}

export function DoodlePaperStack(props: DoodleProps) {
  return (
    <svg viewBox="0 0 120 110" {...doodleDefaults(props)}>
      <path d="M18 66 C46 62 82 62 104 66 C105 76 105 88 104 96 C78 100 44 100 18 96 C17 86 17 74 18 66" />
      <path d="M24 54 C52 50 84 50 102 54" />
      <path d="M30 12 C50 6 74 8 90 16 C88 26 85 35 81 43 C62 48 44 46 28 39 C28 30 29 20 30 12" />
      <path d="M40 22 C50 19 62 19 72 22" />
      <path d="M38 31 C48 28 58 28 68 31" />
      <path d="M10 24 C13 20 16 17 20 14" />
    </svg>
  )
}

export function DoodlePaperPlane(props: DoodleProps) {
  return (
    <svg viewBox="0 0 150 120" {...doodleDefaults(props)}>
      <path d="M132 16 C100 31 69 45 38 60 C48 65 58 70 68 74 C90 55 111 35 132 16" />
      <path d="M132 16 C111 40 90 63 72 88 C70 80 69 77 68 74" />
      <path d="M64 92 C46 106 22 104 16 88 C11 74 24 64 36 70 C44 74 44 84 38 88" strokeDasharray="1 9" strokeWidth={3} />
    </svg>
  )
}

export function DoodlePencilCheck(props: DoodleProps) {
  return (
    <svg viewBox="0 0 130 100" {...doodleDefaults(props)}>
      <path d="M16 54 C28 64 38 74 46 84 C60 60 82 38 104 24" strokeWidth={3.5} />
      <path d="M102 28 L116 14 C118 12 121 12 123 14 C125 16 125 19 123 21 L109 35 C106 36 103 35 102 33 C101 31 101 29 102 28" />
      <path d="M102 28 L96 40 L109 35" />
    </svg>
  )
}

export function DoodleStarBubble(props: DoodleProps) {
  return (
    <svg viewBox="0 0 140 110" {...doodleDefaults(props)}>
      <path d="M20 16 C55 6 105 8 122 20 C134 30 132 58 118 68 C94 78 52 78 30 68 C28 76 20 84 8 88 C13 79 15 72 14 64 C4 52 6 26 20 16" />
      <path d="M46 32 L49 39 L56 40 L51 45 L52 52 L46 48 L40 52 L41 45 L36 40 L43 39 Z" />
      <path d="M72 30 L75 37 L82 38 L77 43 L78 50 L72 46 L66 50 L67 43 L62 38 L69 37 Z" />
      <path d="M98 34 L101 41 L108 42 L103 47 L104 54 L98 50 L92 54 L93 47 L88 42 L95 41 Z" />
    </svg>
  )
}

export function DoodleLandscape(props: DoodleProps) {
  return (
    <svg viewBox="0 0 1000 230" {...doodleDefaults({ strokeWidth: 3, ...props })}>
      <defs>
        <pattern id="lpDots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="currentColor" stroke="none" opacity="0.3" />
        </pattern>
      </defs>
      <path d="M898 14 C918 32 934 50 946 68" stroke="var(--lp-blue)" strokeDasharray="2 9" strokeWidth={5} />
      <path d="M862 26 C880 42 894 58 904 74" stroke="var(--lp-blue)" strokeDasharray="2 9" strokeWidth={5} />
      <path d="M-8 232 L-8 166 C90 108 240 96 380 148 C440 170 500 176 560 162 C680 134 830 108 1008 158 L1008 232 Z" fill="url(#lpDots)" />
      <path d="M-8 232 L-8 206 C140 168 320 170 470 204 C600 232 780 228 1008 186 L1008 232 Z" fill="#FFFFFF" />
      <path d="M228 44 C242 40 255 38 268 36 C271 47 274 57 276 68 C262 72 249 74 236 76 C233 65 230 55 228 44" fill="#FFFFFF" />
      <path d="M240 53 C249 51 258 50 265 49" />
      <path d="M548 26 C560 23 571 22 582 22 C583 32 583 41 582 50 C570 53 559 53 549 51 C548 43 548 34 548 26" fill="#FFFFFF" />
      <path d="M700 84 C712 80 724 78 736 78 C738 89 739 99 738 108 C725 112 713 113 702 111 C700 102 699 93 700 84" fill="#FFFFFF" />
      <path d="M110 128 L116 142 L132 144 L121 155 L124 171 L110 163 L96 171 L99 155 L88 144 L104 142 Z" fill="#FFFFFF" />
      <path d="M430 66 L430 96" stroke="var(--lp-blue)" strokeWidth={4} />
      <path d="M415 81 L445 81" stroke="var(--lp-blue)" strokeWidth={4} />
      <path d="M770 48 L770 68" stroke="var(--lp-blue)" strokeWidth={4} />
      <path d="M760 58 L780 58" stroke="var(--lp-blue)" strokeWidth={4} />
      <path d="M868 88 C876 78 890 78 896 88 C902 98 896 110 884 110 C874 110 862 98 868 88" fill="#FFFFFF" />
      <path d="M884 110 C880 126 874 140 862 152" />
      <path d="M886 114 C900 106 912 94 920 80" />
      <path d="M878 114 C866 106 856 96 850 84" />
      <path d="M862 152 C852 164 840 174 826 180" />
      <path d="M864 150 C870 166 878 178 890 186" />
    </svg>
  )
}

/* ── Small line icons (feature & use-case cards) ── */

function iconDefaults(props: DoodleProps): DoodleProps {
  return {
    width: 24,
    height: 24,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  }
}

export function IconType(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M5 6.5 C9 5.6 15 5.6 19 6.5" />
      <path d="M12 6.5 C12.3 11 12.3 15 12 19.5" />
      <path d="M9.5 19.5 C11 19.2 13 19.2 14.5 19.5" />
    </svg>
  )
}

export function IconDoc(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M7.2 3.5 C9.8 3.2 12.4 3.2 14.6 3.5 L17.9 6.9 C18.2 11.4 18.2 16.3 17.8 20.4 C14.4 20.8 9.7 20.8 7 20.4 C6.6 14.9 6.7 9 7.2 3.5 Z" />
      <path d="M14.5 3.6 L14.6 6.9 L17.8 7" />
      <path d="M9.7 12.5 C11.2 12.3 13.5 12.3 15 12.5" />
      <path d="M9.7 16 C11.1 15.8 13 15.8 14.4 16" />
    </svg>
  )
}

export function IconBrush(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M4.5 19.5 C8 16.5 9.5 16 11.5 13.5 C14 10.5 17 6.5 19.5 4.5 C19.8 8 16.5 12 13.5 14.5 C11 16.5 9 17.5 4.5 19.5 Z" />
    </svg>
  )
}

export function IconCalc(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M5.5 4.5 C9.5 4.2 14.5 4.2 18.5 4.5 C18.8 9.5 18.8 14.5 18.5 19.5 C14.5 19.8 9.5 19.8 5.5 19.5 C5.2 14.5 5.2 9.5 5.5 4.5 Z" />
      <path d="M8.5 8.5 C10.8 8.3 13.2 8.3 15.5 8.5" />
      <path d="M8.5 13 L10 13" />
      <path d="M14 13 L15.5 13" />
      <path d="M8.5 16.5 L10 16.5" />
      <path d="M14 16.5 L15.5 16.5" />
    </svg>
  )
}

export function IconLayers(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M12 4 C14.8 5.2 17.4 6.5 19.5 8 C17.3 9.6 14.7 10.9 12 12 C9.3 10.9 6.7 9.6 4.5 8 C6.6 6.5 9.2 5.2 12 4 Z" />
      <path d="M4.5 12.5 C6.9 14.2 9.4 15.6 12 16.7 C14.6 15.6 17.1 14.2 19.5 12.5" />
    </svg>
  )
}

export function IconCloud(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M7 18.5 C4.8 18.4 3.2 16.8 3.3 14.9 C3.4 13.2 4.6 11.9 6.3 11.6 C6.5 8.7 8.9 6.4 11.9 6.4 C14.5 6.4 16.7 8.1 17.4 10.5 C19.4 10.8 20.8 12.4 20.7 14.4 C20.6 16.6 18.8 18.4 16.5 18.5 C13.3 18.7 10.1 18.7 7 18.5 Z" />
    </svg>
  )
}

export function IconUser(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M12 5 C13.9 5 15.3 6.4 15.3 8.2 C15.3 10 13.9 11.5 12 11.5 C10.1 11.5 8.7 10 8.7 8.2 C8.7 6.4 10.1 5 12 5 Z" />
      <path d="M5 19.5 C6.5 15.8 9 14.5 12 14.5 C15 14.5 17.5 15.8 19 19.5" />
    </svg>
  )
}

export function IconBriefcase(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M4.5 9 C9.5 8.7 14.5 8.7 19.5 9 C19.8 12.5 19.8 16 19.5 19 C14.5 19.3 9.5 19.3 4.5 19 C4.2 16 4.2 12.5 4.5 9 Z" />
      <path d="M9.5 8.8 C9.4 7.2 9.8 6 10.6 5.5 C11.5 5.2 12.5 5.2 13.4 5.5 C14.2 6 14.6 7.2 14.5 8.8" />
      <path d="M4.7 13 C9.6 13.8 14.4 13.8 19.3 13" />
    </svg>
  )
}

export function IconBulb(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M12 4 C15 4 17.2 6.2 17.2 9 C17.2 10.8 16.3 12.2 15.1 13.3 C14.4 14 14.1 14.8 14 16 L10 16 C9.9 14.8 9.6 14 8.9 13.3 C7.7 12.2 6.8 10.8 6.8 9 C6.8 6.2 9 4 12 4 Z" />
      <path d="M10 19 C11.3 19.2 12.7 19.2 14 19" />
    </svg>
  )
}

export function IconStore(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M5.5 9.5 L6.8 4.5 C10.3 4.2 13.7 4.2 17.2 4.5 L18.5 9.5" />
      <path d="M5.5 9.5 C5.3 13 5.3 16.5 5.5 19.5 C9.8 19.8 14.2 19.8 18.5 19.5 C18.7 16.5 18.7 13 18.5 9.5" />
      <path d="M10 19.5 C9.9 17.5 9.9 15.9 10 14 C11.3 13.8 12.7 13.8 14 14 C14.1 15.9 14.1 17.5 14 19.5" />
    </svg>
  )
}

export function IconHammer(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M4.5 19.5 C7 16.5 9.5 14 12 11.7" />
      <path d="M10.5 7.5 C11.8 6 13.2 4.8 14.8 4 C16.7 5 18.4 6.6 19.7 8.5 C18.8 10.1 17.5 11.5 16 12.7 C14 11.2 12.2 9.5 10.5 7.5 Z" />
    </svg>
  )
}

export function IconRocket(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...iconDefaults(props)}>
      <path d="M12 3.5 C14.5 5.3 15.8 8.3 15.2 12 L8.8 12 C8.2 8.3 9.5 5.3 12 3.5 Z" />
      <path d="M8.8 12 C7.3 13.2 6.5 14.8 6.3 16.8 C7.8 16.3 9.2 16 10.5 16" />
      <path d="M15.2 12 C16.7 13.2 17.5 14.8 17.7 16.8 C16.2 16.3 14.8 16 13.5 16" />
      <path d="M10.8 16.3 C10.8 17.8 11.2 19.2 12 20.5 C12.8 19.2 13.2 17.8 13.2 16.3" />
      <path d="M12 7.4 C12.7 7.4 13.2 7.9 13.2 8.6 C13.2 9.3 12.7 9.9 12 9.9 C11.3 9.9 10.8 9.3 10.8 8.6 C10.8 7.9 11.3 7.4 12 7.4 Z" />
    </svg>
  )
}
