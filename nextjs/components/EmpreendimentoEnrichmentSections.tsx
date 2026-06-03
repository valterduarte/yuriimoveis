import Image from 'next/image'
import { FiCheck } from 'react-icons/fi'
import type { EmpreendimentoEnrichment, EmpreendimentoFicha } from '../data/empreendimentoEnrichment'

interface Props {
  enrichment: EmpreendimentoEnrichment
  nome: string
}

function fichaRows(ficha: EmpreendimentoFicha): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = []
  if (ficha.torres != null) rows.push({ label: 'Torres', value: String(ficha.torres) })
  if (ficha.andares != null) rows.push({ label: 'Andares', value: String(ficha.andares) })
  if (ficha.unidadesPorAndar != null) rows.push({ label: 'Unidades por andar', value: String(ficha.unidadesPorAndar) })
  if (ficha.vagas) rows.push({ label: 'Vagas', value: ficha.vagas })
  if (ficha.entrega) rows.push({ label: 'Entrega', value: ficha.entrega })
  return rows
}

/**
 * Renders the editorial, building-specific sections of a development page —
 * each one only when its real data exists, so a building with partial data
 * shows exactly what is known and nothing more. Returns null when empty.
 */
export default function EmpreendimentoEnrichmentSections({ enrichment, nome }: Props) {
  const ficha = enrichment.ficha ? fichaRows(enrichment.ficha) : []
  const lazer = enrichment.lazer ?? []
  const diferenciais = enrichment.diferenciais ?? []
  const descricao = enrichment.descricao ?? []
  const galeria = enrichment.galeria ?? []

  if (!descricao.length && !diferenciais.length && !ficha.length && !lazer.length && !galeria.length) {
    return null
  }

  return (
    <>
      {descricao.length > 0 && (
        <section className="mb-12 max-w-3xl">
          <span className="section-label">Conheça de perto</span>
          <h2 className="section-title mb-4">Conheça o {nome}</h2>
          {descricao.map((paragrafo, i) => (
            <p key={i} className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
              {paragrafo}
            </p>
          ))}
        </section>
      )}

      {diferenciais.length > 0 && (
        <section className="mb-12 max-w-3xl">
          <span className="section-label">Por que se destaca</span>
          <h2 className="section-title mb-5">Diferenciais do {nome}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diferenciais.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                <FiCheck size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ficha.length > 0 && (
        <section className="mb-12 max-w-3xl">
          <span className="section-label">Ficha técnica</span>
          <h2 className="section-title mb-5">Detalhes do {nome}</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
            {ficha.map(row => (
              <div key={row.label} className="bg-white px-5 py-4">
                <dt className="text-xs uppercase tracking-wider text-gray-500 mb-1">{row.label}</dt>
                <dd className="text-base font-bold text-dark">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {lazer.length > 0 && (
        <section className="mb-12 max-w-3xl">
          <span className="section-label">Lazer e áreas comuns</span>
          <h2 className="section-title mb-5">O que o {nome} oferece</h2>
          <ul className="flex flex-wrap gap-2.5">
            {lazer.map(item => (
              <li
                key={item}
                className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700"
              >
                <FiCheck size={14} className="text-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {galeria.length > 0 && (
        <section className="mb-12">
          <span className="section-label">Galeria</span>
          <h2 className="section-title mb-6">Imagens do {nome}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galeria.map(img => (
              <div key={img.url} className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
