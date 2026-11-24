/*
 * SVG florals for the reception theme: blush, ivory and dusty-blue roses,
 * sage leaves, gold sprigs and pearls. Render <FloralDefs /> once inside the
 * <svg> that uses them.
 *
 * Each piece is placed by an outer <g> and animated through an inner <g>
 * (classes `rxa-*`), so GSAP's scale never overwrites the placement scale.
 */

const ROSE_PALETTES = {
  blush: { light: '#fbe3e6', mid: '#efb4bf', deep: '#d58a9b', core: '#b9677c' },
  pink: { light: '#f7d0d6', mid: '#e59aaa', deep: '#c9748a', core: '#a85570' },
  ivory: { light: '#fffaf2', mid: '#f3e5d2', deep: '#e0c8a9', core: '#c6a37e' },
  sage: { light: '#e3f0ec', mid: '#b7d2cb', deep: '#8db1a8', core: '#6c9289' },
}

export function FloralDefs() {
  return (
    <defs>
      <linearGradient id="rx-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f8e8b6" />
        <stop offset="0.3" stopColor="#d8b05c" />
        <stop offset="0.55" stopColor="#b5873a" />
        <stop offset="0.78" stopColor="#f0d590" />
        <stop offset="1" stopColor="#a7772c" />
      </linearGradient>
      <radialGradient id="rx-pearl" cx="0.36" cy="0.3" r="0.72">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#f7f2e8" />
        <stop offset="1" stopColor="#cfc4b2" />
      </radialGradient>
      <linearGradient id="rx-leaf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7e9f97" />
        <stop offset="1" stopColor="#b8d0c9" />
      </linearGradient>
      <linearGradient id="rx-leaf-dark" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#557a70" />
        <stop offset="1" stopColor="#8fb0a7" />
      </linearGradient>
      {Object.entries(ROSE_PALETTES).map(([k, p]) => (
        <g key={k}>
          {/* petal: darker at its base, light at the rim (rotates with the petal) */}
          <linearGradient id={`rx-petal-${k}`} x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0" stopColor={p.deep} />
            <stop offset="0.55" stopColor={p.mid} />
            <stop offset="1" stopColor={p.light} />
          </linearGradient>
          <radialGradient id={`rx-bloom-${k}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={p.core} />
            <stop offset="0.55" stopColor={p.deep} />
            <stop offset="1" stopColor={p.mid} />
          </radialGradient>
        </g>
      ))}
    </defs>
  )
}

// A petal pointing up from just below the centre to the rim (unit radius).
const PETAL = 'M0 -0.12 C-0.78 -0.16 -0.8 -1.06 0 -1.03 C0.8 -1.06 0.78 -0.16 0 -0.12 Z'
const CUP = 'M-0.42 0.05 C-0.46 -0.42 0.46 -0.42 0.42 0.05 C0.2 -0.1 -0.2 -0.1 -0.42 0.05 Z'

export function Rose({ x, y, r, tone = 'blush', rot = 0 }) {
  const p = ROSE_PALETTES[tone]
  const ring = (n, scale, offset, key) =>
    Array.from({ length: n }, (_, i) => (
      <path
        key={`${key}${i}`}
        d={PETAL}
        transform={`rotate(${offset + (360 / n) * i}) scale(${scale})`}
        fill={`url(#rx-petal-${tone})`}
        stroke={p.deep}
        strokeOpacity="0.35"
        strokeWidth={0.02 / scale}
      />
    ))
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      <g className="rxa-rose">
        <circle r="0.98" fill={`url(#rx-bloom-${tone})`} />
        {ring(6, 1, 0, 'o')}
        {ring(5, 0.78, 30, 'm')}
        {ring(5, 0.56, 64, 'i')}
        {/* cupped heart of the rose */}
        <path d={CUP} transform="translate(0 0.06) scale(0.9)" fill={p.mid} stroke={p.deep} strokeWidth="0.025" />
        <path d={CUP} transform="translate(0 -0.02) rotate(180) scale(0.62)" fill={p.light} stroke={p.deep} strokeWidth="0.03" />
        <path d={CUP} transform="translate(0 0.02) scale(0.36)" fill={p.mid} stroke={p.deep} strokeWidth="0.06" />
        <path d="M-0.1 -0.02 C-0.06 -0.1 0.07 -0.1 0.1 -0.03" fill="none" stroke={p.core} strokeOpacity="0.7" strokeWidth="0.03" strokeLinecap="round" />
        {/* soft light on the upper petals */}
        <path d="M-0.62 -0.5 C-0.4 -0.85 0.25 -0.92 0.55 -0.62" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.05" strokeLinecap="round" />
      </g>
    </g>
  )
}

export function Leaf({ x, y, s = 30, rot = 0, dark = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <g className="rxa-leaf">
        <path d="M0 0 C0.3 -0.28 0.85 -0.26 1.2 0 C0.85 0.26 0.3 0.28 0 0 Z" fill={`url(#${dark ? 'rx-leaf-dark' : 'rx-leaf'})`} />
        <path d="M0.02 0 C0.4 -0.02 0.8 -0.01 1.12 0" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.025" />
      </g>
    </g>
  )
}

// Gold sprig of baby's breath / crystal beads on a fine stem.
const BEADS = [
  [18, -10, 2.6],
  [30, -22, 2.2],
  [44, -30, 2.8],
  [56, -44, 2],
  [26, -2, 1.8],
  [40, -14, 2.2],
  [62, -30, 2.4],
  [70, -48, 1.8],
]
export function Sprig({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <g className="rxa-sprig">
        <path d="M0 0 C20 -6 40 -20 72 -52 M24 -6 C34 -6 44 -12 62 -30 M14 -4 C20 -14 26 -20 30 -22" fill="none" stroke="#c9a24f" strokeWidth="1" strokeLinecap="round" />
        {BEADS.map(([bx, by, br], i) => (
          <circle key={i} cx={bx} cy={by} r={br} fill={i % 3 === 0 ? 'url(#rx-pearl)' : 'url(#rx-gold)'} />
        ))}
      </g>
    </g>
  )
}

export function Pearl({ x, y, r = 7 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="rxa-pearl">
        <circle r={r + 2.2} fill="url(#rx-gold)" />
        <circle r={r} fill="url(#rx-pearl)" />
        <circle cx={-r * 0.32} cy={-r * 0.36} r={r * 0.28} fill="#fff" opacity="0.9" />
      </g>
    </g>
  )
}
