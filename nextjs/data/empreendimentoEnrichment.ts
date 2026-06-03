/**
 * Editorial, building-specific facts that the listing database does not carry —
 * the layer that turns a thin development page into the definitive reference for
 * that building. Keyed by empreendimento slug (slugify of the development name).
 *
 * RULE: every value here must be a REAL fact from the developer's material — no
 * guessed amenities, condo fees, tower counts or delivery dates. Any field left
 * out simply does not render, so a building with no entry stays exactly as it is
 * today until its real data is filled in.
 */

export interface EmpreendimentoFicha {
  /** Number of towers. */
  torres?: number
  /** Number of floors per tower. */
  andares?: number
  /** Units per floor. */
  unidadesPorAndar?: number
  /** Parking, as stated by the developer, e.g. "1 a 2 vagas". */
  vagas?: string
  /** Delivery status in plain words, e.g. "Pronto para morar" or "Dezembro de 2026". */
  entrega?: string
}

export interface EmpreendimentoGaleriaItem {
  url: string
  alt: string
}

export interface EmpreendimentoEnrichment {
  /** Editorial narrative paragraphs (context + story, not just bullets). */
  descricao?: string[]
  /** Headline selling points. */
  diferenciais?: string[]
  /** Leisure / common-area amenities (piscina, salão de festas, pet place...). */
  lazer?: string[]
  /** Technical sheet. */
  ficha?: EmpreendimentoFicha
  /** Real photos of the development (façade, common areas, decorated unit). */
  galeria?: EmpreendimentoGaleriaItem[]
  /** Tour/walkthrough video URL, if any. */
  videoUrl?: string
}

/**
 * Fill an entry with real data to upgrade a page. Example shape (commented so no
 * invented data ships):
 *
 *   'ocean-park-condominio-clube': {
 *     descricao: ['O Ocean Park ...'],
 *     diferenciais: ['...'],
 *     lazer: ['Piscina', 'Salão de festas', ...],
 *     ficha: { torres: 0, andares: 0, vagas: '1 vaga', entrega: 'Pronto para morar' },
 *     galeria: [{ url: '/empreendimentos/ocean-park/fachada.jpg', alt: 'Fachada do Ocean Park' }],
 *   },
 */
export const EMPREENDIMENTO_ENRICHMENT: Record<string, EmpreendimentoEnrichment> = {}

export function getEmpreendimentoEnrichment(slug: string): EmpreendimentoEnrichment | null {
  return EMPREENDIMENTO_ENRICHMENT[slug] ?? null
}
