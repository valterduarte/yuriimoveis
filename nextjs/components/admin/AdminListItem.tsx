import type { ReactNode } from 'react'

interface AdminListItemProps {
  title: string
  meta: ReactNode
  actions: ReactNode
  inactive?: boolean
}

export default function AdminListItem({ title, meta, actions, inactive = false }: AdminListItemProps) {
  return (
    <div className={`bg-white border border-gray-200 px-5 py-4 flex items-center justify-between gap-4 ${inactive ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-dark truncate">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{meta}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
    </div>
  )
}
