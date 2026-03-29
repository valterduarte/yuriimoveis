import { useState, useEffect } from 'react'

const SCROLL_SPY_MARGIN = '-40% 0px -55% 0px'

export function useScrollSpy(sections, dependency) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    if (!dependency) return
    const observers = []
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
