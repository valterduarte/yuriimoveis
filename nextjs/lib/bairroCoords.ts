export interface LatLng {
  lat: number
  lng: number
}

const CITY_CENTROIDS: Record<string, LatLng> = {
  osasco:      { lat: -23.5329, lng: -46.7917 },
  barueri:     { lat: -23.5106, lng: -46.8761 },
  carapicuiba: { lat: -23.5226, lng: -46.8358 },
  cotia:       { lat: -23.6037, lng: -46.9191 },
}

// Coordinates sourced from OpenStreetMap Nominatim (see
// scripts/fetch-bairro-coords.ts). Centro fell back to the city centroid
// because Nominatim resolved "Centro, Osasco" to a different region;
// Vila Isabel and Vila Ayrosa were not found by Nominatim and keep
// hand-curated values.
const BAIRRO_CENTROIDS: Record<string, LatLng> = {
  // Osasco
  'centro':                  { lat: -23.5329, lng: -46.7917 }, // city centroid (Nominatim fallback)
  'bela-vista':              { lat: -23.5540, lng: -46.7827 },
  'cipava':                  { lat: -23.5426, lng: -46.7870 },
  'conceicao':               { lat: -23.5777, lng: -46.8013 },
  'jaguaribe':               { lat: -23.5567, lng: -46.7875 },
  'km-18':                   { lat: -23.5249, lng: -46.8043 },
  'presidente-altino':       { lat: -23.5312, lng: -46.7617 },
  'santa-maria':             { lat: -23.5832, lng: -46.8111 },
  'vila-isabel':             { lat: -23.5310, lng: -46.7990 }, // hand-curated (not in Nominatim)
  'metalurgicos':            { lat: -23.5748, lng: -46.7986 },
  'jardim-roberto':          { lat: -23.5440, lng: -46.8026 },
  'padroeira':               { lat: -23.5566, lng: -46.8122 },
  'rochdale':                { lat: -23.5074, lng: -46.7777 },
  'vila-ayrosa':             { lat: -23.5350, lng: -46.7830 }, // hand-curated (not in Nominatim)
  'vila-yara':               { lat: -23.5508, lng: -46.7617 },
  // Barueri
  'jardim-esperanca':        { lat: -23.4914, lng: -46.8779 },
  'cruz-preta':              { lat: -23.4931, lng: -46.8805 },
  'alphaville':              { lat: -23.4990, lng: -46.8478 },
  'jardim-julio':            { lat: -23.5486, lng: -46.8852 },
  'jardim-california':       { lat: -23.4946, lng: -46.8958 },
  'aldeia':                  { lat: -23.5296, lng: -46.8702 },
  'jardim-tupanci':          { lat: -23.4939, lng: -46.8701 },
  'jardim-silveira':         { lat: -23.5235, lng: -46.8935 },
  'vila-do-conde':           { lat: -23.5327, lng: -46.8654 },
  'centro-comercial-jubran': { lat: -23.5048, lng: -46.8380 },
  'tambore':                 { lat: -23.5099, lng: -46.8253 },
  'jardim-audir':            { lat: -23.5251, lng: -46.8880 },
  // Carapicuíba
  'vila-sul-americana':      { lat: -23.5239, lng: -46.8580 },
}

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

export function coordsForBairro(bairro: string | null | undefined, cidade: string | null | undefined): LatLng | null {
  if (bairro) {
    const slug = slugify(bairro)
    if (BAIRRO_CENTROIDS[slug]) return BAIRRO_CENTROIDS[slug]
  }
  if (cidade) {
    const slug = slugify(cidade)
    if (CITY_CENTROIDS[slug]) return CITY_CENTROIDS[slug]
  }
  return null
}

// Deterministic jitter applied to each imovel so multiple listings in the
// same bairro don't stack on the same pin. The privacy intent is preserved
// while keeping the pin within ~50m of the bairro centroid (vs. the
// previous ~220m, which was wide enough to push pins into neighbouring
// bairros). Imoveis with their own lat/lng skip this entirely
// (PropertyLocationSection prefers the explicit coord).
const JITTER_DIVISOR = 200000 // ~±0.0005 deg ~ ±55m

export function coordsForImovel(id: number, bairro: string, cidade: string): LatLng | null {
  const base = coordsForBairro(bairro, cidade)
  if (!base) return null
  const offsetLat = ((id * 37) % 200 - 100) / JITTER_DIVISOR
  const offsetLng = ((id * 53) % 200 - 100) / JITTER_DIVISOR
  return { lat: base.lat + offsetLat, lng: base.lng + offsetLng }
}

export const DEFAULT_MAP_CENTER: LatLng = { lat: -23.5329, lng: -46.7917 }
export const DEFAULT_MAP_ZOOM = 12
