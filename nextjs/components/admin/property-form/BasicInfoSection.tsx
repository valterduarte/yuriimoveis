'use client'

import { PROPERTY_CATEGORIES } from '../../../lib/constants'
import { card, fieldInput, fieldLabel, fieldHint, sectionHeading } from '../ui/styles'
import type { FormState, UpdateField } from './types'

interface BasicInfoSectionProps {
  form: FormState
  updateField: UpdateField
  onPriceChange: (value: string) => void
  /** Existing development names, for autocomplete suggestions. */
  empreendimentoOptions?: string[]
}

export default function BasicInfoSection({ form, updateField, onPriceChange, empreendimentoOptions = [] }: BasicInfoSectionProps) {
  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-5`}>Informações Básicas</h2>
      <div className="space-y-4">
        <div>
          <label className={fieldLabel}>Título *</label>
          <input
            value={form.titulo}
            onChange={e => updateField('titulo', e.target.value)}
            required
            className={fieldInput}
          />
        </div>

        <div>
          <label className={fieldLabel}>Empreendimento</label>
          <input
            value={form.empreendimento}
            onChange={e => updateField('empreendimento', e.target.value)}
            list="empreendimento-options"
            placeholder="Selecione um existente ou digite um novo"
            className={fieldInput}
          />
          <datalist id="empreendimento-options">
            {empreendimentoOptions.map(nome => (
              <option key={nome} value={nome} />
            ))}
          </datalist>
          <p className={fieldHint}>
            Liga esta unidade à página do empreendimento. Escolha o mesmo nome das outras plantas — o título não precisa estar no padrão.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={fieldLabel}>Finalidade *</label>
            <select value={form.tipo} onChange={e => updateField('tipo', e.target.value)} className={fieldInput}>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>
          <div>
            <label className={fieldLabel}>Categoria *</label>
            <select value={form.categoria} onChange={e => updateField('categoria', e.target.value)} className={fieldInput}>
              {PROPERTY_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={fieldLabel}>Status</label>
            <select value={form.status} onChange={e => updateField('status', e.target.value)} className={fieldInput}>
              <option value="pronto">Pronto para morar</option>
              <option value="construcao">Em construção</option>
              <option value="planta">Na planta</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>Preço (R$) *</label>
            <input type="number" value={form.preco} onChange={e => onPriceChange(e.target.value)} required className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Parcela display</label>
            <input value={form.parcela_display} onChange={e => updateField('parcela_display', e.target.value)}
              placeholder="Auto-calculado ao preencher preço" className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Label da parcela</label>
            <input value={form.parcela_label} onChange={e => updateField('parcela_label', e.target.value)}
              placeholder="Ex: Período Obras" className={fieldInput} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>Área (m²)</label>
            <input type="number" value={form.area} onChange={e => updateField('area', e.target.value)} className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Área exibida no site</label>
            <input value={form.area_display} onChange={e => updateField('area_display', e.target.value)}
              placeholder="Ex: 26 a 49 m²" className={fieldInput} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>Quartos</label>
            <input type="number" value={form.quartos} onChange={e => updateField('quartos', e.target.value)} className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Banheiros</label>
            <input type="number" value={form.banheiros} onChange={e => updateField('banheiros', e.target.value)} className={fieldInput} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>Vagas</label>
            <input type="number" value={form.vagas} onChange={e => updateField('vagas', e.target.value)} className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Vagas exibida no site</label>
            <input value={form.vagas_display} onChange={e => updateField('vagas_display', e.target.value)}
              placeholder="Ex: 1 a 2 vagas" className={fieldInput} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="destaque" checked={form.destaque}
            onChange={e => updateField('destaque', e.target.checked)}
            className="w-4 h-4 accent-primary" />
          <label htmlFor="destaque" className="text-xs text-gray-600 uppercase tracking-wide font-bold">
            Imóvel em destaque
          </label>
        </div>
      </div>
    </div>
  )
}
