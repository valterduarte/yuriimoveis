'use client'

import { FiCalendar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_WA } from '../../lib/config'
import { formatPrice, calcParcela } from '../../utils/imovelUtils'

export default function PropertySidebar({ imovel, onScheduleVisit }) {
  const simulationMessage = encodeURIComponent(
    `Olá! Gostaria de fazer uma simulação de financiamento para o imóvel: ${imovel.titulo} — Código #${imovel.id}`
  )

  const infoItems = [
    { label: 'Tipo',      value: imovel.tipo      },
    { label: 'Categoria', value: imovel.categoria  },
    { label: 'Cidade',    value: imovel.cidade     },
    { label: 'Bairro',    value: imovel.bairro     },
    ...(imovel.area_display || imovel.area > 0
      ? [{ label: 'Área', value: imovel.area_display || `${imovel.area} m²` }]
      : []),
    ...(imovel.quartos > 0 ? [{ label: 'Quartos', value: imovel.quartos }] : []),
    ...(imovel.vagas_display
      ? [{ label: 'Vagas', value: imovel.vagas_display }]
      : imovel.vagas > 0 ? [{ label: 'Vagas', value: imovel.vagas }] : []),
  ]

  return (
    <div className="bg-white border border-gray-200 sticky top-36">
      <div className="bg-dark p-7">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-1">Código #{imovel.id}</p>
        <p className="text-3xl font-black text-primary leading-tight">
          {formatPrice(imovel.preco, imovel.tipo)}
        </p>
        <p className="text-[10px] text-gray-300 uppercase tracking-wider mt-1">
          {imovel.tipo === 'venda' ? 'Valor de venda' : 'Valor mensal'}
        </p>
        {imovel.tipo === 'venda' && (
          <p className="text-[11px] text-green-400 mt-3 font-semibold">
            Parcelas a partir de {imovel.parcela_display || calcParcela(imovel.preco)}/mês
            {imovel.parcela_label && (
              <span className="text-gray-500 text-[9px] font-normal ml-1">{imovel.parcela_label}</span>
            )}
          </p>
        )}
      </div>

      <div className="p-7 space-y-3">
        <a
          href={`${PHONE_WA}?text=${simulationMessage}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors"
        >
          <FaWhatsapp size={16} /> Faça Sua Simulação
        </a>
        <button
          onClick={onScheduleVisit}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-primary hover:text-primary text-dark font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors"
        >
          <FiCalendar size={14} /> Agendar Visita
        </button>
      </div>

      <div className="border-t border-gray-100 px-7 pb-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 py-5">Informações</p>
        <div className="space-y-3">
          {infoItems.map(item => (
            <div key={item.label} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{item.label}</span>
              <span className="font-semibold text-dark capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
