'use client'

import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import dynamic from 'next/dynamic'
import { FiUpload, FiX } from 'react-icons/fi'
import { ApiError, apiClient, isAuthError } from '../../lib/apiClient'
import { calcParcela } from '../../utils/imovelUtils'
import { API_URL, CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from '../../lib/config'
import { PROPERTY_CATEGORIES } from '../../lib/constants'
import type { Imovel } from '../../types'

const AdminLocationPicker = dynamic(() => import('./AdminLocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs uppercase tracking-widest">
      Carregando mapa…
    </div>
  ),
})

const DESCRIPTION_TEMPLATE = `🏢 NOME DO EMPREENDIMENTO – CIDADE

✨ Subtítulo chamativo!
Conforto, segurança e lazer completo para você e sua família.

▶️ Ponto de destaque 1
▶️ Ponto de destaque 2
▶️ Ponto de destaque 3

🔑 Diferenciais do empreendimento:
✔ Item 1
✔ Item 2
✔ Item 3

📐 Plantas disponíveis:
X dormitórios — XXm²
A partir de *R$ 000.000`

interface FormState {
  titulo: string
  descricao: string
  descricao_seo: string
  tipo: string
  categoria: string
  status: string
  preco: string
  parcela_display: string
  parcela_label: string
  area: string
  area_display: string
  quartos: string
  banheiros: string
  vagas: string
  vagas_display: string
  endereco: string
  bairro: string
  cidade: string
  cep: string
  destaque: boolean
  diferenciais: string
  lat: string
  lng: string
}

const EMPTY_FORM: FormState = {
  titulo: '', descricao: '', descricao_seo: '', tipo: 'venda', categoria: 'apartamento',
  status: 'pronto',
  preco: '', parcela_display: '', parcela_label: '', area: '', area_display: '', quartos: '', banheiros: '', vagas: '', vagas_display: '',
  endereco: '', bairro: '', cidade: 'Osasco', cep: '',
  destaque: false, diferenciais: '',
  lat: '', lng: '',
}

function propertyToForm(property: Imovel): FormState {
  return {
    titulo:          property.titulo          || '',
    descricao:       property.descricao       || '',
    descricao_seo:   property.descricao_seo   || '',
    tipo:            property.tipo            || 'venda',
    categoria:       property.categoria       || 'apartamento',
    status:          property.status          || 'pronto',
    preco:           String(property.preco)   || '',
    parcela_display: property.parcela_display || '',
    parcela_label:   property.parcela_label   || '',
    area:            String(property.area)    || '',
    area_display:    property.area_display    || '',
    quartos:         String(property.quartos) || '',
    banheiros:       String(property.banheiros) || '',
    vagas:           String(property.vagas)   || '',
    vagas_display:   property.vagas_display   || '',
    endereco:        property.endereco        || '',
    bairro:          property.bairro          || '',
    cidade:          property.cidade          || 'Osasco',
    cep:             property.cep             || '',
    destaque:        property.destaque        || false,
    diferenciais:    Array.isArray(property.diferenciais) ? property.diferenciais.join('\n') : '',
    lat:             property.lat != null ? String(property.lat) : '',
    lng:             property.lng != null ? String(property.lng) : '',
  }
}

interface AdminPropertyFormProps {
  editingId: number | null
  authHeader: () => Record<string, string>
  onSuccess: (message: string) => void
  onAuthError: () => void
}

