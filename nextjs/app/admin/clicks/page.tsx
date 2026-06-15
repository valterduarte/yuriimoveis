'use client'

import AdminClickStats from '../../../components/admin/AdminClickStats'
import { useAdminContext } from '../admin-context'

export default function AdminClicksPage() {
  const { authHeader, onAuthError } = useAdminContext()
  return <AdminClickStats authHeader={authHeader} onAuthError={onAuthError} />
}
