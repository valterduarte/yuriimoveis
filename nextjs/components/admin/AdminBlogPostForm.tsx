'use client'

import { useState, useEffect, useMemo } from 'react'
import { apiClient, isAuthError } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'
import { slugify } from '../../utils/imovelUtils'
import { useApiSubmit } from '../../hooks/useApiSubmit'
import { useDirtyFormWarning } from '../../hooks/useDirtyFormWarning'
import { fieldInput, fieldLabel } from './ui/styles'
import type { BlogPost } from '../../types'

interface BlogFormState {
  titulo: string
  slug: string
  resumo: string
  conteudo: string
  imagemCapa: string
  metaTitulo: string
  metaDescricao: string
  tagsText: string
  publicado: boolean
}

const EMPTY_FORM: BlogFormState = {
  titulo: '', slug: '', resumo: '', conteudo: '',
  imagemCapa: '', metaTitulo: '', metaDescricao: '',
  tagsText: '', publicado: false,
}

const EMPTY_SNAPSHOT = JSON.stringify(EMPTY_FORM)

interface AdminBlogPostFormProps {
  editingId: number | null
  authHeader: () => Record<string, string>
  onSuccess: (message: string) => void
  onAuthError: () => void
}

export default function AdminBlogPostForm({ editingId, authHeader, onSuccess, onAuthError }: AdminBlogPostFormProps) {
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM)
  // UI flag, not post data: whether the slug is hand-edited or auto-generated.
  const [slugManual, setSlugManual] = useState(false)
  const [initialSnapshot, setInitialSnapshot] = useState(EMPTY_SNAPSHOT)
  const [submitted, setSubmitted] = useState(false)
  const { loading, error, setError, submit } = useApiSubmit({ onAuthError, fallbackError: 'Erro ao salvar post.' })

  const update = <K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    if (!editingId) {
      setInitialSnapshot(EMPTY_SNAPSHOT)
      return
    }
    apiClient.get<BlogPost>(`${API_URL}/api/blog/${editingId}`, { headers: authHeader() })
      .then(post => {
        const loaded: BlogFormState = {
          titulo: post.titulo,
          slug: post.slug,
          resumo: post.resumo,
          conteudo: post.conteudo,
          imagemCapa: post.imagem_capa,
          metaTitulo: post.meta_titulo,
          metaDescricao: post.meta_descricao,
          tagsText: post.tags.join(', '),
          publicado: post.publicado,
        }
        setForm(loaded)
        setSlugManual(true)
        setInitialSnapshot(JSON.stringify(loaded))
      })
      .catch(err => {
        if (isAuthError(err)) onAuthError()
        else setError('Erro ao carregar post.')
      })
  }, [editingId, authHeader, onAuthError, setError])

  const isDirty = useMemo(
    () => !submitted && JSON.stringify(form) !== initialSnapshot,
    [form, initialSnapshot, submitted],
  )
  useDirtyFormWarning(isDirty)

  useEffect(() => {
    if (!slugManual && form.titulo) {
      setForm(f => ({ ...f, slug: slugify(f.titulo) }))
    }
  }, [form.titulo, slugManual])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const tags = form.tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      titulo: form.titulo,
      slug: form.slug,
      resumo: form.resumo,
      conteudo: form.conteudo,
      imagem_capa: form.imagemCapa,
      meta_titulo: form.metaTitulo,
      meta_descricao: form.metaDescricao,
      tags,
      publicado: form.publicado,
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
        setForm(EMPTY_FORM)
        setSlugManual(false)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-600 text-sm bg-red-50 rounded-md border border-red-200 px-3 py-2">{error}</p>}

      <div>
        <label className={fieldLabel}>Título *</label>
        <input type="text" value={form.titulo} onChange={e => update('titulo', e.target.value)} className={fieldInput} required />
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
          value={form.slug}
          onChange={e => { update('slug', e.target.value); setSlugManual(true) }}
          className={`${fieldInput} ${!slugManual ? 'bg-gray-50 text-gray-500' : ''}`}
          readOnly={!slugManual}
          required
        />
        <p className="text-xs text-gray-500 mt-1">URL: /blog/{form.slug || '...'}</p>
      </div>

      <div>
        <label className={fieldLabel}>Resumo</label>
        <textarea value={form.resumo} onChange={e => update('resumo', e.target.value)} className={fieldInput} rows={2} maxLength={500} />
        <p className="text-xs text-gray-500 mt-1">{form.resumo.length}/500 — aparece na listagem do blog</p>
      </div>

      <div>
        <label className={fieldLabel}>Conteúdo (HTML)</label>
        <textarea value={form.conteudo} onChange={e => update('conteudo', e.target.value)} className={`${fieldInput} font-mono text-xs`} rows={15} />
        <p className="text-xs text-gray-500 mt-1">Use tags HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;a&gt;</p>
      </div>

      <div>
        <label className={fieldLabel}>Imagem de capa (URL)</label>
        <input type="text" value={form.imagemCapa} onChange={e => update('imagemCapa', e.target.value)} className={fieldInput} placeholder="https://res.cloudinary.com/..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel}>Meta título (SEO)</label>
          <input type="text" value={form.metaTitulo} onChange={e => update('metaTitulo', e.target.value)} className={fieldInput} maxLength={200} />
          <p className="text-xs text-gray-500 mt-1">{form.metaTitulo.length}/200</p>
        </div>
        <div>
          <label className={fieldLabel}>Meta descrição (SEO)</label>
          <input type="text" value={form.metaDescricao} onChange={e => update('metaDescricao', e.target.value)} className={fieldInput} maxLength={300} />
          <p className="text-xs text-gray-500 mt-1">{form.metaDescricao.length}/300</p>
        </div>
      </div>

      <div>
        <label className={fieldLabel}>Tags (separadas por vírgula)</label>
        <input type="text" value={form.tagsText} onChange={e => update('tagsText', e.target.value)} className={fieldInput} placeholder="osasco, financiamento, dicas" />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="publicado" checked={form.publicado} onChange={e => update('publicado', e.target.checked)} className="w-4 h-4" />
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
