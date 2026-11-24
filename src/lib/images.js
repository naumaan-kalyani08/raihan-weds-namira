/*
 * Evening reception picture, shared by both invitations' pinned zoom scenes.
 * Focus points are normalised (0–1) image coordinates (found by eye on the artwork).
 */
export const RECEPTION_IMAGE = {
  src: '/images/wedding-reception-1672.webp',
  srcSet: '/images/wedding-reception-900.webp 900w, /images/wedding-reception-1672.webp 1672w',
  sizes: '(max-width: 700px) 1672px, 100vw',
  blur: '/images/wedding-reception-blur.webp',
  w: 1672,
  h: 941,
  mono: { x: 0.505, y: 0.115, span: 0.16, wspan: 0.16 },
  couple: { x: 0.5, y: 0.63, span: 0.66, wspan: 0.4 },
  alt: 'Evening reception in a garden: the couple at the head of a white aisle lined with candle lanterns and white roses, beneath an ivory arch with the R|N monogram and a "Raihan weds Namira" backdrop, with chandeliers, fairy lights and applauding guests on either side',
}

// Fairy-light twinkles over the trees (deterministic pseudo-random spread).
export const RECEPTION_TWINKLES = (() => {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const pts = []
  for (let i = 0; i < 40; i++) {
    const left = i % 2 === 0
    pts.push([left ? 0.01 + rnd() * 0.26 : 0.73 + rnd() * 0.26, 0.03 + rnd() * 0.4])
  }
  return pts
})()
