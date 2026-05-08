import Link from 'next/link'
import type { ReactNode } from 'react'

interface FilterChipProps {
  href: string
  active?: boolean
  children: ReactNode
}

const ACTIVE = 'bg-primary border-primary text-white'
const INACTIVE = 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'

export function FilterChip({ href, active = false, children }: FilterChipProps) {
  return (
    <li>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 border px-3 py-2 text-xs transition-colors ${active ? ACTIVE : INACTIVE}`}
      >
        {children}
      </Link>
    </li>
  )
}

export function FilterChipList({ children }: { children: ReactNode }) {
  return <ul className="flex flex-wrap gap-2">{children}</ul>
}
