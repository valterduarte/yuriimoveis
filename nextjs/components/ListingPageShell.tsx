import Link from 'next/link'
import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  name: string
  path: string
}

interface ListingPageShellProps {
  jsonLd: Record<string, unknown>[]
  breadcrumb: BreadcrumbItem[]
  label: string
  h1: string
  total: number
  children: ReactNode
}

export default function ListingPageShell({ jsonLd, breadcrumb, label, h1, total, children }: ListingPageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap" aria-label="Breadcrumb">
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1
              return (
                <span key={item.path} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {isLast
                    ? <span className="text-white" aria-current="page">{item.name}</span>
                    : <Link href={item.path} className="hover:text-white transition-colors">{item.name}</Link>}
                </span>
              )
            })}
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      {children}
    </div>
  )
}
