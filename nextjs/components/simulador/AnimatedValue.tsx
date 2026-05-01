'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedValueProps {
  value: number
  formatter: (n: number) => string
  durationMs?: number
}

const DEFAULT_DURATION_MS = 350

export default function AnimatedValue({ value, formatter, durationMs = DEFAULT_DURATION_MS }: AnimatedValueProps) {
  const [display, setDisplay] = useState(value)
  const previous = useRef(value)

  useEffect(() => {
    const from = previous.current
    const to = value
    previous.current = to
    if (from === to) return

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, durationMs])

  return <>{formatter(display)}</>
}