export default function AdminPropertyForm({ editingId, authHeader, onSuccess, onAuthError }: AdminPropertyFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editingId) return
    apiClient.get<Imovel>(`${API_URL}/api/imoveis/${editingId}`)
      .then(imovel => {
        setForm(propertyToForm(imovel))
        setImageUrls(Array.isArray(imovel.imagens) ? imovel.imagens : [])
      })
      .catch(() => setError('Erro ao carregar imóvel.'))
  }, [editingId])

  const updateField = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }))

  const handlePriceChange = (value: string) => {
    setForm(f => ({ ...f, preco: value, parcela_display: value ? calcParcela(Number(value)) : '' }))
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setIsUploading(true)
    try {
      const uploaded = await Promise.all(files.map(async file => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', CLOUDINARY_PRESET)
        const result = await apiClient.post<{ secure_url: string }>(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          data,
        )
        return result.secure_url
      }))
      setImageUrls(prev => [...prev, ...uploaded])
    } catch {
      setError('Erro ao fazer upload das imagens.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (url: string) => setImageUrls(prev => prev.filter(u => u !== url))

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        descricao_seo: form.descricao_seo || '',
        preco:      Number(form.preco),
        area:       Number(form.area)      || 0,
        quartos:    Number(form.quartos)   || 0,
        banheiros:  Number(form.banheiros) || 0,
        vagas:      Number(form.vagas)     || 0,
        imagens:    imageUrls,
        diferenciais: form.diferenciais
          ? form.diferenciais.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      }
      if (editingId) {
        await apiClient.put(`${API_URL}/api/imoveis/${editingId}`, payload, { headers: authHeader() })
        onSuccess('Imóvel atualizado com sucesso!')
      } else {
        const created = await apiClient.post<{ id: number }>(`${API_URL}/api/imoveis`, payload, { headers: authHeader() })
        onSuccess(`Imóvel cadastrado com sucesso! ID: ${created.id}`)
      }
    } catch (err) {
      if (isAuthError(err)) {
        onAuthError()
      } else if (err instanceof ApiError && typeof err.data === 'object' && err.data !== null && 'error' in err.data) {
        setError(String((err.data as { error: unknown }).error) || 'Erro ao salvar.')
      } else {
        setError('Erro ao salvar.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="px-4 py-3 text-sm border border-red-300 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-5">Informações Básicas</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Título *</label>
            <input
              value={form.titulo}
              onChange={e => updateField('titulo', e.target.value)}
              required
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Finalidade *</label>
              <select value={form.tipo} onChange={e => updateField('tipo', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Categoria *</label>
              <select value={form.categoria} onChange={e => updateField('categoria', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                {PROPERTY_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Status</label>
              <select value={form.status} onChange={e => updateField('status', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                <option value="pronto">Pronto para morar</option>
                <option value="construcao">Em construção</option>
                <option value="planta">Na planta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Preço (R$) *</label>
              <input type="number" value={form.preco} onChange={e => handlePriceChange(e.target.value)} required
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Parcela display</label>
              <input value={form.parcela_display} onChange={e => updateField('parcela_display', e.target.value)}
                placeholder="Auto-calculado ao preencher preço"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Label da parcela</label>
              <input value={form.parcela_label} onChange={e => updateField('parcela_label', e.target.value)}
                placeholder="Ex: Período Obras"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Área (m²)</label>
              <input type="number" value={form.area} onChange={e => updateField('area', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Área exibida no site</label>
              <input value={form.area_display} onChange={e => updateField('area_display', e.target.value)}
                placeholder="Ex: 26 a 49 m²"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Quartos</label>
              <input type="number" value={form.quartos} onChange={e => updateField('quartos', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Banheiros</label>
              <input type="number" value={form.banheiros} onChange={e => updateField('banheiros', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Vagas</label>
              <input type="number" value={form.vagas} onChange={e => updateField('vagas', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Vagas exibida no site</label>
              <input value={form.vagas_display} onChange={e => updateField('vagas_display', e.target.value)}
                placeholder="Ex: 1 a 2 vagas"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="destaque" checked={form.destaque}
              onChange={e => updateField('destaque', e.target.checked)}
              className="w-4 h-4 accent-primary" />
            <label htmlFor="destaque" className="text-xs text-gray-600 uppercase tracking-widest font-bold">
              Imóvel em destaque
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-5">Localização</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Endereço</label>
            <input value={form.endereco} onChange={e => updateField('endereco', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Bairro</label>
              <input value={form.bairro} onChange={e => updateField('bairro', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Cidade</label>
              <input value={form.cidade} onChange={e => updateField('cidade', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-baseline justify-between mb-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Posição no mapa
              </label>
              <p className="text-[10px] text-gray-400">
                Clique no mapa pra fixar o pino. Arraste pra ajustar.
              </p>
            </div>
            <div className="border border-gray-200" style={{ height: 320 }}>
              <AdminLocationPicker
                value={
                  form.lat && form.lng
                    ? { lat: Number(form.lat), lng: Number(form.lng) }
                    : null
                }
                bairro={form.bairro}
                cidade={form.cidade}
                onChange={(coords) =>
                  setForm(f => ({ ...f, lat: coords.lat.toFixed(6), lng: coords.lng.toFixed(6) }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Latitude</label>
                <input
                  value={form.lat}
                  onChange={e => updateField('lat', e.target.value)}
                  inputMode="decimal"
                  placeholder="-23.5329"
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Longitude</label>
                <input
                  value={form.lng}
                  onChange={e => updateField('lng', e.target.value)}
                  inputMode="decimal"
                  placeholder="-46.7917"
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            {form.lat && form.lng && (
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, lat: '', lng: '' }))}
                className="mt-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-primary font-bold"
              >
                Limpar coordenadas (volta ao centroide do bairro)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Descrição</h2>
        <p className="text-[10px] text-gray-400 mb-3">Use o template abaixo como base. Pode usar emojis e formatação livre.</p>
        <div className="bg-gray-50 border border-dashed border-gray-300 p-4 mb-3 text-xs text-gray-500 font-mono leading-relaxed whitespace-pre-line">
          {DESCRIPTION_TEMPLATE}
        </div>
        <textarea value={form.descricao} onChange={e => updateField('descricao', e.target.value)} rows={14}
          placeholder="Cole o template acima e edite..."
          className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y font-mono" />
        <button type="button" onClick={() => updateField('descricao', DESCRIPTION_TEMPLATE)}
          className="mt-2 text-[10px] uppercase tracking-widest text-primary font-bold hover:underline">
          Preencher com template
        </button>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Descrição SEO</h2>
        <p className="text-[10px] text-gray-400 mb-3">
          Texto corrido para o Google. Sem emojis. Mencione: tipo, bairro, cidade, características principais. 150–300 palavras.
        </p>
        <div className="bg-amber-50 border border-amber-200 px-3 py-2 mb-3 text-[10px] text-amber-700 leading-relaxed">
          Exemplo: &quot;Apartamento 2 dormitórios com terraço gourmet à venda no Rochdale, Osasco SP. Condomínio LOOK com piscina, academia e 392 unidades. Financiamento disponível. Atendimento com o Corretor Yuri — (11) 97256-3420.&quot;
        </div>
        <textarea
          value={form.descricao_seo}
          onChange={e => updateField('descricao_seo', e.target.value)}
          rows={6}
          placeholder="Escreva um texto corrido, sem emojis, focado em palavras-chave de busca..."
          className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y"
        />
        <p className="mt-1.5 text-[10px] text-gray-400">
          {form.descricao_seo.length} caracteres {form.descricao_seo.length > 0 && form.descricao_seo.length < 150 ? '— recomendado: mínimo 150' : ''}
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Diferenciais</h2>
        <p className="text-[10px] text-gray-400 mb-3">Um item por linha. Ex: Piscina aquecida</p>
        <textarea value={form.diferenciais} onChange={e => updateField('diferenciais', e.target.value)} rows={5}
          placeholder={"Piscina aquecida\nPortaria 24h\nAcademia"}
          className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y" />
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Imagens</h2>
        <p className="text-[10px] text-gray-400 mb-4">Selecione uma ou mais fotos do seu computador.</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
          className="flex items-center gap-2 border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 w-full justify-center">
          <FiUpload size={14} />
          {isUploading ? 'Enviando...' : 'Selecionar fotos'}
        </button>
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-full h-24 object-cover border border-gray-200" />
                <button type="button" onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}
        className="w-full btn-primary py-4 text-sm uppercase tracking-widest font-bold disabled:opacity-50">
        {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
      </button>
    </form>
  )
}
