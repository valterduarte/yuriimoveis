'use client'

import { useRouter } from 'next/navigation'
import AdminBlogPostList from '../../../components/admin/AdminBlogPostList'
import { useAdminContext } from '../admin-context'

export default function AdminBlogPage() {
  const router = useRouter()
  const { authHeader, onAuthError } = useAdminContext()

  return (
    <AdminBlogPostList
      authHeader={authHeader}
      onAuthError={onAuthError}
      onEdit={(id) => router.push(`/admin/blog/${id}`)}
    />
  )
}
