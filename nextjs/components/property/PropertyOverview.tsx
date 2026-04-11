import { FiMaximize, FiCheckCircle, FiHome, FiTool, FiFileText } from 'react-icons/fi'
import { FaCar, FaBath } from 'react-icons/fa'
import { LuBed } from 'react-icons/lu'
import { PROPERTY_STATUSES } from '../../lib/constants'
import type { Imovel, PropertyStatus } from '../../types'
import type { IconType } from 'react-icons'

const STATUS_STYLES: Record<PropertyStatus, { className: string; icon: IconType }> = {
  pronto:     { className: 'bg-green-50 text-green-700 border border-green-200', icon: FiHome     },
  construcao: { className: 'bg-amber-50 text-amber-700 border border-amber-200', icon: FiTool     },
  planta:     { className: 'bg-blue-50 text-blue-700 border border-blue-200',   icon: FiFileText  },
}

interface PropertyOverviewProps {
  imovel: Imovel
}

export default function PropertyOverview({ imovel }: PropertyOverviewProps) {
  const statusStyle = imovel.status ? STATUS_STYLES[imovel.status] : null
  const StatusIcon = statusStyle?.icon

  return (
    <section id="visao-geral">
      <span className="section-label">Visão Geral</span>
      <h2 className="section-title mb-2">{imovel.subtitulo || 'Conheça este imóvel'}</h2>
      <p className="text-gray-500 text-sm mb-3">{imovel.cidade} — {imovel.bairro}</p>

      {statusStyle && StatusIcon && (
        <div className={`inline-flex items-center gap-2 px-4 py-2 mb-8 font-bold text-xs uppercase tracking-[0.15em] ${statusStyle.className}`}>
          <StatusIcon size={14} />
          {PROPERTY_STATUSES.find(s => s.value === imovel.status)?.label}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white border border-gray-200 mb-8">
        {imovel.quartos > 0 && (
          <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gray-200 text-center">
            <LuBed className="text-primary mb-3" size={26} />
            <span className="font-black text-dark text-2xl leading-none">{imovel.quartos}</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-1.5">
              {imovel.quartos === 1 ? 'Quarto' : 'Quartos'}
            </span>
          </div>
        )}
        {imovel.banheiros > 0 && (
          <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gray-200 text-center">
            <FaBath className="text-primary mb-3" size={24} />
            <span className="font-black text-dark text-2xl leading-none">{imovel.banheiros}</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-1.5">
              {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
            </span>
          </div>
        )}
        {imovel.vagas > 0 && (
          <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gray-200 text-center">
            <FaCar className="text-primary mb-3" size={24} />
            <span className="font-black text-dark text-2xl leading-none">{imovel.vagas}</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-1.5">
              {imovel.vagas === 1 ? 'Vaga' : 'Vagas'}
            </span>
          </div>
        )}
        {imovel.area > 0 && (
          <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
            <FiMaximize className="text-primary mb-3" size={24} />
            <span className="font-black text-dark text-2xl leading-none">{imovel.area}</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-1.5">m²</span>
          </div>
        )}
      </div>

      {imovel.descricao && (
        <div className="bg-white border border-gray-200 p-8 mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark mb-4">Descrição</h3>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{imovel.descricao}</p>
        </div>
      )}

      {imovel.diferenciais?.length > 0 && (
        <div className="bg-white border border-gray-200 p-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark mb-5">Diferenciais</h3>
          <div className="grid grid-cols-2 gap-3">
            {imovel.diferenciais.map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                <FiCheckCircle className="text-primary flex-shrink-0" size={15} />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
