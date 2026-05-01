import type { PropertyCategory, TransactionType } from '../types'

export interface LandingPageData {
  slug: string
  tipo: TransactionType
  categoria: PropertyCategory
  titulo: string
  h1: string
  descricaoMeta: string
  introTexto: string
}

export const LANDING_PAGES: LandingPageData[] = [
  {
    slug: 'casas-a-venda-em-osasco',
    tipo: 'venda',
    categoria: 'casa',
    titulo: 'Casas à Venda em Osasco SP',
    h1: 'Casas à Venda em Osasco',
    descricaoMeta:
      'Encontre casas à venda em Osasco e região. Imóveis prontos para morar, em construção e na planta. Atendimento personalizado com o Corretor Yuri, CRECI 235509.',
    introTexto:
      'Encontre a casa ideal em Osasco. Temos opções em diversos bairros como Bela Vista, Presidente Altino, Jaguaribe e Km 18, com metragens e faixas de preço variadas para atender diferentes perfis.',
  },
  {
    slug: 'apartamentos-a-venda-em-osasco',
    tipo: 'venda',
    categoria: 'apartamento',
    titulo: 'Apartamentos à Venda em Osasco SP',
    h1: 'Apartamentos à Venda em Osasco',
    descricaoMeta:
      'Apartamentos à venda em Osasco SP — lançamentos e prontos para morar. Studios, 1, 2 e 3 dormitórios com lazer completo. Corretor Yuri, CRECI 235509.',
    introTexto:
      'Apartamentos novos e prontos para morar em Osasco. Lançamentos com lazer completo, studios para investidores e unidades familiares com 2 e 3 dormitórios nos melhores bairros da cidade.',
  },
  {
    slug: 'terrenos-a-venda-em-osasco',
    tipo: 'venda',
    categoria: 'terreno',
    titulo: 'Terrenos à Venda em Osasco SP',
    h1: 'Terrenos à Venda em Osasco',
    descricaoMeta:
      'Terrenos à venda em Osasco SP para construção residencial e comercial. Lotes em condomínio e avulsos. Corretor Yuri, CRECI 235509.',
    introTexto:
      'Terrenos em Osasco para construir sua casa ou investir. Opções em condomínios fechados e lotes individuais em bairros com infraestrutura consolidada.',
  },
  {
    slug: 'imoveis-comerciais-a-venda-em-osasco',
    tipo: 'venda',
    categoria: 'comercial',
    titulo: 'Imóveis Comerciais à Venda em Osasco SP',
    h1: 'Imóveis Comerciais à Venda em Osasco',
    descricaoMeta:
      'Salas comerciais, lojas e galpões à venda em Osasco SP. Localizações estratégicas para seu negócio. Corretor Yuri, CRECI 235509.',
    introTexto:
      'Imóveis comerciais em Osasco com localização estratégica. Salas, lojas e espaços corporativos próximos a vias de acesso e transporte público.',
  },
  {
    slug: 'casas-para-alugar-em-osasco',
    tipo: 'aluguel',
    categoria: 'casa',
    titulo: 'Casas para Alugar em Osasco SP',
    h1: 'Casas para Alugar em Osasco',
    descricaoMeta:
      'Casas para alugar em Osasco SP. Opções em diversos bairros com valores acessíveis. Atendimento personalizado com o Corretor Yuri.',
    introTexto:
      'Casas para locação em Osasco com diferentes tamanhos e faixas de preço. Encontre o lar ideal para sua família nos melhores bairros da cidade.',
  },
  {
    slug: 'apartamentos-para-alugar-em-osasco',
    tipo: 'aluguel',
    categoria: 'apartamento',
    titulo: 'Apartamentos para Alugar em Osasco SP',
    h1: 'Apartamentos para Alugar em Osasco',
    descricaoMeta:
      'Apartamentos para alugar em Osasco SP. Studios, 1, 2 e 3 dormitórios. Opções com lazer, garagem e segurança. Corretor Yuri.',
    introTexto:
      'Apartamentos para locação em Osasco com diferentes perfis — de studios compactos a unidades familiares com 3 dormitórios e lazer completo.',
  },
]

export function findLandingPage(slug: string): LandingPageData | undefined {
  return LANDING_PAGES.find(lp => lp.slug === slug)
}
