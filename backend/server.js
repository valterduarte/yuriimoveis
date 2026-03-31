require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const path = require('path')
const pinoHttp = require('pino-http')
const logger = require('./utils/logger')
const { slugify } = require('./utils/slugify')
const { initDB, pool } = require('./database/db')
const seed = require('./database/seed')

const imoveisRouter = require('./routes/imoveis')
const contatoRouter = require('./routes/contato')
const uploadRouter = require('./routes/upload')
const authRouter   = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(compression())
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/api/health' } }))

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://yuriimoveis-frontend.onrender.com',
  'https://yuriimoveis.vercel.app',
  'https://corretoryuri.com.br',
  'https://www.corretoryuri.com.br',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    const allowed = !origin || allowedOrigins.includes(origin)
    cb(null, allowed)
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
})

app.use(globalLimiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',     authRouter)
app.use('/api/imoveis',  imoveisRouter)
app.use('/api/contatos', contatoRouter)
app.use('/api/upload',   uploadRouter)

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const FRONTEND_BASE = process.env.FRONTEND_URL || 'https://yuriimoveis-frontend.onrender.com'

// Rota de preview social — retorna HTML com OG tags corretas para WhatsApp/redes sociais
app.get('/share/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, descricao, cidade, bairro, preco, tipo, imagens FROM imoveis WHERE id = $1 AND ativo = true`,
      [req.params.id]
    )
    if (!rows.length) return res.redirect(`${FRONTEND_BASE}/imoveis`)

    const im = rows[0]
    const imagens = JSON.parse(im.imagens || '[]')
    const image = imagens[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'
    const rawDescription = im.descricao
      ? im.descricao.slice(0, 155).replace(/\n/g, ' ')
      : `${im.titulo} em ${im.cidade || 'Osasco'}, SP.`
    const title       = escapeHtml(`${im.titulo} | Corretor Yuri Imóveis`)
    const description = escapeHtml(rawDescription)
    const url         = `${FRONTEND_BASE}/imoveis/${Number(im.id)}`

    res.set('Content-Type', 'text/html; charset=utf-8')
    res.set('Cache-Control', 'public, max-age=3600')
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="800">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Corretor Yuri Imóveis">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
<script>window.location.replace("${url}")</script>
</body>
</html>`)
  } catch (err) {
    logger.error({ err }, 'Share route error')
    res.redirect(`${FRONTEND_BASE}/imoveis`)
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/sitemap.xml', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, updated_at FROM imoveis WHERE ativo = true ORDER BY id`
    )
    const SITE = 'https://corretoryuri.com.br'
    const today = new Date().toISOString().split('T')[0]
    const urls = [
      `<url><loc>${SITE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${SITE}/imoveis</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${SITE}/contato</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
      ...rows.map(r => {
        const lastmod = r.updated_at ? r.updated_at.toISOString().split('T')[0] : today
        const slug = `${slugify(r.titulo)}-${r.id}`
        return `<url><loc>${SITE}/imoveis/${slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      }),
    ]
    res.set('Content-Type', 'application/xml')
    res.set('Cache-Control', 'public, max-age=3600')
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`)
  } catch (err) {
    logger.error({ err }, 'Sitemap error')
    res.status(500).send('Error generating sitemap')
  }
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error')
  res.status(500).json({ error: 'Erro interno do servidor' })
})

async function start() {
  await initDB()
  logger.info('Tabelas criadas/verificadas')
  await seed()
  app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`)
    logger.info(`API: http://localhost:${PORT}/api`)
  })
}

start().catch(err => {
  logger.error({ err }, 'Erro ao iniciar servidor')
  process.exit(1)
})
