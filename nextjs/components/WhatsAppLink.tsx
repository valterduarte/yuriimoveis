'use client'

import type { ReactNode, MouseEvent } from 'react'

interface WhatsAppLinkProps {
  href: string
  source: string
  className?: string
  children: ReactNode
  target?: string
  rel?: string
  'aria-label'?: string
}

function getDevice(): string {
  if (typeof window === 'undefined') return 'unknown'
  return window.innerWidth < 768 ? 'mobile' : 'desktop'
}

export default function WhatsAppLink({ href, source, children, ...rest }: WhatsAppLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    const payload = JSON.stringify({
      source,
      page: window.location.pathname,
      device: getDevice(),
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track-click', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track-click', { method: 'POST', body: payload, keepalive: true })
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
