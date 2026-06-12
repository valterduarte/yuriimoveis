'use client'

import Link from 'next/link'
import { FiCalendar, FiTrendingUp, FiCheck, FiPlus } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_WA_BASE } from '../../lib/config'
import WhatsAppLink from '../WhatsAppLink'
import { formatPrice, imovelSlug, buildPropertyWhatsAppMessage } from '../../utils/imovelUtils'
import {
  COMPARE_MAX_ITEMS,
  buildCompareItem,
  toggleCompareItem,
  useCompareItems,
} from '../../lib/compareStore'
import type { Imovel } from '../../types'

interface PropertySidebarProps {
  imovel: Imovel
  onScheduleVisit: () => void
}

export default function PropertySidebar({ imovel, onScheduleVisit }: PropertySidebarProps) {
  const compareItems = useCompareItems()
  const isInCompare = compareItems.some(item => item.id === imovel.id)
  const compareIsFull = compareItems.length >= COMPARE_MAX_ITEMS && !isInCompare

  const handleToggleCompare = () => {
    if (compareIsFull) return
    toggleCompareItem(buildCompareItem(imovel, imovelSlug(imovel)))
  }

  const simulationMessage = encodeURIComponent(
    buildPropertyWhatsAppMessage(imovel, 'simulacao')
  )

  const infoItems: { label: string; value: string | number }[] = [
    { label: 'Código',    value: `#${imovel.id}`  },
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
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-1">A partir de</p>
        <p className="text-3xl font-black text-primary leading-tight">
          {formatPrice(imovel.preco, imovel.tipo)}
        </p>
        {imovel.tipo === 'venda' && (
          <p className="text-[11px] text-green-400 mt-3 font-semibold">
            Simule sua parcela abaixo
          </p>
        )}
        <p className="text-[10px] text-gray-400 mt-2 leading-snug">
          Valores sujeitos a alteração. Consulte disponibilidade.
        </p>
      </div>

      <div className="p-7 space-y-3">
        <WhatsAppLink
          href={`${PHONE_WA_BASE}?text=${simulationMessage}`}
          source="imovel-simulacao"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors"
        >
          <FaWhatsapp size={16} /> Faça Sua Simulação
        </WhatsAppLink>
        <button
          onClick={onScheduleVisit}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-primary hover:text-primary text-dark font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors"
        >
          <FiCalendar size={14} /> Agendar Visita
        </button>
        {imovel.tipo === 'venda' && (
          <Link
            href={`/simulador?valor=${imovel.preco}`}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-primary hover:text-primary text-dark font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors"
          >
            <FiTrendingUp size={14} /> Simular Financiamento
          </Link>
        )}
        <button
          onClick={handleToggleCompare}
          disabled={compareIsFull}
          aria-pressed={isInCompare}
          title={
            compareIsFull
              ? `Limite de ${COMPARE_MAX_ITEMS} imóveis no comparador`
              : isInCompare
                ? 'Remover do comparador'
                : 'Adicionar ao comparador'
          }
          className={`w-full flex items-center justify-center gap-2 border font-bold uppercase tracking-[0.15em] text-[10px] py-4 transition-colors ${
            isInCompare
              ? 'bg-primary border-primary text-white hover:bg-primary/90'
              : 'border-gray-300 text-dark hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-dark'
          }`}
        >
          {isInCompare ? <FiCheck size={14} /> : <FiPlus size={14} />}
          {isInCompare ? 'No Comparador' : 'Comparar Imóvel'}
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
