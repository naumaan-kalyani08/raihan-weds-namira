import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Envelope from './components/Envelope'
import ZoomScene from './components/ZoomScene'
import Silk from './components/Silk'
import { confetti } from './components/confetti'
import { GUEST, IS_TOUCH, playOnce, revealAll, useSmoothScroll } from './lib/motion'
import { RECEPTION_IMAGE as RECEPTION, RECEPTION_TWINKLES } from './lib/images'
import './App.css'

/* ------------------------------------------------------------------
 *  Edit the details below. Anything marked TODO is a placeholder.
 * ------------------------------------------------------------------ */
const EVENT = {
  groom: 'Raihan',
  bride: 'Namira',

  // Saturday, 19 December 2026 — dinner from 8:00 PM
  start: new Date(2026, 11, 19, 20, 0),
  end: new Date(2026, 11, 19, 23, 30),
  time: '8:00 PM onwards',
  timeEn: 'Dinner from 8:00 PM',

  venue: 'Rooftop, Raihan Heights',
  venueAddress: 'Opposite Ryan International School, Near Kotyarknagar, Adajan Patia, Surat',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Raihan+Heights+by+Zaha+Luxury+Surat',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.683510375359!2d72.80062507388212!3d21.20472798171392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d5a559029ef%3A0x575ea014abac466f!2sRaihan%20Heights%20by%20Zaha%20Luxury!5e0!3m2!1sen!2sin!4v1795358216027!5m2!1sen!2sin',

  hosts: 'Mrs. Shehnaz & Mr. Naeem Qureshi',
  elders: 'Mr. Mohammad Bashir Qureshi & Mrs. Hafiza Qureshi',
  brideParents: 'Mrs. Nargis & Mr. Amin Kalyani',
  family: 'The Qureshi Family',

  families: {
    groom: {
      side: "The Groom's Family",
      groups: [
        { title: 'Grandparents', people: ['Mr. Mohammad Bashir Qureshi', 'Mrs. Hafiza Qureshi'] },
        { title: 'Parents', people: ['Mr. Naeem Qureshi', 'Mrs. Shehnaz Qureshi'] },
      ],
    },
    bride: {
      side: "The Bride's Family",
      groups: [
        {
          title: 'Grandparents',
          people: [
            { name: 'Mr. Mehboob Kalyani', mark: 'Late' },
            { name: 'Mrs. Hanifa Kalyani', mark: 'Late' },
          ],
        },
        { title: 'Parents', people: ['Mr. Amin Kalyani', 'Mrs. Nargis Kalyani'] },
      ],
    },
  },

  // TODO: WhatsApp number in international format without "+" (e.g. 923001234567).
  // Leave empty to let guests pick a contact themselves.
  rsvpWhatsApp: '',
}

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
    'UID:walima-raihan-namira-20261219',
    `DTSTART:${fmt(EVENT.start)}`,
    `DTEND:${fmt(EVENT.end)}`,
    `SUMMARY:Dawat-e-Walima - ${EVENT.groom} & ${EVENT.bride}`,
    `LOCATION:${`${EVENT.venue}, ${EVENT.venueAddress}`.replaceAll(',', '\\,')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'walima-raihan-namira.ics'
  a.click()
  URL.revokeObjectURL(url)
}

/* ---------------------------- Ornaments ---------------------------- */

function Star({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="22" y="22" width="56" height="56" />
        <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="12" />
      </g>
    </svg>
  )
}

function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <Star className="divider-star" />
      <span className="divider-line" />
    </div>
  )
}

function Lantern({ className }) {
  return (
    <svg className={`lantern ${className}`} viewBox="0 0 60 160" aria-hidden="true">
      <line x1="30" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 40 h16 l4 10 h-24 z" fill="currentColor" />
      <path
        d="M18 50 h24 q8 25 0 60 h-24 q-8 -35 0 -60 z"
        fill="rgba(236,216,162,0.12)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M30 56 v48 M22 62 q8 18 0 36 M38 62 q-8 18 0 36" stroke="currentColor" strokeWidth="1" fill="none" />
      <ellipse className="lantern-glow" cx="30" cy="80" rx="7" ry="11" />
      <path d="M20 110 h20 l-4 10 h-12 z" fill="currentColor" />
      <path d="M30 120 v14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="138" r="3" fill="currentColor" />
    </svg>
  )
}

function Sparkles({ count = 18 }) {
  return (
    <div className="sparkles" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="sparkle" />
      ))}
    </div>
  )
}

/* ---------------------------- Sections ---------------------------- */

/* ------------------------- Scene pictures ------------------------- */

// Focus points are normalised image coordinates (found by eye on the artwork).
const NIKAH_LANDSCAPE = {
  src: '/images/nikah-landscape-2000.webp',
  srcSet: '/images/nikah-landscape-1100.webp 1100w, /images/nikah-landscape-2000.webp 2000w',
  sizes: '(max-width: 700px) 1100px, 100vw',
  blur: '/images/nikah-landscape-blur.webp',
  w: 2000,
  h: 1003,
  mono: { x: 0.507, y: 0.245, span: 0.3, wspan: 0.16 },
  couple: { x: 0.5, y: 0.75, span: 0.44, wspan: 0.34 },
  alt: 'Illustrated Nikah: the groom in an ivory sherwani and the bride in a red lehenga seated either side of a floral column, under a gold R|N monogram, with family gathered around',
}
const NIKAH_PORTRAIT = {
  src: '/images/nikah-portrait-1400.webp',
  srcSet: '/images/nikah-portrait-820.webp 820w, /images/nikah-portrait-1400.webp 1400w',
  sizes: '100vw',
  blur: '/images/nikah-portrait-blur.webp',
  w: 1400,
  h: 1711,
  mono: { x: 0.52, y: 0.24, span: 0.22, wspan: 0.4 },
  couple: { x: 0.51, y: 0.76, span: 0.44, wspan: 0.78 },
  alt: NIKAH_LANDSCAPE.alt,
}
function NikahScene() {
  return (
    <ZoomScene
      id="nikah"
      label="Nikah"
      image={NIKAH_LANDSCAPE}
      portraitImage={NIKAH_PORTRAIT}
      onCoupleDone={confetti}
      title={
        <div className="zs-panel">
          <p className="zs-eyebrow">
            Aqd-e-Nikah · <span className="ur" lang="ur" dir="rtl">عقدِ نکاح</span>
          </p>
          <p className="zs-h">Nikah</p>
          <p className="zs-sub">A blessed Sunnah of the Prophet ﷺ</p>
        </div>
      }
      mono={
        <div className="zs-panel">
          <p className="zs-eyebrow">Two names · one prayer</p>
          <p className="zs-script">
            {EVENT.groom} <span>&amp;</span> {EVENT.bride}
          </p>
        </div>
      }
      couple={
        <div className="zs-panel">
          <p className="zs-arabic" lang="ur" dir="rtl">قبول ہے · قبول ہے · قبول ہے</p>
          <p className="zs-meta">Qubool Hai · Qubool Hai · Qubool Hai</p>
        </div>
      }
      finale={
        <div className="zs-panel">
          <p className="zs-arabic" lang="ar" dir="rtl">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
          </p>
          <p className="zs-quote">
            &quot;And among His signs is that He created for you spouses from among yourselves, that you may find
            tranquillity in them.&quot;
          </p>
          <p className="zs-eyebrow">Surah Ar-Rum · 30:21</p>
        </div>
      }
    />
  )
}

function ReceptionScene() {
  return (
    <ZoomScene
      id="walima"
      label="Dawat-e-Walima"
      image={RECEPTION}
      twinkles={RECEPTION_TWINKLES}
      title={
        <div className="zs-panel">
          <p className="zs-eyebrow">
            Dawat-e-Walima · <span className="ur" lang="ur" dir="rtl">دعوتِ ولیمہ</span>
          </p>
          <p className="zs-h">Walima</p>
          <p className="zs-sub">An evening of duas, love and light</p>
        </div>
      }
      mono={
        <div className="zs-panel">
          <p className="zs-eyebrow">Dawat-e-Walima</p>
          <p className="zs-script">An Evening Adorned with Lights</p>
        </div>
      }
      couple={
        <div className="zs-panel">
          <p className="zs-script">
            {EVENT.groom} <span>&amp;</span> {EVENT.bride}
          </p>
          <p className="zs-meta">Saturday · 19 December 2026 · {EVENT.time}</p>
        </div>
      }
      finale={
        <div className="zs-panel">
          <p className="zs-eyebrow">InshaAllah</p>
          <p className="zs-script">We Look Forward to Welcoming You</p>
          <p className="zs-meta">{EVENT.venue} · Adajan Patia, Surat</p>
        </div>
      }
    />
  )
}

function Families() {
  const sides = [
    ['groom', EVENT.groom],
    ['bride', EVENT.bride],
  ]
  return (
    <section className="section families">
      {/* <p className="caption reveal">Ba-ijazat-e-Buzurgaan</p> */}
      <h3 className="section-title reveal">With the Blessings of Our Families</h3>
      <div className="reveal">
        <Divider />
      </div>
      <div className="family-grid">
        {sides.map(([key, name]) => {
          const f = EVENT.families[key]
          return (
            <article className="family" key={key}>
              <Star className="family-star" />
              <h4>{f.side}</h4>
              <p className="family-of">{name}</p>
              {f.groups.map((g) => (
                <div className="family-group" key={g.title}>
                  <p className="family-role">{g.title}</p>
                  {g.people.map((p) => {
                    const { name, mark } = typeof p === 'string' ? { name: p } : p
                    return (
                      <p className="family-name" key={name}>
                        {name}
                        {mark && <span className="family-mark"> ({mark})</span>}
                      </p>
                    )
                  })}
                </div>
              ))}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Hero() {
  return (
    <header className="hero">
      <Sparkles />
      <Lantern className="lantern--left" />
      <Lantern className="lantern--right" />
      <div className="arch">
        <svg className="arch-frame" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="archGrad" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" stopColor="#3d4a2f" stopOpacity="0.85" />
              <stop offset="0.55" stopColor="#27311e" stopOpacity="0.8" />
              <stop offset="1" stopColor="#151b11" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path className="arch-fill" d="M10 590 V220 Q10 75 200 10 Q390 75 390 220 V590 Z" />
          <path className="arch-line" pathLength="1" d="M10 590 V220 Q10 75 200 10 Q390 75 390 220 V590 Z" />
          <path
            className="arch-line arch-line--inner"
            pathLength="1"
            d="M26 576 V224 Q26 90 200 28 Q374 90 374 224 V576 Z"
          />
        </svg>
        <div className="arch-content">
          <p className="arabic arabic--sm hero-anim">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <p className="hero-small hero-anim">In the Name of Allah, the Most Gracious, the Most Merciful</p>
          <h2 className="walima-title hero-anim">Dawat-e-Walima</h2>
          <div className="hero-anim">
            <Divider />
          </div>
          {/* <p className="hero-small hero-anim">Ba-ijazat-e-Buzurgaan</p> */}
          <p className="name hero-anim">{EVENT.groom}</p>
          <p className="ampersand hero-anim">with</p>
          <p className="name hero-anim">{EVENT.bride}</p>
          <div className="hero-anim">
            <Divider />
          </div>
          <p className="hero-date hero-anim">InshaAllah · Saturday</p>
          <p className="hero-date hero-date--big hero-anim">19 · December · 2026</p>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span />
      </div>
    </header>
  )
}

function Verse() {
  return (
    <section className="section verse">
      <p className="arabic reveal">وَخَلَقْنَاكُمْ أَزْوَاجًا</p>
      <p className="translit reveal">Wa khalaqnaakum azwaajaa</p>
      <p className="quote reveal">"And We created you in pairs."</p>
      <p className="caption reveal">Surah An-Naba · 78:8</p>
    </section>
  )
}

function Invitation() {
  return (
    <section id="invite" className="section card">
      <p className="lead reveal">Assalam-o-Alaikum wa Rahmatullahi wa Barakatuhu</p>
      <p className="card-hosts reveal">{EVENT.hosts}</p>
      <p className="body reveal">with the blessings of</p>
      <p className="card-hosts reveal">{EVENT.elders}</p>
      <p className="body reveal">
        cordially request the honour of your presence at the <em>Dawat-e-Walima</em> celebrating the marriage of
        their beloved son
      </p>
      <p className="card-names reveal">
        {EVENT.groom} <span>with</span> {EVENT.bride}
      </p>
      <p className="body body--small reveal">(Daughter of {EVENT.brideParents})</p>
      {GUEST && (
        <p className="body reveal">
          Invitees: <strong>{GUEST}</strong>
        </p>
      )}
    </section>
  )
}

function Details() {
  return (
    <section className="section details">
      <h3 className="section-title reveal">Event Details</h3>
      <div className="reveal">
        <Divider />
      </div>
      <div className="detail-grid">
        <div className="detail">
          <Star className="detail-icon" />
          <h4>Date</h4>
          <p className="detail-main">Saturday, 19 December 2026</p>
          <p className="detail-sub">10 Rajab-ul-Murajjab 1448 Hijri</p>
        </div>
        <div className="detail">
          <Star className="detail-icon" />
          <h4>Time</h4>
          <p className="detail-main">{EVENT.time}</p>
          <p className="detail-sub">{EVENT.timeEn}</p>
        </div>
        <div className="detail">
          <Star className="detail-icon" />
          <h4>Venue</h4>
          <p className="detail-main">{EVENT.venue}</p>
          <p className="detail-sub">{EVENT.venueAddress}</p>
        </div>
      </div>
      <div className="map-frame reveal">
        <iframe
          src={EVENT.mapsEmbed}
          title={`Map: ${EVENT.venue}, ${EVENT.venueAddress}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="actions reveal">
        <a className="btn btn--outline" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">
          Open on map
        </a>
        <button className="btn btn--outline" onClick={downloadIcs}>
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
    <section className="section countdown">
      <h3 className="section-title reveal">{t.done ? 'Alhamdulillah! Mubarak!' : 'Counting Down to the Celebration'}</h3>
      {!t.done && (
        <div className="count-grid">
          {units.map(([label, v]) => (
            <div className="count" key={label}>
              <span className="count-num">{String(v).padStart(2, '0')}</span>
              <span className="count-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// function Rsvp() {
//   const [name, setName] = useState('')
//   const [guests, setGuests] = useState('2')
//   const [attending, setAttending] = useState('yes')

//   const submit = (e) => {
//     e.preventDefault()
//     const msg =
//       attending === 'yes'
//         ? `Assalam-o-Alaikum! InshaAllah main (${name}) ${guests} afraad ke saath ${EVENT.groom} & ${EVENT.bride} ki Dawat-e-Walima mein shirkat karunga/karungi. Bahut bahut Mubarak ho!`
//         : `Assalam-o-Alaikum! Maazrat, main (${name}) Dawat-e-Walima mein shirkat nahi kar paunga/paungi. ${EVENT.groom} & ${EVENT.bride} ko dheron mubarakbaad aur duayein.`
//     const base = EVENT.rsvpWhatsApp ? `https://wa.me/${EVENT.rsvpWhatsApp}` : 'https://wa.me/'
//     window.open(`${base}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
//   }

//   return (
//     <section className="section rsvp">
//       <h3 className="section-title reveal">Aamad Ki Ittela</h3>
//       <p className="body reveal">Barah-e-karam apni tashreef aawri se mutalla farmayein</p>
//       <form className="rsvp-form reveal" onSubmit={submit}>
//         <label>
//           <span>Aap Ka Naam</span>
//           <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Naam likhiye" />
//         </label>
//         <div className="rsvp-choice" role="radiogroup">
//           <button
//             type="button"
//             role="radio"
//             aria-checked={attending === 'yes'}
//             className={attending === 'yes' ? 'active' : ''}
//             onClick={() => setAttending('yes')}
//           >
//             InshaAllah Hazir Honge
//           </button>
//           <button
//             type="button"
//             role="radio"
//             aria-checked={attending === 'no'}
//             className={attending === 'no' ? 'active' : ''}
//             onClick={() => setAttending('no')}
//           >
//             Maazrat, Na Aa Sakenge
//           </button>
//         </div>
//         {attending === 'yes' && (
//           <label>
//             <span>Mehmanon Ki Tadaad</span>
//             <select value={guests} onChange={(e) => setGuests(e.target.value)}>
//               {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
//                 <option key={n} value={n}>
//                   {n}
//                 </option>
//               ))}
//             </select>
//           </label>
//         )}
//         <button type="submit" className="btn btn--gold">
//           WhatsApp Par Bhejiye
//         </button>
//       </form>
//     </section>
//   )
// }

function Footer() {
  return (
    <footer className="section footer">
      <p className="arabic arabic--sm reveal">
        بَارَكَ اللّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
      </p>
      <p className="translit reveal">Barakallahu lakuma wa baraka alaikuma wa jama&apos;a bainakuma fi khair</p>
      <p className="quote reveal">
        "May Allah bless you both, shower His blessings upon you, and unite you both in goodness."
      </p>
      <div className="reveal">
        <Divider />
      </div>
      <p className="footer-note reveal">
        Your presence, blessings, and duas will be a cherished part of our celebration.
      </p>
      <p className="footer-from footer-from--muted reveal">With warm regards,</p>
      <p className="footer-line reveal">{EVENT.family}</p>
      <p className="footer-from reveal">
        <strong>{EVENT.hosts}</strong>
      </p>
      <p className="footer-tag reveal">#RaihanWedsNamira</p>
    </footer>
  )
}

/* ------------------------------ App ------------------------------ */

export default function App() {
  const root = useRef(null)
  const [opened, setOpened] = useState(false)
  const unlockScroll = useSmoothScroll()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Hero starts hidden until the envelope is opened
      gsap.set('.hero-anim', { y: 30, opacity: 0 })
      gsap.set('.arch-line', { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set('.arch-fill', { opacity: 0 })

      // Ambient motion
      gsap.utils.toArray('.lantern').forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotation: -4 },
          { rotation: 4, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' },
        )
      })
      gsap.to('.lantern-glow', { opacity: 0.45, duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.utils.toArray('.sparkle').forEach((el) => {
        gsap.set(el, {
          left: `${gsap.utils.random(0, 100)}%`,
          top: `${gsap.utils.random(0, 100)}%`,
          scale: gsap.utils.random(0.4, 1.2),
          opacity: 0,
        })
        gsap.to(el, {
          y: gsap.utils.random(-80, -30),
          opacity: gsap.utils.random(0.4, 0.9),
          duration: gsap.utils.random(2.5, 5),
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 3),
          ease: 'sine.inOut',
        })
      })
      gsap.to('.scroll-hint span', { y: 14, opacity: 0, duration: 1.6, repeat: -1, ease: 'power1.in' })

      if (reduce) return

      // Hero parallax
      gsap.to('.arch', {
        yPercent: 18,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.lantern--left', {
        y: 180,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.lantern--right', {
        y: 260,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      // Background drift repaints the whole page every frame — desktop only.
      if (!IS_TOUCH) {
        gsap.to('.page', {
          backgroundPosition: 'center -240px, 0 0, 0 0',
          ease: 'none',
          scrollTrigger: { trigger: '.page', start: 'top top', end: 'bottom bottom', scrub: true },
        })
      }

      // Reveals: play once, as soon as the element peeks into view.
      const once = playOnce
      revealAll()

      // Invitation card scales in
      once(
        '.card',
        'top 92%',
        gsap.from('.card', { scale: 0.95, opacity: 0, duration: 0.8, ease: 'power2.out', paused: true }),
      )

      // Staggered groups
      once(
        '.detail-grid',
        'top 92%',
        gsap.from('.detail', { y: 36, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.3)', paused: true }),
      )
      once(
        '.count-grid',
        'top 94%',
        gsap.from('.count', {
          y: 24,
          opacity: 0,
          rotationX: -50,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          paused: true,
        }),
      )
      gsap.utils.toArray('.divider-line').forEach((el) => {
        once(el, 'top 98%', gsap.from(el, { scaleX: 0, duration: 0.8, ease: 'power2.out', paused: true }))
      })
    },
    { scope: root },
  )

  // Called while the card zooms past the viewer: draw the arch underneath.
  const revealHero = () => {
    const q = gsap.utils.selector(root.current)
    gsap
      .timeline()
      .to(q('.arch-fill'), { opacity: 1, duration: 0.8 })
      .to(q('.arch-line'), { strokeDashoffset: 0, duration: 1.8, stagger: 0.2, ease: 'power2.inOut' }, '<')
      .to(q('.hero-anim'), { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '-=1.4')
  }

  const onOpened = () => {
    setOpened(true)
    unlockScroll()
  }

  return (
    <div ref={root}>
      <Silk id="page-silk" className="page-silk" />
      {!opened && (
        <Envelope
          groom={EVENT.groom}
          bride={EVENT.bride}
          dateLabel="19 · December · 2026"
          guest={GUEST}
          onReveal={revealHero}
          onOpened={onOpened}
        />
      )}
      <main className="page">
        <Hero />
        <Verse />
        <Invitation />
        <Families />
        <NikahScene />
        <ReceptionScene />
        <Details />
        <Countdown />
        {/* <Rsvp /> */}
        <Footer />
      </main>
    </div>
  )
}
