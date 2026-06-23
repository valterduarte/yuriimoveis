import type { ReactNode } from 'react'

/**
 * Centered card shell shared by the logged-out auth screens (forgot/reset
 * password) so they match the admin login without duplicating the markup.
 */
export default function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-md border border-gray-300 p-8 w-full max-w-sm">
        <h1 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">{title}</h1>
        {children}
      </div>
    </div>
  )
}
