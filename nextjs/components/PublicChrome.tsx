'use client'

import { usePathname } from 'next/navigation'

function useIsAdmin() {
  const pathname = usePathname()
  return !!pathname?.startsWith('/admin')
}

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin()
  if (isAdmin) return null
  return <>{children}</>
}

export function MainContent({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin()
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`flex-1 focus:outline-none ${isAdmin ? '' : 'pt-16 md:pt-20'}`}
    >
      {children}
    </main>
  )
}
