import Image from 'next/image'
import Link from 'next/link'
import { FiMapPin, FiMaximize } from 'react-icons/fi'
import { FaCar, FaBath } from 'react-icons/fa'
import { LuBed } from 'react-icons/lu'
import { formatPrice, imovelSlug } from '../utils/imovelUtils'
import { PLACEHOLDER_IMAGE, PROPERTY_STATUSES, CARD_IMAGE_HEIGHT } from '../lib/constants'
import CompareToggleButton from './compare/CompareToggleButton'
import type { Imovel } from '../types'

interface PropertyCardProps {
  imovel: Imovel
}

function getCardImageSrc(imovel: Imovel): string {
  const firstImage = imovel.imagens?.[0]?.trim()
  return firstImage && firstImage.length > 0 ? firstImage : PLACEHOLDER_IMAGE
}

export default function PropertyCard({ imovel }: PropertyCardProps) {
  const imageSrc = getCardImageSrc(imovel)
  const slug = imovelSlug(imovel)
  const statusConfig = imovel.status
    ? PROPERTY_STATUSES.find(s => s.value === imovel.status)
    : null

  return (
    <Link href={`/imoveis/${slug}`} className="group block bg-white overflow-hidden">
      <div className="relative overflow-hidden" style={{ height: CARD_IMAGE_HEIGHT }}>
        <Image
          src={imageSrc}
          alt={`${imovel.titulo} — ${imovel.categoria} para ${imovel.tipo} em ${imovel.bairro || imovel.cidade}`}
          width={600}
          height={CARD_IMAGE_HEIGHT}
          loading="lazy"
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark/60 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3">
          <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-1 text-white ${
            imovel.tipo === 'venda' ? 'bg-primary' : 'bg-dark'
          }`}>
            {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>

        {imovel.destaque && (
          <div className="absolute top-3 right-3">
            <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 text-dark bg-white">
              Destaque
            </span>
          </div>
        )}

        {statusConfig && (
          <div className={`absolute ${imovel.destaque ? 'top-9' : 'top-3'} right-3`}>
            <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-1 text-white ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        )}

        <CompareToggleButton imovel={imovel} slug={slug} />
      </div>

      <div className="p-5 border border-gray-200 border-t-0 group-hover:border-primary transition-colors duration-300">
        <p className="text-primary font-bold text-lg mb-1">
          {formatPrice(imovel.preco, imovel.tipo)}
        </p>
        <h3 className="font-semibold text-dark text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {imovel.titulo}
        </h3>
        <p className="flex items-center gap-1 text-gray-600 text-xs mb-3">
          <FiMapPin size={11} className="text-primary flex-shrink-0" />
          {imovel.bairro}, {imovel.cidade}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100">
          {imovel.quartos > 0 && (
            <span className="flex items-center gap-1" title="Quartos">
              <LuBed size={13} className="text-gray-500" aria-hidden="true" />
              {imovel.quartos}
              <span className="sr-only">{imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>
            </span>
          )}
          {imovel.banheiros > 0 && (
            <span className="flex items-center gap-1" title="Banheiros">
              <FaBath size={11} className="text-gray-500" aria-hidden="true" />
              {imovel.banheiros}
              <span className="sr-only">{imovel.banheiros === 1 ? 'banheiro' : 'banheiros'}</span>
            </span>
          )}
          {imovel.vagas > 0 && (
            <span className="flex items-center gap-1" title="Vagas">
              <FaCar size={12} className="text-gray-500" aria-hidden="true" />
              {imovel.vagas}
              <span className="sr-only">{imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>
            </span>
          )}
          {imovel.area > 0 && (
            <span className="flex items-center gap-1 ml-auto" title="Área">
              <FiMaximize size={11} className="text-gray-500" aria-hidden="true" />
              {imovel.area}m²
              <span className="sr-only">de área</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
