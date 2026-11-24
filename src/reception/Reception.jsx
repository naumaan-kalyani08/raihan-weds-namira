import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Envelope from '../components/Envelope'
import Silk from '../components/Silk'
import ZoomScene from '../components/ZoomScene'
import { confetti } from '../components/confetti'
import { GUEST, playOnce, revealAll, useSmoothScroll } from '../lib/motion'
import { RECEPTION_IMAGE, RECEPTION_TWINKLES } from '../lib/images'
import { FloralDefs, Leaf, Rose, Sprig } from './Florals'
import './reception.css'

/* ------------------------------------------------------------------
 *  Wedding reception — details exactly as printed on the card.
 * ------------------------------------------------------------------ */
const EVENT = {
  groom: 'Raihan',
  bride: 'Namira',
  hosts: 'Naeem & Shehnaz Qureshi',

  // Saturday, 26 December 2026 — from 8:00 PM
  start: new Date(2026, 11, 26, 20, 0),
  end: new Date(2026, 11, 26, 23, 30),
  dateLong: 'Saturday, 26 December 2026',

  venue: 'Hotel Euphoria',
  address: 'Behind Baghban Kratos Club, Opp. The Fantasia 2, Gaurav Path Road, Pal, Surat',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Euphoria+Gaurav+Path+Road+Pal+Surat',
  mapsEmbed: 'https://maps.google.com/maps?q=Hotel%20Euphoria%2C%20Gaurav%20Path%20Road%2C%20Pal%2C%20Surat&z=15&output=embed',

  families: [
    {
      side: "The Groom's Family",
      name: 'Raihan',
      groups: [
        { title: 'Grandparents', people: ['Mr. Mohammad Bashir Qureshi', 'Mrs. Hafiza Qureshi'] },
        { title: 'Parents', people: ['Mr. Naeem Qureshi', 'Mrs. Shehnaz Qureshi'] },
      ],
    },
    {
      side: "The Bride's Family",
      name: 'Namira',
      groups: [
        { title: 'Grandparents', people: ['Late Mr. Mehboob Kalyani', 'Late Mrs. Hanifa Kalyani'] },
        { title: 'Parents', people: ['Mr. Amin Kalyani', 'Mrs. Nargis Kalyani'] },
      ],
    },
  ],
}

// Mint silk for the backdrop (same artwork as the Walima page, recoloured).
const MINT = {
  base: ['#d9ede6', '#b9d7cd', '#8fb9ac', '#5d8b7e'],
  fold: '#eef8f4',
  hi: ['#ffffff', '#ffffff', '#f6fffb'],
  shadow: '#3f6d61',
  shadowOpacity: 0.2,
  vignette: 0.32,
}

// Rose-petal confetti in the card's blush, ivory, dusty-blue and gold.
const PETALS = ['#ffffff', '#fbe3e6', '#efb4bf', '#e59aaa', '#d8b05c', '#f0d590', '#b7d2cb']
const petalConfetti = () => confetti({ colors: PETALS })

function getRemaining(target) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  }
}

