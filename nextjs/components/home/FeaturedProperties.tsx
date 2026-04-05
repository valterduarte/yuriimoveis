import Link from 'next/link'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import PropertyCard from '../PropertyCard'
import type { Imovel } from '../../types'

interface FeaturedPropertiesProps {
  properties: Imovel[]
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12 reveal">
          <div>
            <span className="section-label">Selecionados</span>
            <h2 className="section-title">Imóveis em Destaque</h2>
          </div>
          <Link href="/imoveis" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark hover:text-primary transition-colors">
            Ver todos <FiArrowRight size={14} />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property, i) => (
              <div key={property.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <PropertyCard imovel={property} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-16">Nenhum imóvel em destaque.</p>
        )}

        <div className="text-center mt-10">
          <Link href="/imoveis" className="btn-outline inline-flex items-center gap-2">
            Ver todos os imóveis <FiArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
