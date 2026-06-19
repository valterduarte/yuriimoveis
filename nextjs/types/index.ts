export type TransactionType = 'venda' | 'aluguel'
export type PropertyCategory = 'casa' | 'apartamento' | 'terreno' | 'chale' | 'comercial' | 'chacara'
export type PropertyStatus = 'pronto' | 'construcao' | 'planta'

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
  /** Explicit development this unit belongs to (overrides title parsing for grouping). */
  empreendimento?: string | null
  /** Cloudinary video URL for the optional property tour section. */
  video_url?: string | null
  /**
   * Tower/block label within a development, e.g. "Torre A".
   * SENSITIVE / admin-only: present only on records read by the authenticated
   * admin (the edit form). `parseImovel` strips it from public responses.
   */
  torre?: string | null
  /**
   * Apartment/unit number within the building, e.g. "142".
   * SENSITIVE / admin-only: the broker's internal reference. Never returned in
   * public responses nor rendered on the public site.
   */
  numero_apartamento?: string | null
  /**
   * Free-text internal notes (where the keys are, how to schedule a visit, etc.).
   * SENSITIVE / admin-only: the broker's private memo. `parseImovel` strips it
   * from public responses and it is never rendered on the public site.
   */
  observacoes?: string | null
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
  amenity?: string
  codigo?: string
  destaque?: string
  todos?: string | boolean
  ordem?: string
  page?: string | number
  limit?: string | number
}

export interface BlogPost {
  id: number
  titulo: string
  slug: string
  resumo: string
  conteudo: string
  imagem_capa: string
  meta_titulo: string
  meta_descricao: string
  tags: string[]
  publicado: boolean
  created_at: string
  updated_at: string
}

export interface BlogPostRow extends Omit<BlogPost, 'tags'> {
  tags: string
}

interface BairroContent {
  sobre: string
  infraestrutura: string
  transporte: string
  educacao: string
  porqueMorar: string
}

export interface BairroPriceInsight {
  m2: number
  apartamento2qts?: number
  casa3qts?: number
  fonte?: string
  atualizadoEm: string
}

export interface BairroData {
  nome: string
  slug: string
  cidade: string
  titulo: string
  descricaoMeta: string
  imagem?: string
  dbMatch?: string
  /**
   * Renderiza o guia de bairro mesmo sem imóveis cadastrados, como conteúdo
   * de SEO local independente do estoque. As seções transacionais (listagens
   * e destaques) só aparecem quando houver imóveis no banco.
   */
  guiaIndependente?: boolean
  precoMedio?: BairroPriceInsight
  relatedPost?: { href: string; label: string }
  conteudo: BairroContent
}
