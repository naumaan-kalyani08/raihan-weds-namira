import { Suspense, lazy } from 'react'

// /wedding-invitation → the wedding reception (also accepts the "weddiing" spelling).
// Everything else → the Dawat-e-Walima invitation.
const isReception = /\/wedd?i{1,2}ng-invitation(\/|\/index\.html)?$/i.test(window.location.pathname)
if (isReception) document.documentElement.dataset.page = 'reception'

const Page = isReception ? lazy(() => import('./reception/Reception.jsx')) : lazy(() => import('./App.jsx'))

export default function Root() {
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  )
}
