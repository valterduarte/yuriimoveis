import { Suspense } from 'react'
import ResetPasswordForm from '../../components/admin/ResetPasswordForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redefinir senha',
  robots: { index: false, follow: false },
}

export default function RedefinirSenhaPage() {
  // ResetPasswordForm reads the token via useSearchParams, which requires a
  // Suspense boundary in the App Router.
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" aria-hidden="true" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
