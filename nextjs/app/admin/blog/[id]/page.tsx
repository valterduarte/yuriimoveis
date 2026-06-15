'use client'

import { useParams, useRouter } from 'next/navigation'
import AdminBlogPostForm from '../../../../components/admin/AdminBlogPostForm'
import { useAdminContext } from '../../admin-context'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { authHeader, onAuthError, setMessage } = useAdminContext()

  const editingId = Number(params.id)

  return (
    <AdminBlogPostForm
      editingId={Number.isFinite(editingId) ? editingId : null}
      authHeader={authHeader}
      onAuthError={onAuthError}
      onSuccess={(message) => {
        setMessage({ type: 'success', text: message })
        router.push('/admin/blog')
      }}
    />
  )
}