function downloadIcs() {
  const fmt = (d) =>
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    'T' +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    '00'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//raihan-weds-namira//EN',
    'BEGIN:VEVENT',
    'UID:reception-raihan-namira-20261226',
    `DTSTART:${fmt(EVENT.start)}`,
    `DTEND:${fmt(EVENT.end)}`,
    `SUMMARY:Wedding Reception - ${EVENT.groom} & ${EVENT.bride}`,
    `LOCATION:${`${EVENT.venue}, ${EVENT.address}`.replaceAll(',', '\\,')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'reception-raihan-namira.ics'
  a.click()
  URL.revokeObjectURL(url)
}

/* ---------------------------- Ornaments ---------------------------- */

function Divider({ className = '' }) {
  return (
    <div className={`rx-divider ${className}`} aria-hidden="true">
      <span className="rx-divider-line" />
      <svg viewBox="0 0 40 20">
        <path d="M2 10 C10 2 16 2 20 10 C24 18 30 18 38 10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="20" cy="10" r="3" fill="currentColor" />
      </svg>
      <span className="rx-divider-line" />
    </div>
  )
}

// Small open rose used as the section emblem (in place of the Walima star).
function RoseMark({ className = '' }) {
  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden="true">
      <FloralDefs />
      <Rose x={0} y={0} r={40} tone="blush" />
    </svg>
  )
}

const ICONS = {
  date: (
    <path d="M7 4v3M17 4v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM8 13h3v3H8z" />
  ),
  time: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2" />,
  venue: <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />,
}

function Icon({ name }) {
  return (
    <svg className="rx-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </g>
    </svg>
  )
}

function Petals({ count = 14 }) {
  return (
    <div className="rx-petals" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="rx-petal" />
      ))}
    </div>
  )
}

function Sparkles({ count = 16 }) {
  return (
    <div className="rx-sparkles" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="rx-sparkle" />
      ))}
    </div>
  )
}

/* ---------------------------- Sections ---------------------------- */

// Rounded floral arch (the Walima hero's layout, re-drawn as a garden arch).
const ARCH = 'M12 590 V210 A188 188 0 0 1 388 210 V590 Z'
const ARCH_INNER = 'M28 576 V214 A172 172 0 0 1 372 214 V576 Z'

function Hero() {
  return (
    <header className="rx-hero">
      <Sparkles />
      <div className="rx-arch">
        <svg className="rx-arch-frame" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="rxArchGrad" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" stopColor="#fffdf8" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#fbf5e8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#eef6f2" stopOpacity="0.92" />
            </linearGradient>
          </defs>
          <path className="rx-arch-fill" d={ARCH} />
          <path className="rx-arch-line" pathLength="1" d={ARCH} />
          <path className="rx-arch-line rx-arch-line--inner" pathLength="1" d={ARCH_INNER} />
        </svg>
        {/* pearls sit on the (stretchy) arch line, so they are positioned in % */}
        <span className="rx-arch-pearl rxa-pearl" style={{ left: '50%', top: '3.7%' }} />
        <span className="rx-arch-pearl rx-arch-pearl--sm rxa-pearl" style={{ left: '3%', top: '98.3%' }} />
        <span className="rx-arch-pearl rx-arch-pearl--sm rxa-pearl" style={{ left: '97%', top: '98.3%' }} />
        {/* each bouquet keeps its proportions, pinned to its own corner of the arch */}
        <svg className="rx-arch-flowers rx-arch-flowers--tl" viewBox="0 0 140 230" aria-hidden="true">
          <FloralDefs />
          <g className="rxa-bouquet rxa-bouquet--tl">
            <Sprig x={70} y={70} s={1} rot={-120} />
            <Sprig x={44} y={150} s={0.9} rot={-200} />
            <Leaf x={60} y={110} s={40} rot={-150} dark />
            <Leaf x={40} y={150} s={36} rot={150} />
            <Leaf x={92} y={70} s={34} rot={-70} />
            <Rose x={30} y={150} r={26} tone="sage" rot={10} />
            <Rose x={58} y={98} r={34} tone="blush" rot={-12} />
            <Rose x={100} y={66} r={22} tone="ivory" rot={20} />
            <Rose x={30} y={196} r={18} tone="pink" rot={-30} />
          </g>
        </svg>
        <svg className="rx-arch-flowers rx-arch-flowers--br" viewBox="260 470 140 130" aria-hidden="true">
          <g className="rxa-bouquet rxa-bouquet--br">
            <Sprig x={330} y={560} s={1} rot={-30} />
            <Sprig x={386} y={500} s={0.9} rot={-100} />
            <Leaf x={350} y={545} s={40} rot={-40} />
            <Leaf x={380} y={520} s={34} rot={-100} dark />
            <Leaf x={320} y={580} s={34} rot={170} dark />
            <Rose x={386} y={540} r={26} tone="ivory" rot={-20} />
            <Rose x={350} y={575} r={34} tone="blush" rot={12} />
            <Rose x={300} y={590} r={20} tone="sage" rot={30} />
            <Rose x={392} y={590} r={18} tone="pink" rot={-10} />
          </g>
        </svg>
        <div className="rx-arch-content">
          <p className="rx-hero-small rx-hero-anim">Together with their families</p>
          <h1 className="rx-hero-title rx-hero-anim">The Wedding Reception</h1>
          <div className="rx-hero-anim">
            <Divider />
          </div>
          <p className="rx-name rx-hero-anim">{EVENT.groom}</p>
          <p className="rx-amp rx-hero-anim">&amp;</p>
          <p className="rx-name rx-hero-anim">{EVENT.bride}</p>
          <div className="rx-hero-anim">
            <Divider />
          </div>
          <p className="rx-hero-date rx-hero-anim">Saturday</p>
          <p className="rx-hero-date rx-hero-date--big rx-hero-anim">26 · December · 2026</p>
        </div>
      </div>
      <div className="rx-scroll-hint" aria-hidden="true">
        <span />
      </div>
    </header>
  )
}

function Quote() {
  return (
    <section className="rx-section rx-quote">
      <RoseMark className="rx-emblem reveal" />
      <p className="rx-quote-text reveal">&ldquo;Two souls with but a single thought, two hearts that beat as one.&rdquo;</p>
      <p className="rx-caption reveal">Friedrich Halm</p>
    </section>
  )
}

function Invitation() {
  return (
    <section className="rx-section rx-invite">
      <p className="rx-invite-hosts reveal">{EVENT.hosts}</p>
      <p className="rx-body reveal">request the pleasure of your company at the</p>
      <p className="rx-invite-occasion reveal">Wedding Reception of</p>
      <p className="rx-invite-names reveal">
        {EVENT.groom} <span>&amp;</span> {EVENT.bride}
      </p>
      <div className="reveal">
        <Divider />
      </div>
      <p className="rx-invite-when reveal">
        {EVENT.dateLong}
        <br />
        <em>from 8:00 pm (onwards)</em>
      </p>
      <p className="rx-invite-venue reveal">
        <strong>{EVENT.venue}</strong>
        <br />
        {EVENT.address}
      </p>
      {GUEST && (
        <p className="rx-body reveal">
          Invitees: <strong>{GUEST}</strong>
        </p>
      )}
    </section>
  )
}

function Families() {
  return (
    <section className="rx-section rx-families">
      <h3 className="rx-title reveal">With Love from Our Families</h3>
      <div className="reveal">
        <Divider />
      </div>
      <div className="rx-family-grid">
        {EVENT.families.map((f) => (
          <article className="rx-family" key={f.side}>
            <RoseMark className="rx-family-mark" />
            <h4>{f.side}</h4>
            <p className="rx-family-of">{f.name}</p>
            {f.groups.map((g) => (
              <div className="rx-family-group" key={g.title}>
                <p className="rx-family-role">{g.title}</p>
                {g.people.map((p) => (
                  <p className="rx-family-name" key={p}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  )
}

function ReceptionScene() {
  return (
    <ZoomScene
      id="reception"
      label="The Reception"
      image={RECEPTION_IMAGE}
      twinkles={RECEPTION_TWINKLES}
      onCoupleDone={petalConfetti}
      title={
        <div className="zs-panel">
          <p className="zs-eyebrow">The Wedding Reception</p>
          <p className="zs-h">An Evening to Remember</p>
          <p className="zs-sub">Of love, laughter and celebration</p>
        </div>
      }
      mono={
        <div className="zs-panel">
          <p className="zs-eyebrow">Two hearts · One forever</p>
          <p className="zs-script">
            {EVENT.groom} <span>&amp;</span> {EVENT.bride}
          </p>
        </div>
      }
      couple={
        <div className="zs-panel">
          <p className="zs-script">Just Married</p>
          <p className="zs-meta">Saturday · 26 December 2026 · 8:00 PM</p>
        </div>
      }
      finale={
        <div className="zs-panel">
          <p className="zs-eyebrow">Join us</p>
          <p className="zs-script">We Look Forward to Celebrating with You</p>
          <p className="zs-meta">{EVENT.venue} · Pal, Surat</p>
        </div>
      }
    />
  )
}

function Details() {
  return (
    <section className="rx-section rx-details">
      <p className="rx-kicker reveal">Save the date</p>
      <h3 className="rx-title reveal">The Celebration</h3>
      <div className="reveal">
        <Divider />
      </div>
      <div className="rx-detail-grid">
        <div className="rx-detail">
          <Icon name="date" />
          <h4>Date</h4>
          <p className="rx-detail-main">{EVENT.dateLong}</p>
        </div>
        <div className="rx-detail">
          <Icon name="time" />
          <h4>Time</h4>
          <p className="rx-detail-main">From 8:00 PM onwards</p>
        </div>
        <div className="rx-detail">
          <Icon name="venue" />
          <h4>Venue</h4>
          <p className="rx-detail-main">{EVENT.venue}</p>
          <p className="rx-detail-sub">{EVENT.address}</p>
        </div>
      </div>
      <div className="rx-map reveal">
        <iframe
          src={EVENT.mapsEmbed}
          title={`Map: ${EVENT.venue}, ${EVENT.address}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="rx-actions reveal">
        <a className="rx-btn" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">
          Get directions
        </a>
        <button className="rx-btn" onClick={downloadIcs}>
          Add to calendar
        </button>
      </div>
    </section>
  )
}

