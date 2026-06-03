import Link from 'next/link'
import { FiInfo } from 'react-icons/fi'
import { formatBRLInteger } from '../lib/formatters'
import type { EmpreendimentoFinancingExample } from '../lib/empreendimentoFinance'

interface Props {
  example: EmpreendimentoFinancingExample
  nome: string
}

/**
 * Grounded financing snapshot for the entry-level unit of a development. Every
 * figure comes from buildEmpreendimentoFinancingExample (the simulator engine);
 * this component only formats and frames it, and points to the full simulator
 * and cost guide for the exact, personalized numbers.
 */
export default function EmpreendimentoFinancingCard({ example, nome }: Props) {
  const items = [
    { label: 'Entrada (20%)', value: formatBRLInteger(example.entrada), emphasis: false },
    { label: 'Valor financiado', value: formatBRLInteger(example.valorFinanciado), emphasis: false },
    {
      label: `1ª parcela · ${example.prazoMeses} meses`,
      value: formatBRLInteger(example.primeiraParcela),
      emphasis: true,
    },
  ]

  return (
    <section className="mb-12 max-w-3xl" aria-labelledby="financiamento-exemplo">
      <span className="section-label">Quanto fica no financiamento</span>
      <h2 id="financiamento-exemplo" className="section-title mb-4">
        Exemplo de financiamento
      </h2>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
        Para a unidade a partir de <strong>{formatBRLInteger(example.precoBase)}</strong> no {nome},
        financiando pela tabela SAC em {example.prazoMeses} meses ({example.programaLabel},{' '}
        {example.taxaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}% ao ano):
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
        {items.map(item => (
          <div key={item.label} className="bg-white px-5 py-5">
            <dt className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">{item.label}</dt>
            <dd className={`text-lg font-black ${item.emphasis ? 'text-primary' : 'text-dark'}`}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 flex gap-2 text-[11px] text-gray-500 leading-relaxed">
        <FiInfo size={12} className="flex-shrink-0 mt-0.5" />
        <span>
          Estimativa pela tabela SAC (a 1ª parcela é a maior; elas diminuem ao longo do contrato). O valor
          exato depende da sua renda, prazo e taxa aprovada.{' '}
          <Link href="/simulador" className="font-bold text-primary hover:underline">
            Simule com seus dados
          </Link>{' '}
          ou veja todos os{' '}
          <Link href="/ajuda/custos-para-comprar-imovel-em-osasco" className="font-bold text-primary hover:underline">
            custos da compra
          </Link>
          .
        </span>
      </p>
    </section>
  )
}
