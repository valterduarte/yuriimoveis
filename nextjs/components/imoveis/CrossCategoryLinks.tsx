import Link from 'next/link'
import { CATEGORIAS } from '../../data/categorias'
import { ACAO_LABELS, buildHierarchicalUrl, type AcaoSlug } from '../../lib/navigation'
import type { PropertyCategory } from '../../types'

interface CrossCategoryLinksProps {
  acao: AcaoSlug
  cidade: string
  cidadeName: string
  categoria: PropertyCategory
  categoriaPlural: string
  categoriasNaMesmaAcao: PropertyCategory[]
  categoriasNaAcaoOposta: PropertyCategory[]
}

function LinkList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2 text-sm">{children}</ul>
}

function CrossLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-700 hover:text-primary hover:underline transition-colors">
        {children}
      </Link>
    </li>
  )
}

export default function CrossCategoryLinks({
  acao,
  cidade,
  cidadeName,
  categoria,
  categoriaPlural,
  categoriasNaMesmaAcao,
  categoriasNaAcaoOposta,
}: CrossCategoryLinksProps) {
  const oppositeAcao: AcaoSlug = acao === 'comprar' ? 'alugar' : 'comprar'
  const labelSame = ACAO_LABELS[acao].preposicao.toLowerCase()
  const labelOpposite = ACAO_LABELS[oppositeAcao].preposicao.toLowerCase()

  const hasMesmaAcao = categoriasNaMesmaAcao.length > 0
  const sameCategoriaInOpposite = categoriasNaAcaoOposta.includes(categoria)
  const outrasCategoriasOposto = categoriasNaAcaoOposta.filter(c => c !== categoria)
  const hasAcaoOposta = sameCategoriaInOpposite || outrasCategoriasOposto.length > 0

  if (!hasMesmaAcao && !hasAcaoOposta) return null

  return (
    <section className="mt-14">
      <div className="grid md:grid-cols-2 gap-10">
        {hasMesmaAcao && (
          <div>
            <h2 className="heading-section">
              Quem se interessou por {categoriaPlural.toLowerCase()} em {cidadeName} também procurou por
            </h2>
            <LinkList>
              {categoriasNaMesmaAcao.map(c => (
                <CrossLink key={c} href={buildHierarchicalUrl({ acao, cidade, categoria: c })}>
                  {CATEGORIAS[c].plural} {labelSame} em {cidadeName}
                </CrossLink>
              ))}
              <CrossLink href={buildHierarchicalUrl({ acao, cidade })}>
                Todos os imóveis {labelSame} em {cidadeName}
              </CrossLink>
            </LinkList>
          </div>
        )}

        {hasAcaoOposta && (
          <div>
            <h2 className="heading-section">
              Veja também: {oppositeAcao === 'comprar' ? 'imóveis à venda' : 'imóveis para alugar'} em {cidadeName}
            </h2>
            <LinkList>
              {sameCategoriaInOpposite && (
                <CrossLink href={buildHierarchicalUrl({ acao: oppositeAcao, cidade, categoria })}>
                  {categoriaPlural} {labelOpposite} em {cidadeName}
                </CrossLink>
              )}
              {outrasCategoriasOposto.map(c => (
                <CrossLink key={c} href={buildHierarchicalUrl({ acao: oppositeAcao, cidade, categoria: c })}>
                  {CATEGORIAS[c].plural} {labelOpposite} em {cidadeName}
                </CrossLink>
              ))}
              <CrossLink href={buildHierarchicalUrl({ acao: oppositeAcao, cidade })}>
                Todos os imóveis {labelOpposite} em {cidadeName}
              </CrossLink>
            </LinkList>
          </div>
        )}
      </div>
    </section>
  )
}
