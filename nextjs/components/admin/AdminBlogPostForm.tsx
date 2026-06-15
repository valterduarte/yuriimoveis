'use client'

import { useState, useEffect, useMemo } from 'react'
import { apiClient, isAuthError } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'
import { slugify } from '../../utils/imovelUtils'
import { useApiSubmit } from '../../hooks/useApiSubmit'
import { useDirtyFormWarning } from '../../hooks/useDirtyFormWarning'
import { fieldInput, fieldLabel } from './ui/styles'
import type { BlogPost } from '../../types'

const EMPTY_SNAPSHOT = JSON.stringify({
  titulo: '', slug: '', resumo: '', conteudo: '',
  imagemCapa: '', metaTitulo: '', metaDescricao: '',
  tagsText: '', publicado: false,
})

interface AdminBlogPostFormProps {
  editingId: number | null
  authHeader: () => Record<string, string>
  onSuccess: (message: string) => void
  onAuthError: () => void
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
  const [initialSnapshot, setInitialSnapshot] = useState(EMPTY_SNAPSHOT)
  const [submitted, setSubmitted] = useState(false)
  const { loading, error, setError, submit } = useApiSubmit({ onAuthError, fallbackError: 'Erro ao salvar post.' })

  useEffect(() => {
    if (!editingId) {
      setInitialSnapshot(EMPTY_SNAPSHOT)
      return
    }
    apiClient.get<BlogPost>(`${API_URL}/api/blog/${editingId}`, { headers: authHeader() })
      .then(post => {
        const loaded = {
          titulo: post.titulo, slug: post.slug, resumo: post.resumo, conteudo: post.conteudo,
          imagemCapa: post.imagem_capa, metaTitulo: post.meta_titulo, metaDescricao: post.meta_descricao,
          tagsText: post.tags.join(', '), publicado: post.publicado,
        }
        setTitulo(loaded.titulo)
        setSlug(loaded.slug)
        setSlugManual(true)
        setResumo(loaded.resumo)
        setConteudo(loaded.conteudo)
        setImagemCapa(loaded.imagemCapa)
        setMetaTitulo(loaded.metaTitulo)
        setMetaDescricao(loaded.metaDescricao)
        setTagsText(loaded.tagsText)
        setPublicado(loaded.publicado)
        setInitialSnapshot(JSON.stringify(loaded))
      })
      .catch(err => {
        if (isAuthError(err)) onAuthError()
        else setError('Erro ao carregar post.')
      })
  }, [editingId, authHeader, onAuthError, setError])

  const isDirty = useMemo(() => {
    if (submitted) return false
    const current = JSON.stringify({
      titulo, slug, resumo, conteudo,
      imagemCapa, metaTitulo, metaDescricao, tagsText, publicado,
    })
    return current !== initialSnapshot
  }, [titulo, slug, resumo, conteudo, imagemCapa, metaTitulo, metaDescricao, tagsText, publicado, initialSnapshot, submitted])
  useDirtyFormWarning(isDirty)

  useEffect(() => {
    if (!slugManual && titulo) {
      setSlug(slugify(titulo))
    }
  }, [titulo, slugManual])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    await submit(async () => {
      if (editingId) {
        await apiClient.put(`${API_URL}/api/blog/${editingId}`, payload, { headers: authHeader() })
        setSubmitted(true)
        onSuccess('Post atualizado com sucesso!')
      } else {
        await apiClient.post(`${API_URL}/api/blog`, payload, { headers: authHeader() })
        setSubmitted(true)
        onSuccess('Post criado com sucesso!')
        setTitulo(''); setSlug(''); setSlugManual(false); setResumo(''); setConteudo('')
        setImagemCapa(''); setMetaTitulo(''); setMetaDescricao(''); setTagsText(''); setPublicado(false)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-600 text-sm bg-red-50 rounded-md border border-red-200 px-3 py-2">{error}</p>}

      <div>
        <label className={fieldLabel}>Título *</label>
        <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} className={fieldInput} required />
      </div>

      <div>
        <label className={fieldLabel}>
          Slug *
          <button type="button" onClick={() => setSlugManual(!slugManual)} className="ml-2 text-primary font-normal normal-case">
            {slugManual ? '(gerar automático)' : '(editar manualmente)'}
          </button>
        </label>
        <input
          type="text"
          value={slug}
          onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
          className={`${fieldInput} ${!slugManual ? 'bg-gray-50 text-gray-500' : ''}`}
          readOnly={!slugManual}
          required
        />
        <p className="text-xs text-gray-500 mt-1">URL: /blog/{slug || '...'}</p>
      </div>

      <div>
        <label className={fieldLabel}>Resumo</label>
        <textarea value={resumo} onChange={e => setResumo(e.target.value)} className={fieldInput} rows={2} maxLength={500} />
        <p className="text-xs text-gray-500 mt-1">{resumo.length}/500 — aparece na listagem do blog</p>
      </div>

      <div>
        <label className={fieldLabel}>Conteúdo (HTML)</label>
        <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} className={`${fieldInput} font-mono text-xs`} rows={15} />
        <p className="text-xs text-gray-500 mt-1">Use tags HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;a&gt;</p>
      </div>

      <div>
        <label className={fieldLabel}>Imagem de capa (URL)</label>
        <input type="text" value={imagemCapa} onChange={e => setImagemCapa(e.target.value)} className={fieldInput} placeholder="https://res.cloudinary.com/..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel}>Meta título (SEO)</label>
          <input type="text" value={metaTitulo} onChange={e => setMetaTitulo(e.target.value)} className={fieldInput} maxLength={200} />
          <p className="text-xs text-gray-500 mt-1">{metaTitulo.length}/200</p>
        </div>
        <div>
          <label className={fieldLabel}>Meta descrição (SEO)</label>
          <input type="text" value={metaDescricao} onChange={e => setMetaDescricao(e.target.value)} className={fieldInput} maxLength={300} />
          <p className="text-xs text-gray-500 mt-1">{metaDescricao.length}/300</p>
        </div>
      </div>

      <div>
        <label className={fieldLabel}>Tags (separadas por vírgula)</label>
        <input type="text" value={tagsText} onChange={e => setTagsText(e.target.value)} className={fieldInput} placeholder="osasco, financiamento, dicas" />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="publicado" checked={publicado} onChange={e => setPublicado(e.target.checked)} className="w-4 h-4" />
        <label htmlFor="publicado" className="text-sm text-gray-700">Publicar imediatamente</label>
      </div>

      {isDirty && (
        <p role="status" className="text-xs uppercase tracking-wide font-bold text-amber-600 text-center">
          Alterações não salvas
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary rounded-md w-full py-3 text-xs disabled:opacity-50"
      >
        {loading ? 'Salvando...' : editingId ? 'Atualizar Post' : 'Criar Post'}
      </button>
    </form>
  )
}
