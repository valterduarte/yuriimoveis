'use client'

import { calcParcela } from '../../../utils/imovelUtils'
import { PROPERTY_CATEGORIES } from '../../../lib/constants'
import type { FormState, UpdateField } from './types'

interface BasicInfoSectionProps {
  form: FormState
  updateField: UpdateField
  onPriceChange: (value: string) => void
}

const inputClass = 'w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary'
const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5'

export function buildPriceChangeHandler(setForm: (updater: (f: FormState) => FormState) => void) {
  return (value: string) => {
    setForm(f => ({ ...f, preco: value, parcela_display: value ? calcParcela(Number(value)) : '' }))
  }
}

export default function BasicInfoSection({ form, updateField, onPriceChange }: BasicInfoSectionProps) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-5">Informações Básicas</h2>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Título *</label>
          <input
            value={form.titulo}
            onChange={e => updateField('titulo', e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Finalidade *</label>
            <select value={form.tipo} onChange={e => updateField('tipo', e.target.value)} className={inputClass}>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoria *</label>
            <select value={form.categoria} onChange={e => updateField('categoria', e.target.value)} className={inputClass}>
              {PROPERTY_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => updateField('status', e.target.value)} className={inputClass}>
              <option value="pronto">Pronto para morar</option>
              <option value="construcao">Em construção</option>
              <option value="planta">Na planta</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preço (R$) *</label>
            <input type="number" value={form.preco} onChange={e => onPriceChange(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Parcela display</label>
            <input value={form.parcela_display} onChange={e => updateField('parcela_display', e.target.value)}
              placeholder="Auto-calculado ao preencher preço" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Label da parcela</label>
            <input value={form.parcela_label} onChange={e => updateField('parcela_label', e.target.value)}
              placeholder="Ex: Período Obras" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Área (m²)</label>
            <input type="number" value={form.area} onChange={e => updateField('area', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Área exibida no site</label>
            <input value={form.area_display} onChange={e => updateField('area_display', e.target.value)}
              placeholder="Ex: 26 a 49 m²" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Quartos</label>
            <input type="number" value={form.quartos} onChange={e => updateField('quartos', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Banheiros</label>
            <input type="number" value={form.banheiros} onChange={e => updateField('banheiros', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vagas</label>
            <input type="number" value={form.vagas} onChange={e => updateField('vagas', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Vagas exibida no site</label>
            <input value={form.vagas_display} onChange={e => updateField('vagas_display', e.target.value)}
              placeholder="Ex: 1 a 2 vagas" className={inputClass} />
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
  )
}
