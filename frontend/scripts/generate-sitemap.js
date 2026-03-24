// Runs before `npm run build` to generate a fresh sitemap.xml from the API
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE = 'https://yuriimoveis.com.br'
const API_URL = process.env.VITE_API_URL || 'https://yuriimoveis-backend.onrender.com'

async function generate() {
  let propertyUrls = ''
  try {
    const res = await fetch(`${API_URL}/api/imoveis?limit=1000&ordem=recente`)
    if (res.ok) {
      const data = await res.json()
      const today = new Date().toISOString().split('T')[0]
      propertyUrls = (data.imoveis || []).map(im =>
        `<url><loc>${SITE}/imoveis/${im.id}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      ).join('')
      console.log(`[sitemap] ${data.imoveis?.length || 0} imóveis incluídos`)
    } else {
      console.warn('[sitemap] API não disponível, usando URLs estáticas apenas')
    }
  } catch (e) {
    console.warn('[sitemap] Erro ao buscar imóveis:', e.message)
  }

  const today = new Date().toISOString().split('T')[0]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE}/imoveis</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE}/contato</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  ${propertyUrls}
</urlset>`

  const out = resolve(__dirname, '../public/sitemap.xml')
  writeFileSync(out, xml, 'utf-8')
  console.log('[sitemap] sitemap.xml gerado em', out)
}

generate()
