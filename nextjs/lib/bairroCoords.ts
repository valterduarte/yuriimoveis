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

const BAIRRO_CENTROIDS: Record<string, LatLng> = {
  // Osasco
  'centro':                  { lat: -23.5329, lng: -46.7917 },
  'bela-vista':              { lat: -23.5400, lng: -46.7820 },
  'cipava':                  { lat: -23.5180, lng: -46.7780 },
  'conceicao':               { lat: -23.5400, lng: -46.7700 },
  'jaguaribe':               { lat: -23.5500, lng: -46.7600 },
  'km-18':                   { lat: -23.5670, lng: -46.8260 },
  'presidente-altino':       { lat: -23.5240, lng: -46.7560 },
  'santa-maria':             { lat: -23.5180, lng: -46.7670 },
  'vila-isabel':             { lat: -23.5310, lng: -46.7990 },
  'metalurgicos':            { lat: -23.5210, lng: -46.7820 },
  'jardim-roberto':          { lat: -23.5190, lng: -46.8060 },
  'padroeira':               { lat: -23.5500, lng: -46.7920 },
  'rochdale':                { lat: -23.5430, lng: -46.7790 },
  'vila-ayrosa':             { lat: -23.5350, lng: -46.7830 },
  'vila-yara':               { lat: -23.5430, lng: -46.7620 },
  // Barueri
  'jardim-esperanca':        { lat: -23.5260, lng: -46.8780 },
  'cruz-preta':              { lat: -23.5160, lng: -46.8950 },
  'alphaville':              { lat: -23.5050, lng: -46.8520 },
  'parque-barueri':          { lat: -23.5070, lng: -46.8840 },
  'tambore':                 { lat: -23.5150, lng: -46.8450 },
  'jardim-julio':            { lat: -23.5170, lng: -46.8830 },
  'jardim-california':       { lat: -23.5180, lng: -46.8810 },
  'aldeia':                  { lat: -23.5340, lng: -46.8600 },
  'jardim-tupanci':          { lat: -23.5230, lng: -46.8770 },
  'jardim-silveira':         { lat: -23.5290, lng: -46.8780 },
  'vila-do-conde':           { lat: -23.5180, lng: -46.8740 },
  'centro-comercial-jubran': { lat: -23.5160, lng: -46.8770 },
  'jardim-audir':            { lat: -23.5210, lng: -46.8830 },
  // Carapicuíba
  'vila-sul-americana':      { lat: -23.5230, lng: -46.8330 },
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

export function coordsForImovel(id: number, bairro: string, cidade: string): LatLng | null {
  const base = coordsForBairro(bairro, cidade)
  if (!base) return null
  // Deterministic jitter so multiple imoveis in the same bairro don't stack
  const offsetLat = ((id * 37) % 200 - 100) / 50000  // ~±0.002 deg ~ ±220m
  const offsetLng = ((id * 53) % 200 - 100) / 50000
  return { lat: base.lat + offsetLat, lng: base.lng + offsetLng }
}

export const DEFAULT_MAP_CENTER: LatLng = { lat: -23.5329, lng: -46.7917 }
export const DEFAULT_MAP_ZOOM = 12
