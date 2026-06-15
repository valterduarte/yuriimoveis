'use client'

import { useRouter } from 'next/navigation'
import AdminPropertyForm from '../../../../components/admin/AdminPropertyForm'
import { useAdminContext } from '../../admin-context'

export default function NovoImovelPage() {
  const router = useRouter()
  const { authHeader, onAuthError, setMessage } = useAdminContext()

  return (
    <AdminPropertyForm
      editingId={null}
      authHeader={authHeader}
      onAuthError={onAuthError}
      onSuccess={(message) => {
        setMessage({ type: 'success', text: message })
        router.push('/admin/imoveis')
      }}
    />
  )
}