function Countdown() {
  const [t, setT] = useState(() => getRemaining(EVENT.start))
  useEffect(() => {
    const id = setInterval(() => setT(getRemaining(EVENT.start)), 1000)
    return () => clearInterval(id)
  }, [])
  const units = [
    ['Days', t.days],
    ['Hours', t.hours],
    ['Minutes', t.minutes],
    ['Seconds', t.seconds],
  ]
  return (
    <section className="rx-section rx-countdown">
      <h3 className="rx-title reveal">{t.done ? 'The celebration has begun!' : 'Counting Down to the Big Night'}</h3>
      {!t.done && (
        <div className="rx-count-grid">
          {units.map(([label, v]) => (
            <div className="rx-count" key={label}>
              <span className="rx-count-num">{String(v).padStart(2, '0')}</span>
              <span className="rx-count-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Footer() {
  return (
    <footer className="rx-section rx-footer">
      <RoseMark className="rx-emblem reveal" />
      <p className="rx-body reveal">
        Your presence and blessings will be the most cherished part of our celebration.
      </p>
      <div className="reveal">
        <Divider />
      </div>
      <p className="rx-footer-line reveal">We can&apos;t wait to celebrate with you</p>
      <p className="rx-body rx-body--muted reveal">With love and warm regards,</p>
      <p className="rx-footer-from reveal">{EVENT.hosts}</p>
      <p className="rx-footer-tag reveal">#RaihanWedsNamira</p>
    </footer>
  )
}

/* ------------------------------ Page ------------------------------ */

export default function Reception() {
  const root = useRef(null)
  const [opened, setOpened] = useState(false)
  const unlockScroll = useSmoothScroll()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Hero starts hidden until the envelope is opened
      gsap.set('.rx-hero-anim', { y: 30, opacity: 0 })
      gsap.set('.rx-arch-line', { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set('.rx-arch-fill', { opacity: 0 })
      gsap.set('.rx-arch .rxa-pearl', { scale: 0 })
      gsap.set('.rx-arch-flowers .rxa-rose', { scale: 0, rotation: -60, transformOrigin: '50% 50%' })
      gsap.set('.rx-arch-flowers .rxa-leaf, .rx-arch-flowers .rxa-sprig', { opacity: 0, scale: 0.6, transformOrigin: '0% 50%' })

      // Ambient motion: drifting petals and twinkling sparkles
      gsap.utils.toArray('.rx-petal').forEach((el) => {
        gsap.set(el, {
          left: `${gsap.utils.random(0, 100)}%`,
          top: `${gsap.utils.random(-10, 90)}%`,
          rotation: gsap.utils.random(0, 360),
          scale: gsap.utils.random(0.6, 1.3),
          opacity: 0,
        })
        gsap.to(el, {
          y: gsap.utils.random(60, 160),
          x: gsap.utils.random(-40, 40),
          rotation: `+=${gsap.utils.random(90, 240)}`,
          opacity: gsap.utils.random(0.45, 0.85),
          duration: gsap.utils.random(5, 9),
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 4),
          ease: 'sine.inOut',
        })
      })
      gsap.utils.toArray('.rx-sparkle').forEach((el) => {
        gsap.set(el, {
          left: `${gsap.utils.random(0, 100)}%`,
          top: `${gsap.utils.random(0, 100)}%`,
          scale: gsap.utils.random(0.4, 1.2),
          opacity: 0,
        })
        gsap.to(el, {
          y: gsap.utils.random(-80, -30),
          opacity: gsap.utils.random(0.5, 0.95),
          duration: gsap.utils.random(2.5, 5),
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 3),
          ease: 'sine.inOut',
        })
      })
      gsap.to('.rx-scroll-hint span', { y: 14, opacity: 0, duration: 1.6, repeat: -1, ease: 'power1.in' })

      if (reduce) return

      // Hero parallax
      gsap.to('.rx-arch', {
        yPercent: 14,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: '.rx-hero', start: 'top top', end: 'bottom top', scrub: true },
      })

      revealAll()
      playOnce('.rx-invite', 'top 92%', gsap.from('.rx-invite', { scale: 0.95, opacity: 0, duration: 0.8, ease: 'power2.out', paused: true }))
      playOnce(
        '.rx-family-grid',
        'top 92%',
        gsap.from('.rx-family', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', paused: true }),
      )
      playOnce(
        '.rx-detail-grid',
        'top 92%',
        gsap.from('.rx-detail', { y: 36, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.3)', paused: true }),
      )
      playOnce(
        '.rx-count-grid',
        'top 94%',
        gsap.from('.rx-count', { y: 24, opacity: 0, rotationX: -50, duration: 0.6, stagger: 0.08, ease: 'power2.out', paused: true }),
      )
      gsap.utils.toArray('.rx-divider-line').forEach((el) => {
        playOnce(el, 'top 98%', gsap.from(el, { scaleX: 0, duration: 0.8, ease: 'power2.out', paused: true }))
      })
    },
    { scope: root },
  )

  // Called while the envelope card zooms past the viewer: the arch draws and blooms underneath.
  const revealHero = () => {
    const q = gsap.utils.selector(root.current)
    gsap
      .timeline()
      .to(q('.rx-arch-fill'), { opacity: 1, duration: 0.8 })
      .to(q('.rx-arch-line'), { strokeDashoffset: 0, duration: 1.8, stagger: 0.2, ease: 'power2.inOut' }, '<')
      .to(q('.rx-hero-anim'), { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '-=1.4')
      .to(q('.rx-arch .rxa-pearl'), { scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2.4)' }, 0.8)
      .to(q('.rx-arch-flowers .rxa-leaf, .rx-arch-flowers .rxa-sprig'), { opacity: 1, scale: 1, duration: 0.8, stagger: 0.04 }, 0.9)
      .to(q('.rx-arch-flowers .rxa-rose'), { scale: 1, rotation: 0, duration: 1.1, stagger: 0.08, ease: 'back.out(1.5)' }, 1)
      .add(() => {
        // the bouquets keep breathing softly once in place
        gsap.to(q('.rxa-bouquet--tl'), { rotation: -1.5, svgOrigin: '20 40', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to(q('.rxa-bouquet--br'), { rotation: 1.5, svgOrigin: '390 600', duration: 4.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      })
  }

  const onOpened = () => {
    setOpened(true)
    unlockScroll()
  }

  return (
    <div className="rx" ref={root}>
      <Silk id="rx-silk" className="rx-silk" palette={MINT} />
      <Petals />
      {!opened && (
        <Envelope
          className="intro--rx"
          title="Wedding Reception"
          joiner="&"
          bismillah={false}
          silk={MINT}
          groom={EVENT.groom}
          bride={EVENT.bride}
          dateLabel="26 · December · 2026"
          guest={GUEST}
          onReveal={revealHero}
          onOpened={onOpened}
        />
      )}
      <main className="rx-page">
        <Hero />
        <Quote />
        <Invitation />
        <Families />
        <ReceptionScene />
        <Details />
        <Countdown />
        <Footer />
      </main>
    </div>
  )
}
