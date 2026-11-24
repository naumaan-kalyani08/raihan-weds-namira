import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Silk from './Silk'
import './envelope.css'

/* ---------------- Wax seal ---------------- */

// Jagged crack line (seal units, 0–120) — the two halves are clipped along it.
const CRACK = 'M64.8 0 L57.6 33.6 L67.2 62.4 L57.6 91.2 L63.6 120'

function SealArt({ id }) {
  const g = (n) => `${n}-${id}`
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id={g('wax')} cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#e0c27e" />
          <stop offset="0.3" stopColor="#b08a45" />
          <stop offset="0.7" stopColor="#7a5a28" />
          <stop offset="1" stopColor="#3e2c12" />
        </radialGradient>
        <radialGradient id={g('disc')} cx="58%" cy="62%" r="70%">
          <stop offset="0" stopColor="#8a6930" />
          <stop offset="0.7" stopColor="#6b4f22" />
          <stop offset="1" stopColor="#3a2a10" />
        </radialGradient>
        <linearGradient id={g('gold')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#fff3c8" />
          <stop offset="0.45" stopColor="#e4c178" />
          <stop offset="1" stopColor="#a17b35" />
        </linearGradient>
      </defs>
      {/* wax blob with uneven, poured edge */}
      <path
        fill={`url(#${g('wax')})`}
        d="M61 3c8 0 12 4 18 5 7 1 13 0 17 6 4 5 2 11 6 16 4 6 11 9 11 17 0 7-6 10-6 17 0 8 6 13 3 20-3 7-11 6-16 11-5 4-6 12-13 15-7 3-13-2-20-1-8 1-13 8-21 6-7-2-8-10-14-14-6-5-15-5-18-12-3-7 3-13 3-20 0-8-6-12-5-20 1-7 9-9 12-15 4-6 2-14 8-18 6-5 13-1 20-4 7-3 10-9 15-9z"
      />
      {/* soft highlight on the rim */}
      <path d="M24 34c6-12 18-21 33-23" fill="none" stroke="#fbe7b2" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
      {/* pressed disc */}
      <circle cx="60" cy="60" r="38" fill={`url(#${g('disc')})`} />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#2a1c08" strokeOpacity="0.55" strokeWidth="2.5" />
      <path d="M33 83a38 38 0 0 0 54 0" fill="none" stroke="#f0d593" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* beaded ring */}
      <circle
        cx="60"
        cy="60"
        r="32"
        fill="none"
        stroke={`url(#${g('gold')})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="0.1 4.2"
      />
      {/* embossed monogram: dark offset, light offset, gold face */}
      <g className="seal-mono" textAnchor="middle">
        <text x="41.5" y="72.6" fill="#2a1c08" opacity="0.6">R</text>
        <text x="78.5" y="72.6" fill="#2a1c08" opacity="0.6">N</text>
        <text x="40.9" y="71" fill="#fff6d6" opacity="0.5">R</text>
        <text x="77.9" y="71" fill="#fff6d6" opacity="0.5">N</text>
        <text x="41.5" y="71.6" fill={`url(#${g('gold')})`}>R</text>
        <text x="78.5" y="71.6" fill={`url(#${g('gold')})`}>N</text>
      </g>
      <rect x="59.3" y="46" width="1.4" height="30" rx="0.7" fill={`url(#${g('gold')})`} />
      <path d="M60 36l2.4 2.4-2.4 2.4-2.4-2.4z M60 81l2.4 2.4-2.4 2.4-2.4-2.4z" fill={`url(#${g('gold')})`} />
    </svg>
  )
}

/* ---------------- Paper parts ---------------- */

function PaperDefs() {
  return (
    <svg className="env-defs" aria-hidden="true">
      <defs>
        <linearGradient id="pp-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fbf6e9" />
          <stop offset="1" stopColor="#efe3c7" />
        </linearGradient>
        <linearGradient id="pp-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6eedb" />
          <stop offset="1" stopColor="#e9dbb9" />
        </linearGradient>
        <linearGradient id="pp-bot" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#efe4ca" />
          <stop offset="1" stopColor="#e1cfa8" />
        </linearGradient>
        <linearGradient id="pp-flap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2e7cd" />
          <stop offset="0.55" stopColor="#faf4e5" />
          <stop offset="1" stopColor="#f4ebd6" />
        </linearGradient>
        <linearGradient id="pp-lining" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--lining-1, #3d4a2f)' }} />
          <stop offset="0.6" style={{ stopColor: 'var(--lining-2, #27311e)' }} />
          <stop offset="1" style={{ stopColor: 'var(--lining-3, #151b11)' }} />
        </linearGradient>
        <linearGradient id="pp-foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc9c" />
          <stop offset="0.35" stopColor="#c9a256" />
          <stop offset="0.6" stopColor="#f0d690" />
          <stop offset="1" stopColor="#a17b35" />
        </linearGradient>
        {/* blind-embossed damask on the paper */}
        <pattern id="pp-emboss" width="44" height="44" patternUnits="userSpaceOnUse">
          <g fill="none" strokeWidth="1">
            <path d="M22 6 L38 22 L22 38 L6 22 Z M22 14 C26 18 26 26 22 30 C18 26 18 18 22 14" stroke="#fff" strokeOpacity="0.55" />
            <path d="M22 7 L37 22 L22 37 L7 22 Z M22 15 C26 19 26 27 22 31 C18 27 18 19 22 15" stroke="#a88a52" strokeOpacity="0.16" />
          </g>
        </pattern>
        <pattern id="pp-damask" width="40" height="40" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#c9a65e" strokeOpacity="0.22" strokeWidth="1">
            <path d="M20 4 C26 12 26 16 20 20 C14 16 14 12 20 4 M20 36 C14 28 14 24 20 20 C26 24 26 28 20 36 M4 20 C12 14 16 14 20 20 C16 26 12 26 4 20 M36 20 C28 26 24 26 20 20 C24 14 28 14 36 20" />
            <circle cx="20" cy="20" r="2" />
          </g>
        </pattern>
        <filter id="pp-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.33  0 0 0 0 0.18  0 0 0 0.5 -0.12" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="pp-fold" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1.5" dy="0" stdDeviation="3" floodColor="#5b4520" floodOpacity="0.28" />
        </filter>
        <filter id="pp-foldv" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="-1.5" stdDeviation="3" floodColor="#5b4520" floodOpacity="0.25" />
        </filter>
      </defs>
    </svg>
  )
}

const Corner = ({ t }) => (
  <g transform={t} fill="none" stroke="url(#pp-foil)" strokeWidth="1.1">
    <path d="M0 22 V0 H22" />
    <path d="M6 22 V6 H22" strokeWidth="0.7" />
    <path d="M6 6 C14 8 16 12 16 18 M6 6 C8 14 12 16 18 16" strokeWidth="0.8" />
    <circle cx="20" cy="20" r="1.6" fill="url(#pp-foil)" stroke="none" />
  </g>
)

// Front pocket: three folds meeting at (372,200); the right-hand V is the opening.
function FrontArt() {
  const left = '0,0 372,200 0,400'
  const top = '0,0 600,0 372,200'
  const bot = '0,400 600,400 372,200'
  const shape = '0,0 600,0 372,200 600,400 0,400'
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={bot} fill="url(#pp-bot)" />
      <polygon points={top} fill="url(#pp-top)" filter="url(#pp-foldv)" />
      <polygon points={left} fill="url(#pp-left)" filter="url(#pp-fold)" />
      <polygon points={shape} fill="url(#pp-emboss)" />
      <polygon points={shape} fill="#fff" filter="url(#pp-grain)" opacity="0.55" />
      {/* gold foil border */}
      <rect x="13" y="13" width="574" height="374" fill="none" stroke="url(#pp-foil)" strokeWidth="1.6" />
      <rect x="20" y="20" width="560" height="360" fill="none" stroke="url(#pp-foil)" strokeWidth="0.7" />
      <Corner t="translate(26 26)" />
      <Corner t="translate(26 374) scale(1 -1)" />
      {/* faint crease highlight along the fold edges */}
      <path d="M0 0 L372 200 L0 400" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" />
    </svg>
  )
}

