import type { PropertyCategory } from '../types'

export interface ListingCopyEntry {
  /** Texto único de 50–120 palavras com bairros típicos, faixa de preço e elegibilidade MCMV. */
  texto: string
}

type Key = `${string}|${PropertyCategory}|${'venda' | 'aluguel'}`

const COPY: Partial<Record<Key, ListingCopyEntry>> = {
  'osasco|apartamento|venda': {
    texto:
      'O catálogo de apartamentos à venda em Osasco concentra lançamentos verticais no Centro, Quitaúna, Novo Osasco e Bela Vista, com 2 e 3 dormitórios na faixa de R$ 280 mil a R$ 650 mil. Unidades de até R$ 400 mil costumam se enquadrar no Minha Casa Minha Vida pela renda familiar. ITBI municipal de 3% pela LC 227/2026; verifique a guia da Prefeitura antes da escritura.',
  },
  'osasco|casa|venda': {
    texto:
      'Casas à venda em Osasco aparecem principalmente em bairros consolidados como Presidente Altino, Cipava, Conceição e Km 18, com 2 a 4 dormitórios e preços entre R$ 350 mil e R$ 1,2 milhão. Imóveis menores de R$ 400 mil costumam permitir financiamento via SFH com FGTS. Atenção ao ITBI de 3% (LC 227/2026) e à matrícula atualizada antes da proposta.',
  },
  'osasco|terreno|venda': {
    texto:
      'Terrenos à venda em Osasco aparecem em bairros como Km 18, Conceição e Bela Vista, com lotes de 125 a 400 m² na faixa de R$ 180 mil a R$ 600 mil. Confirme zoneamento e índice construtivo na Secretaria de Planejamento de Osasco antes de assinar a proposta — terreno em ZER tem regras diferentes de terreno em ZM.',
  },
  'osasco|comercial|venda': {
    texto:
      'Imóveis comerciais à venda em Osasco concentram-se no Centro, Bela Vista e Vila Yara, com salas, lojas e galpões para escritórios, clínicas e operações logísticas. Faixa típica de R$ 250 mil a R$ 1,8 milhão. ITBI de 3% pela LC 227/2026 aplica-se também a imóveis comerciais; verifique alvará de funcionamento antes da operação.',
  },
  'barueri|apartamento|venda': {
    texto:
      'Apartamentos à venda em Barueri vão de lançamentos MCMV no Jardim Califórnia, Jardim Tupanci e Vila do Conde (R$ 280 mil a R$ 480 mil) a torres de alto padrão em Tamboré, Vila Yara e Alphaville (R$ 750 mil a R$ 2,2 milhões). ITBI padrão de 5%, reduzido a 1% no SFH. Estação Barueri da CPTM e Castelo Branco a poucos minutos da maior parte dos bairros.',
  },
  'barueri|casa|venda': {
    texto:
      'Casas à venda em Barueri se distribuem entre bairros familiares como Jardim Audir, Jardim Tupanci e Vila do Conde (R$ 380 mil a R$ 750 mil) e condomínios fechados em Alphaville e Tamboré (R$ 1,5 milhão a R$ 8 milhões). ITBI padrão de 5%, com alíquota reduzida de 1% para financiamentos no SFH.',
  },
  'barueri|terreno|venda': {
    texto:
      'Terrenos à venda em Barueri aparecem em bairros como Tamboré, Alphaville (condomínios fechados) e Jardim Audir, com lotes de 250 a 1.000 m² nas faixas de R$ 350 mil a R$ 1,8 milhão. Conferir restrições do condomínio (recuos, gabarito, taxa de ocupação) antes da escritura — em Alphaville e Tamboré as regras são mais rígidas que o zoneamento municipal.',
  },
  'barueri|comercial|venda': {
    texto:
      'Salas e lojas comerciais à venda em Barueri concentram-se nos eixos corporativos de Alphaville (Avenida Tamboré, Calçada das Margaridas) e no Centro, com tickets de R$ 400 mil a R$ 4 milhões. Iguatemi Alphaville, Shopping Tamboré e o Centro Empresarial Tamboré influenciam fortemente o fluxo e a faixa de preço da região.',
  },
  'carapicuiba|apartamento|venda': {
    texto:
      'Apartamentos à venda em Carapicuíba são fortemente influenciados pelo programa MCMV, com 2 dormitórios na faixa de R$ 190 mil a R$ 350 mil em bairros como Vila Sul Americana e proximidades da Estação Carapicuíba da CPTM. ITBI padrão de 2% e 1% no SFH — uma das alíquotas mais baixas da região metropolitana oeste.',
  },
  'carapicuiba|casa|venda': {
    texto:
      'Casas à venda em Carapicuíba estão tipicamente em bairros como Vila Sul Americana, Cohab e Cidade Tamboré, com 2 a 3 dormitórios na faixa de R$ 280 mil a R$ 600 mil. A CPTM Linha 8-Diamante conecta a cidade direto à Estação da Luz e o ITBI de 2% (1% no SFH) torna o custo total de aquisição competitivo na região.',
  },
}

export function getListingCopy(
  cidadeSlug: string,
  categoria: PropertyCategory,
  tipo: 'venda' | 'aluguel',
): string | null {
  return COPY[`${cidadeSlug}|${categoria}|${tipo}` as Key]?.texto ?? null
}
