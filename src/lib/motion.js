import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const IS_TOUCH =
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

// Mobile browsers fire resize whenever the address bar shows/hides; re-measuring
// every time makes pinned scenes jump, so ignore those.
ScrollTrigger.config({ ignoreMobileResize: true })

// Personalise a link with ?to=Name to fill the card's "Invitees" line.
export const GUEST =
  typeof window !== 'undefined'
    ? (new URLSearchParams(window.location.search).get('to') || '').trim().slice(0, 80)
    : ''

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in sync.
 * syncTouch stays off, so phones keep native (momentum) touch scrolling — smoothing
 * touch on iOS makes pinned scenes stutter. The page starts locked (envelope intro);
 * call the returned `unlock()` once the intro is gone.
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('locked')
    document.body.classList.add('locked')

    // Trigger positions go stale once web fonts / images finish loading — re-measure then.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  const unlock = () => {
    document.documentElement.classList.remove('locked')
    document.body.classList.remove('locked')
    lenisRef.current?.start()
    // Re-measure after the intro overlay is gone and layout has settled.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  return unlock
}

/**
 * Play `tween` once, as soon as `trigger` reaches `start`. Anything already
 * scrolled past (fast flick, jump) is revealed immediately too.
 */
export function playOnce(trigger, start, tween) {
  return ScrollTrigger.create({ trigger, start, once: true, onEnter: () => tween.play() })
}

/** Fade-up every `.reveal` element as it peeks into view. */
export function revealAll(selector = '.reveal') {
  gsap.utils.toArray(selector).forEach((el) => {
    playOnce(el, 'top 96%', gsap.from(el, { y: 24, opacity: 0, duration: 0.7, ease: 'power2.out', paused: true }))
  })
}
