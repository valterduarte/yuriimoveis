import { API_URL } from './config'

export async function fetchFeaturedProperties() {
  try {
    const res = await fetch(`${API_URL}/api/imoveis?destaque=1&limit=6`, { cache: 'no-store' })
    const data = await res.json()
    return data.imoveis || []
  } catch {
    return []
  }
}

export async function fetchImovel(id) {
  try {
    const res = await fetch(`${API_URL}/api/imoveis/${id}`, {
      next: { revalidate: 3600 },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('fetch failed')
    return res.json()
  } catch {
    return null
  }
}

export async function fetchPropertiesByBairro(bairroName) {
  try {
    const res = await fetch(
      `${API_URL}/api/imoveis?bairro=${encodeURIComponent(bairroName)}&limit=50`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return { imoveis: [], total: 0 }
    return res.json()
  } catch {
    return { imoveis: [], total: 0 }
  }
}

export async function fetchAllPropertySlugs() {
  try {
    const res = await fetch(`${API_URL}/api/imoveis?limit=1000&ordem=recente`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.imoveis || []
  } catch {
    return []
  }
}
