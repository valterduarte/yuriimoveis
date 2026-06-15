'use client'

import { useRouter } from 'next/navigation'
import AdminBlogPostForm from '../../../../components/admin/AdminBlogPostForm'
import { useAdminContext } from '../../admin-context'

export default function NovoPostPage() {
  const router = useRouter()
  const { authHeader, onAuthError, setMessage } = useAdminContext()

  return (
    <AdminBlogPostForm
      editingId={null}
      authHeader={authHeader}
      onAuthError={onAuthError}
      onSuccess={(message) => {
        setMessage({ type: 'success', text: message })
        router.push('/admin/blog')
      }}
    />
  )
}