function FlapArt({ back }) {
  const tri = '336,0 336,400 0,200'
  return (
    <svg viewBox="0 0 336 400" preserveAspectRatio="none" aria-hidden="true">
      {back ? (
        <>
          <polygon points={tri} fill="url(#pp-lining)" />
          <polygon points={tri} fill="url(#pp-damask)" />
          <polyline points="336,8 16,200 336,392" fill="none" stroke="url(#pp-foil)" strokeWidth="1.4" />
        </>
      ) : (
        <>
          <polygon points={tri} fill="url(#pp-flap)" />
          <polygon points={tri} fill="url(#pp-emboss)" />
          <polygon points={tri} fill="#fff" filter="url(#pp-grain)" opacity="0.55" />
          <polyline points="336,0 0,200 336,400" fill="none" stroke="url(#pp-foil)" strokeWidth="2.2" />
          <polyline points="334,14 26,200 334,386" fill="none" stroke="url(#pp-foil)" strokeWidth="0.9" />
          <polyline
            points="334,28 52,200 334,372"
            fill="none"
            stroke="#b8924a"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="0.1 7"
          />
        </>
      )}
    </svg>
  )
}

/* ---------------- Envelope ---------------- */

export default function Envelope({
  groom,
  bride,
  dateLabel,
  guest,
  onReveal,
  onOpened,
  title = 'Dawat-e-Walima',
  joiner = 'with',
  bismillah = true,
  className = '',
  silk,
}) {
  const root = useRef(null)
  const busy = useRef(false)

  useGSAP(
    () => {
      gsap.from('.env-stage', { y: 60, opacity: 0, rotationX: 25, duration: 1.6, ease: 'power3.out', delay: 0.15 })
      gsap.from('.env-anim', { y: 18, opacity: 0, duration: 1, stagger: 0.15, ease: 'power2.out', delay: 0.7 })
      gsap.fromTo(
        '.env-seal-glow',
        { scale: 0.85, opacity: 0.7 },
        { scale: 1.35, opacity: 0, duration: 2.2, repeat: -1, ease: 'sine.out' },
      )
      gsap.to('.env-float', { y: -8, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.intro-silk', { scale: 1.08, xPercent: -2, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.utils.toArray('.env-sparkle').forEach((el) => {
        gsap.set(el, {
          left: `${gsap.utils.random(0, 100)}%`,
          top: `${gsap.utils.random(0, 100)}%`,
          scale: gsap.utils.random(0.4, 1.1),
          opacity: 0,
        })
        gsap.to(el, {
          y: gsap.utils.random(-70, -25),
          opacity: gsap.utils.random(0.35, 0.85),
          duration: gsap.utils.random(2.5, 5),
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 3),
          ease: 'sine.inOut',
        })
      })
    },
    { scope: root },
  )

  const open = () => {
    if (busy.current) return
    busy.current = true
    const q = gsap.utils.selector(root.current)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onReveal?.()
      gsap.to(root.current, { opacity: 0, duration: 0.6, onComplete: onOpened })
      return
    }

    const stage = q('.env-stage')[0]
    const flap = q('.env-flap')[0]
    const W = stage.offsetWidth
    const H = stage.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Envelope + card side by side are ~1.9 envelopes wide: fit that pair on screen.
    const pairFit = Math.min(1, (vw * 0.94) / (W * 1.92))
    const cardFit = Math.min((vw * 0.92) / (W * 0.9), (vh * 0.78) / (H * 0.9), 1.6)

    gsap.killTweensOf(q('.env-float'))
    const tl = gsap.timeline({ onComplete: onOpened })

    // 1. Seal is pressed, cracks along its seam, and the halves fall away
    tl.to(q('.env-anim'), { opacity: 0, y: 12, duration: 0.4, stagger: 0.05 }, 0)
      .to(q('.env-float'), { y: 0, duration: 0.4 }, 0)
      .set(q('.env-seal-glow'), { display: 'none' }, 0)
      .to(q('.env-seal'), { scale: 0.92, duration: 0.15, ease: 'power2.in' }, 0)
      .to(q('.env-seal'), { scale: 1.04, duration: 0.25, ease: 'back.out(3)' }, 0.15)
      .set(q('.seal-crack'), { opacity: 1 }, 0.28)
      .fromTo(q('.seal-crack path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, ease: 'power1.in' }, 0.28)
      .set(q('.seal-whole, .seal-crack'), { opacity: 0 }, 0.56)
      .set(q('.seal-half'), { opacity: 1 }, 0.56)
      .to(q('.seal-half--l'), { x: -30, y: 90, rotation: -35, opacity: 0, duration: 0.9, ease: 'power2.in' }, 0.58)
      .to(q('.seal-half--r'), { x: 30, y: 110, rotation: 30, opacity: 0, duration: 0.9, ease: 'power2.in' }, 0.62)

      // 2. Flap swings open from left to right, hinged on the right edge
      .to(
        flap,
        {
          rotationY: 180,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate() {
            flap.classList.toggle('is-back', gsap.getProperty(flap, 'rotationY') > 90)
          },
        },
        0.85,
      )
      .set(flap, { zIndex: 1 })

      // 3. Card slides out to the right while the pair re-centres
      .addLabel('slide', 2.2)
      .to(stage, { x: -0.46 * W * pairFit, scale: pairFit, duration: 1.2, ease: 'power2.inOut' }, 'slide')
      .to(q('.env-card'), { xPercent: 108, rotationY: -14, duration: 1.2, ease: 'power2.inOut' }, 'slide')

      // 4. Card comes forward over the envelope, which drops away
      .addLabel('forward', '>-0.05')
      .set(q('.env-card'), { zIndex: 10 }, 'forward')
      .to(q('.env-card'), { xPercent: 0, rotationY: 0, duration: 1.3, ease: 'power3.inOut' }, 'forward')
      .to(stage, { x: 0, scale: cardFit, duration: 1.3, ease: 'power3.inOut' }, 'forward')
      .to(q('.env-body, .env-flap'), { y: H * 0.9, rotationX: -30, opacity: 0, duration: 1, ease: 'power2.in' }, 'forward+=0.15')
      // light sweeps right across the card: starts fully off the left edge, ends fully off the right
      .set(q('.env-card-shine'), { xPercent: -130, opacity: 1 }, 'forward+=0.9')
      .to(q('.env-card-shine'), { xPercent: 130, duration: 1.2, ease: 'power2.inOut' }, 'forward+=0.9')

      // 5. Hold, then the card zooms past the viewer into the page
      .addLabel('out', '+=1.1')
      .call(() => onReveal?.(), null, 'out')
      .to(q('.env-card'), { scale: 2.4, rotationX: 8, opacity: 0, duration: 1.1, ease: 'power2.in' }, 'out')
      .to(root.current, { opacity: 0, duration: 0.9, ease: 'power1.in' }, 'out+=0.35')
  }

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  return (
    <div className={`intro ${className}`} ref={root}>
      <Silk id="intro-silk" className="intro-silk" palette={silk} />
      <div className="intro-damask" aria-hidden="true" />
      <div className="intro-sparkles" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <span key={i} className="env-sparkle" />
        ))}
      </div>
      <PaperDefs />

      {bismillah && <p className="arabic arabic--sm env-anim intro-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>}
      <p className="intro-to env-anim">{guest ? `Invitees: ${guest}` : 'You are cordially invited'}</p>

      <div className="env-float">
        <div
          className="env-stage"
          role="button"
          tabIndex={0}
          aria-label={`Open the invitation — ${groom} ${joiner === '&' ? 'and' : joiner} ${bride}`}
          onClick={open}
          onKeyDown={onKey}
        >
          {/* inside of the envelope: green damask lining */}
          <div className="env-body env-back" />

          {/* the invitation card */}
          <div className="env-card">
            <div className="env-card-inner">
              {bismillah && <p className="ec-arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>}
              <p className="ec-mono">
                R<i />N
              </p>
              <p className="ec-title">{title}</p>
              <p className="ec-names">
                {groom}
                <span>{joiner}</span>
                {bride}
              </p>
              <p className="ec-date">{dateLabel}</p>
            </div>
            <span className="env-card-shine" aria-hidden="true" />
          </div>

          {/* front pocket */}
          <div className="env-body env-front-wrap">
            <div className="env-front">
              <FrontArt />
              <div className="env-front-mark">
                <small>{title}</small>
                <span>{groom}</span>
                <em>&amp;</em>
                <span>{bride}</span>
              </div>
            </div>
          </div>

          {/* side flap, hinged on the right */}
          <div className="env-flap">
            <div className="flap-face flap-face--front">
              <FlapArt />
            </div>
            <div className="flap-face flap-face--back">
              <FlapArt back />
            </div>
          </div>

          {/* wax seal on the flap tip */}
          <div className="env-seal">
            <span className="env-seal-glow" />
            <span className="seal-whole">
              <SealArt id="w" />
            </span>
            <span className="seal-half seal-half--l">
              <SealArt id="l" />
            </span>
            <span className="seal-half seal-half--r">
              <SealArt id="r" />
            </span>
            <svg className="seal-crack" viewBox="0 0 120 120" aria-hidden="true">
              <path d={CRACK} pathLength="1" />
            </svg>
          </div>
        </div>
      </div>

      <div className="intro-hint env-anim">
        <span className="intro-tap" aria-hidden="true" />
        <p>Tap the seal to open</p>
      </div>
    </div>
  )
}
