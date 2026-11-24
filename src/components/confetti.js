/*
 * Petal confetti after "Qubool Hai" — same canvas-confetti setup as wedding_simple:
 * for ~3 s, two streams fire high from the left and right edges while petals
 * drift down from the top, in the invitation's ivory / gold / sage palette.
 */
import '../vendor/confetti.min.js' // canvas-confetti v1.9.3 — sets window.confetti

const COLORS = ['#ffffff', '#fbf6ea', '#ecd8a2', '#c9a65e', '#e7c98a', '#8f9c6a']
const DURATION = 3200

let running = false

export function confetti({ colors = COLORS } = {}) {
  const fire = typeof window !== 'undefined' && window.confetti
  if (!fire || running) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  running = true

  const petal = fire.shapeFromPath ? fire.shapeFromPath({ path: 'M0 0C8-12 24-12 32 0C24 12 8 12 0 0Z' }) : 'circle'
  const common = { colors, zIndex: 50, disableForReducedMotion: true }
  const end = Date.now() + DURATION

  ;(function frame() {
    // side cannons: launched from 70% down the screen, high and inward
    fire({ ...common, particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, shapes: [petal, 'circle'], scalar: 1.5, ticks: 260, gravity: 0.7, drift: 0.5 })
    fire({ ...common, particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, shapes: [petal, 'circle'], scalar: 1.5, ticks: 260, gravity: 0.7, drift: -0.5 })
    // petals floating down from above the top edge
    fire({ ...common, particleCount: 3, spread: 160, startVelocity: 8, origin: { x: Math.random(), y: -0.05 }, shapes: [petal], scalar: 1.6, ticks: 360, gravity: 0.5 })
    if (Date.now() < end) requestAnimationFrame(frame)
    else running = false
  })()
}
