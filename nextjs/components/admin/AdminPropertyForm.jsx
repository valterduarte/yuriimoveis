'use client'

import { useState, useEffect, useRef } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import axios from 'axios'
import { calcParcela } from '../../utils/imovelUtils'
import { API_URL, CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from '../../lib/config'
import { PROPERTY_CATEGORIES } from '../../lib/constants'

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

const EMPTY_FORM = {
  titulo: '', descricao: '', tipo: 'venda', categoria: 'apartamento',
  status: 'pronto',
  preco: '', parcela_display: '', parcela_label: '', area: '', quartos: '', banheiros: '', vagas: '',
  endereco: '', bairro: '', cidade: 'Osasco', cep: '',
  destaque: false, diferenciais: '',
}

function propertyToForm(property) {
  return {
    titulo:          property.titulo          || '',
    descricao:       property.descricao       || '',
    tipo:            property.tipo            || 'venda',
    categoria:       property.categoria       || 'apartamento',
    status:          property.status          || 'pronto',
    preco:           property.preco           || '',
    parcela_display: property.parcela_display || '',
    parcela_label:   property.parcela_label   || '',
    area:            property.area            || '',
    quartos:         property.quartos         || '',
    banheiros:       property.banheiros       || '',
    vagas:           property.vagas           || '',
    endereco:        property.endereco        || '',
    bairro:          property.bairro          || '',
    cidade:          property.cidade          || 'Osasco',
    cep:             property.cep             || '',
    destaque:        property.destaque        || false,
    diferenciais:    Array.isArray(property.diferenciais) ? property.diferenciais.join('\n') : '',
  }
}

export default function AdminPropertyForm({ editingId, authHeader, onSuccess, onAuthError }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageUrls, setImageUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!editingId) return
    axios.get(`${API_URL}/api/imoveis/${editingId}`)
      .then(res => {
        setForm(propertyToForm(res.data))
        setImageUrls(Array.isArray(res.data.imagens) ? res.data.imagens : [])
      })
      .catch(() => setError('Erro ao carregar imóvel.'))
  }, [editingId])

  const updateField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handlePriceChange = value => {
    setForm(f => ({ ...f, preco: value, parcela_display: value ? calcParcela(Number(value)) : '' }))
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setIsUploading(true)
    try {
      const uploaded = await Promise.all(files.map(async file => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', CLOUDINARY_PRESET)
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          data
        )
        return res.data.secure_url
      }))
      setImageUrls(prev => [...prev, ...uploaded])
    } catch {
      setError('Erro ao fazer upload das imagens.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = url => setImageUrls(prev => prev.filter(u => u !== url))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        preco:      Number(form.preco),
        area:       Number(form.area)      || 0,
        quartos:    Number(form.quartos)   || 0,
        banheiros:  Number(form.banheiros) || 0,
        vagas:      Number(form.vagas)     || 0,
        imagens:    imageUrls,
        diferenciais: form.diferenciais
          ? form.diferenciais.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
      }
      if (editingId) {
        await axios.put(`${API_URL}/api/imoveis/${editingId}`, payload, { headers: authHeader() })
        onSuccess('Imóvel atualizado com sucesso!')
      } else {
        const res = await axios.post(`${API_URL}/api/imoveis`, payload, { headers: authHeader() })
        onSuccess(`Imóvel cadastrado com sucesso! ID: ${res.data.id}`)
      }
    } catch (err) {
      if (err.response?.status === 401) onAuthError()
      else setError(err.response?.data?.error || 'Erro ao salvar.')
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
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Quartos</label>
              <input type="number" value={form.quartos} onChange={e => updateField('quartos', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Banheiros</label>
              <input type="number" value={form.banheiros} onChange={e => updateField('banheiros', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Vagas</label>
              <input type="number" value={form.vagas} onChange={e => updateField('vagas', e.target.value)}
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
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Descrição</h2>
        <p className="text-[10px] text-gray-400 mb-3">Use o template abaixo como base.</p>
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
        <button type="button" onClick={() => fileInputRef.current.click()} disabled={isUploading}
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
