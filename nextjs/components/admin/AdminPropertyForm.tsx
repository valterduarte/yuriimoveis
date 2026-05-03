'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { ApiError, apiClient, isAuthError } from '../../lib/apiClient'
import { calcParcela } from '../../utils/imovelUtils'
import { API_URL, CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from '../../lib/config'
import BasicInfoSection from './property-form/BasicInfoSection'
import LocationSection from './property-form/LocationSection'
import DescriptionSection from './property-form/DescriptionSection'
import DescriptionSeoSection from './property-form/DescriptionSeoSection'
import DifferentialsSection from './property-form/DifferentialsSection'
import PhotosSection from './property-form/PhotosSection'
import { EMPTY_FORM, type FormState, type UpdateField } from './property-form/types'
import type { Imovel } from '../../types'

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

  useEffect(() => {
    if (!editingId) return
    apiClient.get<Imovel>(`${API_URL}/api/imoveis/${editingId}`)
      .then(imovel => {
        setForm(propertyToForm(imovel))
        setImageUrls(Array.isArray(imovel.imagens) ? imovel.imagens : [])
      })
      .catch(() => setError('Erro ao carregar imóvel.'))
  }, [editingId])

  const updateField: UpdateField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handlePriceChange = (value: string) => {
    setForm(f => ({ ...f, preco: value, parcela_display: value ? calcParcela(Number(value)) : '' }))
  }

  const handleCoordsChange = (coords: { lat: number; lng: number }) => {
    setForm(f => ({ ...f, lat: coords.lat.toFixed(6), lng: coords.lng.toFixed(6) }))
  }

  const handleClearCoords = () => {
    setForm(f => ({ ...f, lat: '', lng: '' }))
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

      <BasicInfoSection form={form} updateField={updateField} onPriceChange={handlePriceChange} />
      <LocationSection
        form={form}
        updateField={updateField}
        onCoordsChange={handleCoordsChange}
        onClearCoords={handleClearCoords}
      />
      <DescriptionSection form={form} updateField={updateField} />
      <DescriptionSeoSection form={form} updateField={updateField} />
      <DifferentialsSection form={form} updateField={updateField} />
      <PhotosSection
        imageUrls={imageUrls}
        isUploading={isUploading}
        onUpload={handleUpload}
        onRemove={removeImage}
      />

      <button type="submit" disabled={loading}
        className="w-full btn-primary py-4 text-sm uppercase tracking-widest font-bold disabled:opacity-50">
        {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
      </button>
    </form>
  )
}
