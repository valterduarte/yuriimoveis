require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const { initDB } = require('./database/db')
const seed = require('./database/seed')

const imoveisRouter = require('./routes/imoveis')
const contatoRouter = require('./routes/contato')

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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

app.use('/api/imoveis', imoveisRouter)
app.use('/api/contatos', contatoRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

async function start() {
  await initDB()
  console.log('✅ Tabelas criadas/verificadas')
  await seed()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
    console.log(`📊 API: http://localhost:${PORT}/api`)
  })
}

start().catch(err => {
  console.error('❌ Erro ao iniciar servidor:', err)
  process.exit(1)
})
