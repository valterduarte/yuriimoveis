'use client'

import Link from 'next/link'
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { removeCompareItem, useCompareItems, type CompareItem } from '../../lib/compareStore'
import { PHONE_WA_BASE } from '../../lib/config'
import { PROPERTY_CATEGORIES, PROPERTY_STATUSES } from '../../lib/constants'
import WhatsAppLink from '../../components/WhatsAppLink'

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const formatPriceBy = (price: number, area: number): string => {
  if (!area || area <= 0) return '—'
  return `${formatBRL(Math.round(price / area))}/m²`
}

const labelFor = <T extends { value: string; label: string }>(opts: T[], value: string): string =>
  opts.find((o) => o.value === value)?.label ?? value

const minBy = <T,>(items: T[], pick: (item: T) => number): T | null => {
  const filtered = items.filter((item) => pick(item) > 0)
  if (filtered.length === 0) return null
  return filtered.reduce((acc, cur) => (pick(cur) < pick(acc) ? cur : acc))
}

const maxBy = <T,>(items: T[], pick: (item: T) => number): T | null => {
  const filtered = items.filter((item) => pick(item) > 0)
  if (filtered.length === 0) return null
  return filtered.reduce((acc, cur) => (pick(cur) > pick(acc) ? cur : acc))
}

interface RowProps {
  label: string
  values: (string | number)[]
  highlightIndex?: number | null
  highlightLabel?: string
}

function Row({ label, values, highlightIndex, highlightLabel }: RowProps) {
  return (
    <tr className="border-b border-gray-200">
      <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 py-4 pr-4 align-top w-40">
        {label}
      </th>
      {values.map((value, i) => (
        <td key={i} className="py-4 px-4 text-sm text-dark align-top">
          <div className="flex flex-col gap-1">
            <span>{value || '—'}</span>
            {highlightIndex === i && highlightLabel && (
              <span className="inline-flex items-center gap-1 self-start text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-50 px-1.5 py-0.5">
                <FiCheck size={10} />
                {highlightLabel}
              </span>
            )}
          </div>
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <span className="section-label">Comparador</span>
      <h1 className="section-title mb-4">Nenhum imóvel selecionado</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8 text-sm leading-relaxed">
        Navegue pelos imóveis e clique em <strong>Comparar</strong> no card pra colocar até 4 lado a lado e
        decidir com calma.
      </p>
      <Link
        href="/imoveis"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs py-4 px-8 transition-colors"
      >
        <FiArrowLeft size={14} />
        Ver imóveis
      </Link>
    </div>
  )
}

export default function CompararPage() {
  const items = useCompareItems()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <EmptyState />
      </div>
    )
  }

  const cheapest = minBy(items, (i) => i.preco)
  const largest = maxBy(items, (i) => i.area)
  const mostBedrooms = maxBy(items, (i) => i.quartos)
  const mostBathrooms = maxBy(items, (i) => i.banheiros)
  const mostParking = maxBy(items, (i) => i.vagas)
  const bestPriceBy = minBy(
    items.filter((i) => i.area > 0),
    (i) => i.preco / i.area,
  )

  const indexOf = (target: CompareItem | null): number | null =>
    target ? items.findIndex((i) => i.id === target.id) : null

  const buildWhatsAppHref = (item: CompareItem): string => {
    const message = `Olá, gostaria de mais informações sobre o imóvel: ${item.titulo} (cód. ${item.id})`
    return `${PHONE_WA_BASE}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-16">
      <section className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="uppercase tracking-widest text-xs font-bold text-primary mb-3 block">
            Comparador
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight">
            Comparando {items.length} {items.length === 1 ? 'imóvel' : 'imóveis'}
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Diferenças destacadas em verde. Clique em <strong>Quero esse</strong> pra falar diretamente sobre o
            imóvel escolhido.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-40 p-4"></th>
                  {items.map((item) => (
                    <th key={item.id} className="p-4 text-left align-top min-w-[200px]">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => removeCompareItem(item.id)}
                          aria-label={`Remover ${item.titulo}`}
                          className="absolute top-0 right-0 bg-white hover:bg-red-50 hover:text-red-600 border border-gray-200 p-1 transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                        <Link href={`/imoveis/${item.slug}`} className="block group">
                          {item.imagem ? (
                            <img
                              src={item.imagem}
                              alt={item.titulo}
                              className="w-full h-32 object-cover mb-3"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 mb-3" />
                          )}
                          <p className="text-primary font-bold text-base mb-1">{formatBRL(item.preco)}</p>
                          <p className="text-xs font-semibold text-dark line-clamp-2 group-hover:text-primary transition-colors">
                            {item.titulo}
                          </p>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row
                  label="Preço"
                  values={items.map((i) => formatBRL(i.preco))}
                  highlightIndex={indexOf(cheapest)}
                  highlightLabel="Mais barato"
                />
                <Row
                  label="Preço por m²"
                  values={items.map((i) => formatPriceBy(i.preco, i.area))}
                  highlightIndex={indexOf(bestPriceBy)}
                  highlightLabel="Melhor m²"
                />
                <Row label="Tipo" values={items.map((i) => (i.tipo === 'venda' ? 'Venda' : 'Aluguel'))} />
                <Row label="Categoria" values={items.map((i) => labelFor(PROPERTY_CATEGORIES, i.categoria))} />
                <Row
                  label="Status"
                  values={items.map((i) => (i.status ? labelFor(PROPERTY_STATUSES, i.status) : '—'))}
                />
                <Row label="Cidade" values={items.map((i) => i.cidade)} />
                <Row label="Bairro" values={items.map((i) => i.bairro)} />
                <Row
                  label="Área"
                  values={items.map((i) => (i.area > 0 ? `${i.area} m²` : '—'))}
                  highlightIndex={indexOf(largest)}
                  highlightLabel="Maior área"
                />
                <Row
                  label="Quartos"
                  values={items.map((i) => i.quartos || '—')}
                  highlightIndex={indexOf(mostBedrooms)}
                  highlightLabel="Mais quartos"
                />
                <Row
                  label="Banheiros"
                  values={items.map((i) => i.banheiros || '—')}
                  highlightIndex={indexOf(mostBathrooms)}
                  highlightLabel="Mais banheiros"
                />
                <Row
                  label="Vagas"
                  values={items.map((i) => i.vagas || '—')}
                  highlightIndex={indexOf(mostParking)}
                  highlightLabel="Mais vagas"
                />
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 py-4 pr-4 w-40">
                    Ação
                  </th>
                  {items.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      <WhatsAppLink
                        href={buildWhatsAppHref(item)}
                        source="comparador"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold uppercase tracking-wider text-[11px] py-2.5 px-4 transition-colors w-full"
                      >
                        <FaWhatsapp size={14} />
                        Quero esse
                      </WhatsAppLink>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/imoveis"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <FiArrowLeft size={14} />
              Adicionar mais imóveis
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
