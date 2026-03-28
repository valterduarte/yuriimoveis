const request = require('supertest')
const express = require('express')
const jwt = require('jsonwebtoken')

// Configura variáveis de ambiente antes de importar a rota
process.env.ADMIN_USER = 'admin'
process.env.ADMIN_PASSWORD = 'senha-de-teste-123'
process.env.JWT_SECRET = 'segredo-de-teste'

const authRouter = require('./auth')

const app = express()
app.use(express.json())
app.use('/api/auth', authRouter)

describe('POST /api/auth/login', () => {
  test('retorna token com credenciais corretas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin', senha: 'senha-de-teste-123' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(typeof res.body.token).toBe('string')
    expect(res.body.expiresIn).toBe(28800) // 8h em segundos
  })

  test('token gerado contém role admin e sub correto', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin', senha: 'senha-de-teste-123' })

    const decoded = jwt.verify(res.body.token, 'segredo-de-teste')
    expect(decoded.role).toBe('admin')
    expect(decoded.sub).toBe('admin')
  })

  test('retorna 401 com senha errada', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin', senha: 'senha-errada' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })

  test('retorna 401 com usuário errado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'hacker', senha: 'senha-de-teste-123' })

    expect(res.status).toBe(401)
  })

  test('retorna 400 sem enviar corpo', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('retorna 400 com apenas o usuário', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin' })

    expect(res.status).toBe(400)
  })

  test('não revela se foi o usuário ou a senha que errou', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin', senha: 'errada' })

    // Mensagem genérica — não diz "usuário não existe" nem "senha errada"
    expect(res.body.error).toBe('Usuário ou senha incorretos')
  })
})
