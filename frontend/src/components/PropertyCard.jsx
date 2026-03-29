import { Link } from 'react-router-dom'
import { FiMapPin, FiMaximize } from 'react-icons/fi'
import { FaCar, FaBath } from 'react-icons/fa'
import { LuBed } from 'react-icons/lu'
import { formatPrice, imovelSlug, optimizeCloudinaryUrl } from '../utils/imovelUtils'
import { PLACEHOLDER_IMAGE, PROPERTY_STATUSES, CARD_IMAGE_HEIGHT } from '../constants'

export default function PropertyCard({ imovel }) {
  const img = optimizeCloudinaryUrl(imovel.imagens?.[0], 600) || PLACEHOLDER_IMAGE

  return (
    <Link to={`/imoveis/${imovelSlug(imovel)}`} className="group block bg-white overflow-hidden">
      <div className="relative overflow-hidden" style={{ height: CARD_IMAGE_HEIGHT }}>
        <img
          src={img}
          alt={`${imovel.titulo} — ${imovel.categoria} para ${imovel.tipo} em ${imovel.bairro || imovel.cidade}`}
          loading="lazy"
          decoding="async"
          width={600}
          height={260}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={e => { e.target.src = PLACEHOLDER_IMAGE }}
        />

        <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
          <p className="text-primary text-[10px] uppercase tracking-widest mb-1 font-bold">
            {imovel.categoria}
          </p>
          <h3 className="text-white font-bold text-sm leading-snug mb-2">{imovel.titulo}</h3>
          <div className="flex items-center gap-1 text-gray-300 text-xs mb-3">
            <FiMapPin size={11} className="text-primary" />
            {imovel.bairro}, {imovel.cidade}
          </div>
          <span className="inline-block text-[10px] uppercase tracking-widest font-bold bg-primary text-white px-3 py-1.5 w-fit">
            Ver Detalhes
          </span>
        </div>

        <div className="absolute top-3 left-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 text-white ${
            imovel.tipo === 'venda' ? 'bg-primary' : 'bg-dark'
          }`}>
            {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>

        {imovel.destaque && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 text-dark bg-white">
              Destaque
            </span>
          </div>
        )}

        {imovel.status && (() => {
          const status = PROPERTY_STATUSES.find(s => s.value === imovel.status)
          return status ? (
            <div className={`absolute ${imovel.destaque ? 'top-9' : 'top-3'} right-3`}>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 text-white ${status.color}`}>
                {status.label}
              </span>
            </div>
          ) : null
        })()}
      </div>

      <div className="p-5 border border-gray-200 border-t-0 group-hover:border-primary transition-colors duration-300">
        <p className="text-primary font-bold text-lg mb-1">
          {formatPrice(imovel.preco, imovel.tipo)}
        </p>
        <h3 className="font-semibold text-dark text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {imovel.titulo}
        </h3>
        <p className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <FiMapPin size={11} className="text-primary flex-shrink-0" />
          {imovel.bairro}, {imovel.cidade}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
          {imovel.quartos > 0 && (
            <span className="flex items-center gap-1">
              <LuBed size={13} className="text-gray-400" /> {imovel.quartos}
            </span>
          )}
          {imovel.banheiros > 0 && (
            <span className="flex items-center gap-1">
              <FaBath size={11} className="text-gray-400" /> {imovel.banheiros}
            </span>
          )}
          {imovel.vagas > 0 && (
            <span className="flex items-center gap-1">
              <FaCar size={12} className="text-gray-400" /> {imovel.vagas}
            </span>
          )}
          {imovel.area > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <FiMaximize size={11} className="text-gray-400" /> {imovel.area}m²
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
