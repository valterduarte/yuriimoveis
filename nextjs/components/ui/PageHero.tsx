import Link from 'next/link'
import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  breadcrumbs: BreadcrumbItem[]
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  extra?: ReactNode
}

export default function PageHero({ breadcrumbs, eyebrow, title, description, extra }: PageHeroProps) {
  return (
    <div className="bg-dark text-white py-12">
      <div className="container mx-auto px-6">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap" aria-label="Breadcrumb">
          {breadcrumbs.map((item, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <span key={i} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                ) : (
                  <span className="text-white" aria-current={isLast ? 'page' : undefined}>{item.label}</span>
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </span>
            )
          })}
        </nav>
        {eyebrow && <span className="section-label flex items-center gap-2">{eyebrow}</span>}
        <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{title}</h1>
        {description && (
          <p className="text-gray-400 text-sm mt-3 max-w-3xl leading-relaxed">{description}</p>
        )}
        {extra}
      </div>
    </div>
  )
}
