export type TransactionType = 'venda' | 'aluguel'
export type PropertyCategory = 'casa' | 'apartamento' | 'terreno' | 'chale' | 'comercial' | 'chacara'
export type PropertyStatus = 'pronto' | 'construcao' | 'planta'
export type SortOrder = 'recente' | 'menor_preco' | 'maior_preco' | 'maior_area'

export interface Imovel {
  id: number
  titulo: string
  descricao: string
  descricao_seo: string
  tipo: TransactionType
  categoria: PropertyCategory
  preco: number
  area: number
  quartos: number
  banheiros: number
  vagas: number
  endereco: string
  bairro: string
  cidade: string
  cep: string
  status: PropertyStatus
  destaque: boolean
  ativo: boolean
  imagens: string[]
  diferenciais: string[]
  parcela_display: string
  parcela_label: string
  created_at: string
  updated_at: string
  // Optional fields used in some views
  subtitulo?: string
  estado?: string
  area_display?: string
  vagas_display?: string
  lat?: number
  lng?: number
}

export interface ImovelRow extends Omit<Imovel, 'imagens' | 'diferenciais'> {
  imagens: string
  diferenciais: string
}

export interface Contato {
  id: number
  nome: string
  email: string
  telefone: string
  assunto: string
  mensagem: string
  imovel_id: number | null
  lido: boolean
  created_at: string
}

export interface PropertyListResult {
  imoveis: Imovel[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface PropertyFilters {
  tipo?: string
  categoria?: string
  cidade?: string
  bairro?: string
  precoMin?: string
  precoMax?: string
  quartos?: string
  codigo?: string
  destaque?: string
  todos?: string | boolean
  ordem?: string
  page?: string | number
  limit?: string | number
}

export interface BairroContent {
  sobre: string
  infraestrutura: string
  transporte: string
  educacao: string
  porqueMorar: string
}

export interface BairroData {
  nome: string
  slug: string
  titulo: string
  descricaoMeta: string
  imagem?: string
  conteudo: BairroContent
}
