'use client'

import Link from 'next/link'
import { formatPrice, imovelSlug } from '../../../utils/imovelUtils'
import type { MapImovel } from '../../../lib/api'

export default function PropertyInfoCard({ imovel }: { imovel: MapImovel }) {
  const slug = imovelSlug({ titulo: imovel.titulo, id: imovel.id })
  return (
    <div className="w-52">
      {imovel.imagem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imovel.imagem}
          alt={imovel.titulo}
          className="w-full h-24 object-cover mb-2"
          loading="lazy"
        />
      )}
      <p className="text-primary font-bold text-base mb-1">
        {formatPrice(imovel.preco, imovel.tipo)}
      </p>
      <p className="text-xs font-semibold text-dark mb-1 line-clamp-2">{imovel.titulo}</p>
      <p className="text-[11px] text-gray-500 mb-2">
        {imovel.bairro}, {imovel.cidade}
        {imovel.area > 0 ? ` · ${imovel.area} m²` : ''}
        {imovel.quartos > 0 ? ` · ${imovel.quartos} qts` : ''}
      </p>
      <Link
        href={`/imoveis/${slug}`}
        className="block text-center bg-primary text-white text-[11px] font-bold uppercase tracking-wider py-2"
      >
        Ver detalhes
      </Link>
    </div>
  )
}
