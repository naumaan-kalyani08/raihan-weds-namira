import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './scenes.css'

/*
 * A full-screen picture that is pinned while the guest scrolls; a "camera"
 * glides from the whole scene to the R|N monogram, then to the couple, and
 * back out again, with captions fading in at each stop.
 *
 * Focus points are normalised (0–1) image coordinates; `span` is how much of
 * the image height that detail occupies, used to pick the zoom.
 */

const isPortrait = () => typeof window !== 'undefined' && window.innerHeight > window.innerWidth * 1.05
const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useOrientation(hasPortrait) {
  const [portrait, setPortrait] = useState(() => hasPortrait && isPortrait())
  useLayoutEffect(() => {
    if (!hasPortrait) return
    const on = () => setPortrait(isPortrait())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [hasPortrait])
  return portrait
}

export default function ZoomScene({ id, label, image, portraitImage, twinkles, title, mono, couple, finale, onCoupleDone }) {
  const secRef = useRef(null)
  const camRef = useRef(null)
  const portrait = useOrientation(Boolean(portraitImage))
  const img = portrait && portraitImage ? portraitImage : image
  const [still] = useState(reduceMotion)
  const onCoupleRef = useRef(onCoupleDone)
  useLayoutEffect(() => {
    onCoupleRef.current = onCoupleDone
  })

  useLayoutEffect(() => {
    if (still) return
    const sec = secRef.current
    const cam = camRef.current
    const q = gsap.utils.selector(sec)

    const geom = () => {
      const W = sec.offsetWidth
      const H = sec.offsetHeight
      const k = Math.min(W / img.w, H / img.h)
      const bw = img.w * k
      const bh = img.h * k
      cam.style.width = `${bw}px`
      cam.style.height = `${bh}px`
      const cover = Math.max(W / bw, H / bh)
      // Opening view: fill the screen when that crops little, otherwise at least ~62% of its height.
      const base = cover <= 1.35 ? cover : Math.min(cover, Math.max(1, (H * 0.62) / bh))
      return { W, H, bw, bh, base }
    }
    const place = (g, s, fx, fy, cy) => {
      const w = g.bw * s
      const h = g.bh * s
      let x = w >= g.W ? Math.min(0, Math.max(g.W - w, g.W / 2 - fx * w)) : (g.W - w) / 2
      let y = h >= g.H ? Math.min(0, Math.max(g.H - h, g.H * cy - fy * h)) : (g.H - h) / 2
      return { x, y, scale: s }
    }
    const whole = () => {
      const g = geom()
      return place(g, g.base, 0.5, 0.5, 0.5)
    }
    const focus = (f, fill, cy) => () => {
      const g = geom()
      const byHeight = (g.H * fill) / (f.span * g.bh)
      const byWidth = (g.W * 0.94) / (f.wspan * g.bw)
      const s = Math.min(4.2, Math.max(g.base * 1.1, Math.min(byHeight, byWidth)))
      return place(g, s, f.x, f.y, cy)
    }
    const toMono = focus(img.mono, 0.5, 0.46)
    const toCouple = focus(img.couple, 0.82, 0.6)
    const cam3 = (fn, d) => ({
      x: () => fn().x,
      y: () => fn().y,
      scale: () => fn().scale,
      ease: 'power1.inOut',
      duration: d,
    })

    let tl
    const ctx = gsap.context(() => {
      gsap.set(cam, { transformOrigin: '0 0', ...whole() })
      gsap.set(q('.zs-cap'), { opacity: 0, y: 18 })
      gsap.set(q('.zs-shade'), { opacity: 0 })

      tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sec,
            start: 'top top',
            end: '+=420%',
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => gsap.set(cam, whole()),
          },
        })
        .to(q('.zs-title'), { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0)
        .to(q('.zs-title'), { opacity: 0, y: -20, duration: 0.7 }, 1.7)
        .to(cam, cam3(toMono, 2.2), 1.8)
        .to(q('.zs-mono'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 3.4)
        .to(q('.zs-mono'), { opacity: 0, y: -14, duration: 0.6 }, 4.8)
        .to(cam, cam3(toCouple, 2.2), 4.8)
        .to(q('.zs-couple'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 6.4)
        .to(q('.zs-couple'), { opacity: 0, y: -14, duration: 0.6 }, 7.8)
        // couple caption has played out — celebrate (only when scrolling forward)
        .call(() => tl.scrollTrigger?.direction === 1 && onCoupleRef.current?.(), null, 8.1)
        .to(cam, cam3(whole, 2), 7.8)
        .to(q('.zs-shade'), { opacity: 1, duration: 1.2 }, 8.6)
        .to(q('.zs-finale'), { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 9)
        .to({}, { duration: 1 })
    }, sec)
    // Pins must be refreshed in page order (matters when the image swaps on rotation).
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })
    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [img, still])

  return (
    <section ref={secRef} id={id} className={`zs ${still ? 'zs--still' : ''}`} aria-label={label}>
      <div className="zs-bg" style={{ backgroundImage: `url(${img.blur})` }} aria-hidden="true" />
      <div ref={camRef} className="zs-cam">
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes={img.sizes}
          width={img.w}
          height={img.h}
          alt={img.alt}
          loading="lazy"
          decoding="async"
        />
        {twinkles && (
          <div className="zs-twinkles" aria-hidden="true">
            {twinkles.map(([x, y], i) => (
              <i
                key={i}
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  animationDelay: `${(i * 0.37) % 2.6}s`,
                  animationDuration: `${1.8 + (i % 5) * 0.45}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="zs-vignette" aria-hidden="true" />
      <div className="zs-shade" aria-hidden="true" />
      <div className="zs-cap zs-title">{title}</div>
      <div className="zs-cap zs-mono">{mono}</div>
      <div className="zs-cap zs-couple">{couple}</div>
      <div className="zs-cap zs-finale">{finale}</div>
    </section>
  )
}
