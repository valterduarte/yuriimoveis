'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi'
import { API_URL } from '../../lib/config'
import type { BlogPost } from '../../types'

interface AdminBlogPostListProps {
  authHeader: () => Record<string, string>
  onEdit: (id: number) => void
  onAuthError: () => void
}

export default function AdminBlogPostList({ authHeader, onEdit, onAuthError }: AdminBlogPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blog?todos=true&limit=50`)
      setPosts(res.data.posts || [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPosts() }, [])

  const togglePublicado = async (post: BlogPost) => {
    try {
      await axios.put(`${API_URL}/api/blog/${post.id}`, { publicado: !post.publicado }, { headers: authHeader() })
      loadPosts()
    } catch (err) {
      const axiosErr = err as import('axios').AxiosError
      if (axiosErr.response?.status === 401) onAuthError()
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Carregando posts...</p>
  if (posts.length === 0) return <p className="text-sm text-gray-500">Nenhum post cadastrado.</p>

  return (
    <div className="space-y-3">
      {posts.map(post => (
        <div key={post.id} className={`bg-white border border-gray-200 p-4 flex items-center justify-between gap-4 ${!post.publicado ? 'opacity-60' : ''}`}>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-dark truncate">{post.titulo}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              /blog/{post.slug} &middot; {new Date(post.created_at).toLocaleDateString('pt-BR')}
              {!post.publicado && <span className="ml-2 text-amber-600 font-bold">RASCUNHO</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => togglePublicado(post)} className="p-2 text-gray-400 hover:text-primary transition-colors" title={post.publicado ? 'Despublicar' : 'Publicar'}>
              {post.publicado ? <FiEye size={14} /> : <FiEyeOff size={14} />}
            </button>
            <button onClick={() => onEdit(post.id)} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Editar">
              <FiEdit2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
