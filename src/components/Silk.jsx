/*
 * Deep emerald silk: soft blurred folds of light over a near-black vignette.
 * Static SVG (rendered once), so it costs nothing while scrolling.
 */
export default function Silk({ id = 'silk', className = '' }) {
  const f = (n) => `${id}-${n}`
  const waves = [
    'M-100 300 C300 120 620 520 1000 380 S1500 160 1750 260',
    'M-100 700 C350 520 720 900 1100 720 S1500 560 1750 640',
    'M-100 90 C220 -30 520 230 900 130 S1400 -10 1750 50',
    'M-100 940 C300 810 650 1040 1050 900 S1500 790 1750 870',
  ]
  return (
    <svg className={className} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={f('base')} cx="50%" cy="45%" r="78%">
          <stop offset="0" stopColor="#0e5c43" />
          <stop offset="0.42" stopColor="#06382a" />
          <stop offset="0.8" stopColor="#021710" />
          <stop offset="1" stopColor="#010906" />
        </radialGradient>
        <linearGradient id={f('hi')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1fa77c" stopOpacity="0" />
          <stop offset="0.35" stopColor="#28b98a" stopOpacity="0.55" />
          <stop offset="0.65" stopColor="#35cf9c" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1fa77c" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={f('vig')} cx="50%" cy="50%" r="72%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
        <filter id={f('bl')} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="45" />
        </filter>
        <filter id={f('bs')} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${f('base')})`} />
      {/* broad folds of colour */}
      <g filter={`url(#${f('bl')})`} fill="none" stroke="#0f7051" strokeOpacity="0.5">
        <path d={waves[0]} strokeWidth="170" />
        <path d={waves[1]} strokeWidth="210" strokeOpacity="0.38" />
      </g>
      {/* shadows under the folds */}
      <g filter={`url(#${f('bs')})`} fill="none" stroke="#000" strokeOpacity="0.4" transform="translate(0 55)">
        {waves.map((d) => (
          <path key={d} d={d} strokeWidth="50" />
        ))}
      </g>
      {/* sheen along the crests */}
      <g filter={`url(#${f('bs')})`} fill="none" stroke={`url(#${f('hi')})`}>
        <path d={waves[0]} strokeWidth="28" />
        <path d={waves[1]} strokeWidth="36" />
        <path d={waves[2]} strokeWidth="18" />
        <path d={waves[3]} strokeWidth="22" />
      </g>
      <rect width="1600" height="1000" fill={`url(#${f('vig')})`} />
    </svg>
  )
}
