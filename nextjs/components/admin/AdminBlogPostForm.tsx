'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../lib/config'
import type { BlogPost } from '../../types'

interface AdminBlogPostFormProps {
  editingId: number | null
  authHeader: () => Record<string, string>
  onSuccess: (message: string) => void
  onAuthError: () => void
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminBlogPostForm({ editingId, authHeader, onSuccess, onAuthError }: AdminBlogPostFormProps) {
  const [titulo, setTitulo] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [resumo, setResumo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [imagemCapa, setImagemCapa] = useState('')
  const [metaTitulo, setMetaTitulo] = useState('')
  const [metaDescricao, setMetaDescricao] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [publicado, setPublicado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingId) {
      axios.get(`${API_URL}/api/blog/${editingId}`, { headers: authHeader() })
        .then(res => {
          const post: BlogPost = res.data
          setTitulo(post.titulo)
          setSlug(post.slug)
          setSlugManual(true)
          setResumo(post.resumo)
          setConteudo(post.conteudo)
          setImagemCapa(post.imagem_capa)
          setMetaTitulo(post.meta_titulo)
          setMetaDescricao(post.meta_descricao)
          setTagsText(post.tags.join(', '))
          setPublicado(post.publicado)
        })
        .catch(err => {
          if (err.response?.status === 401) onAuthError()
          else setError('Erro ao carregar post.')
        })
    }
  }, [editingId, authHeader, onAuthError])

  useEffect(() => {
    if (!slugManual && titulo) {
      setSlug(slugify(titulo))
    }
  }, [titulo, slugManual])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      titulo, slug, resumo, conteudo,
      imagem_capa: imagemCapa,
      meta_titulo: metaTitulo,
      meta_descricao: metaDescricao,
      tags, publicado,
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/blog/${editingId}`, payload, { headers: authHeader() })
        onSuccess('Post atualizado com sucesso!')
      } else {
        await axios.post(`${API_URL}/api/blog`, payload, { headers: authHeader() })
        onSuccess('Post criado com sucesso!')
        setTitulo(''); setSlug(''); setSlugManual(false); setResumo(''); setConteudo('')
        setImagemCapa(''); setMetaTitulo(''); setMetaDescricao(''); setTagsText(''); setPublicado(false)
      }
    } catch (err) {
      const axiosErr = err as import('axios').AxiosError<{ error: string }>
      if (axiosErr.response?.status === 401) onAuthError()
      else setError(axiosErr.response?.data?.error || 'Erro ao salvar post.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary'
  const labelClass = 'block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

      <div>
        <label className={labelClass}>Título *</label>
        <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>
          Slug *
          <button type="button" onClick={() => setSlugManual(!slugManual)} className="ml-2 text-primary font-normal normal-case">
            {slugManual ? '(gerar automático)' : '(editar manualmente)'}
          </button>
        </label>
        <input
          type="text"
          value={slug}
          onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
          className={`${inputClass} ${!slugManual ? 'bg-gray-50 text-gray-500' : ''}`}
          readOnly={!slugManual}
          required
        />
        <p className="text-xs text-gray-400 mt-1">URL: /blog/{slug || '...'}</p>
      </div>

      <div>
        <label className={labelClass}>Resumo</label>
        <textarea value={resumo} onChange={e => setResumo(e.target.value)} className={inputClass} rows={2} maxLength={500} />
        <p className="text-xs text-gray-400 mt-1">{resumo.length}/500 — aparece na listagem do blog</p>
      </div>

      <div>
        <label className={labelClass}>Conteúdo (HTML)</label>
        <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} className={`${inputClass} font-mono text-xs`} rows={15} />
        <p className="text-xs text-gray-400 mt-1">Use tags HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;a&gt;</p>
      </div>

      <div>
        <label className={labelClass}>Imagem de capa (URL)</label>
        <input type="text" value={imagemCapa} onChange={e => setImagemCapa(e.target.value)} className={inputClass} placeholder="https://res.cloudinary.com/..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Meta título (SEO)</label>
          <input type="text" value={metaTitulo} onChange={e => setMetaTitulo(e.target.value)} className={inputClass} maxLength={200} />
          <p className="text-xs text-gray-400 mt-1">{metaTitulo.length}/200</p>
        </div>
        <div>
          <label className={labelClass}>Meta descrição (SEO)</label>
          <input type="text" value={metaDescricao} onChange={e => setMetaDescricao(e.target.value)} className={inputClass} maxLength={300} />
          <p className="text-xs text-gray-400 mt-1">{metaDescricao.length}/300</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (separadas por vírgula)</label>
        <input type="text" value={tagsText} onChange={e => setTagsText(e.target.value)} className={inputClass} placeholder="osasco, financiamento, dicas" />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="publicado" checked={publicado} onChange={e => setPublicado(e.target.checked)} className="w-4 h-4" />
        <label htmlFor="publicado" className="text-sm text-gray-700">Publicar imediatamente</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-xs disabled:opacity-50"
      >
        {loading ? 'Salvando...' : editingId ? 'Atualizar Post' : 'Criar Post'}
      </button>
    </form>
  )
}
