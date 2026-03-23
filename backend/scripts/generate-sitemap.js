require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const fs = require('fs')
const path = require('path')
const { pool } = require('../database/db')

const SITE_URL = 'https://yuriimoveis.com.br'
const OUTPUT   = path.join(__dirname, '../../frontend/public/sitemap.xml')

async function generate() {
  const { rows } = await pool.query(
    'SELECT id, updated_at FROM imoveis WHERE ativo = true ORDER BY id'
  )

  const staticPages = [
    { loc: '/',        changefreq: 'weekly',  priority: '1.0' },
    { loc: '/imoveis', changefreq: 'daily',   priority: '0.9' },
    { loc: '/contato', changefreq: 'monthly', priority: '0.7' },
  ]

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...rows.map(r => `
  <url>
    <loc>${SITE_URL}/imoveis/${r.id}</loc>
    <lastmod>${new Date(r.updated_at).toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>\n`

  fs.writeFileSync(OUTPUT, xml)
  console.log(`✅ Sitemap gerado: ${rows.length} imóveis + 3 páginas estáticas → ${OUTPUT}`)
  await pool.end()
}

generate().catch(err => {
  console.error('❌ Erro ao gerar sitemap:', err.message)
  process.exit(1)
})
