'use client'

import { useState, useEffect } from 'react'

interface Section {
  id: string
  label: string
}

const SCROLL_SPY_MARGIN = '-40% 0px -55% 0px'

export function useScrollSpy(sections: Section[], dependency: unknown) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    if (!dependency) return
    const observers: IntersectionObserver[] = []
    sections.forEach(section => {
      const el = document.getElementById(section.id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(section.id) },
        { rootMargin: SCROLL_SPY_MARGIN }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [dependency, sections])

  return { activeSection, setActiveSection }
}
