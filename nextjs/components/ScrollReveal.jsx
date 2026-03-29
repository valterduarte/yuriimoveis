'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
      return
    }

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )

    const observeNew = () =>
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el))

    const timer = setTimeout(observeNew, 80)

    let debounce
    const mutObs = new MutationObserver(mutations => {
      if (mutations.some(m => m.addedNodes.length > 0)) {
        clearTimeout(debounce)
        debounce = setTimeout(observeNew, 100)
      }
    })
    const main = document.querySelector('main') || document.body
    mutObs.observe(main, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      clearTimeout(debounce)
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [pathname])

  return null
}
