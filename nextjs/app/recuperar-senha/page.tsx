import ForgotPasswordForm from '../../components/admin/ForgotPasswordForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar senha',
  robots: { index: false, follow: false },
}

export default function RecuperarSenhaPage() {
  return <ForgotPasswordForm />
}
