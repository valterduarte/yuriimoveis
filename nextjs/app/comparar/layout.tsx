import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Imóveis',
  description: 'Compare até 4 imóveis lado a lado: preço, área, quartos, banheiros e diferenciais.',
  robots: { index: false, follow: true },
}

export default function CompararLayout({ children }: { children: React.ReactNode }) {
  return children
}
