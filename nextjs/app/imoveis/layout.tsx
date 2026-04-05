import { SITE_URL } from '../../lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis em Osasco e Região — Corretor Yuri',
  description:
    'Encontre casas, apartamentos, terrenos e comerciais para venda e aluguel em Osasco e região. Filtros por preço, bairro e tipo. Atendimento com o Corretor Yuri.',
  alternates: { canonical: `${SITE_URL}/imoveis` },
  openGraph: {
    title: 'Imóveis em Osasco e Região — Corretor Yuri',
    description:
      'Casas, apartamentos, terrenos e comerciais para venda e aluguel em Osasco e região.',
    url: `${SITE_URL}/imoveis`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function ImoveisLayout({ children }: { children: React.ReactNode }) {
  return children
}
