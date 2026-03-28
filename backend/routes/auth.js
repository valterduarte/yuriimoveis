const express = require('express')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
})

// POST /api/auth/login
router.post('/login', loginLimiter, (req, res) => {
  const { usuario, senha } = req.body

  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Informe usuário e senha' })
  }

  const adminUser = process.env.ADMIN_USER
  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret = process.env.JWT_SECRET

  if (!adminUser || !adminPassword || !jwtSecret) {
    return res.status(500).json({ error: 'Configuração de autenticação ausente no servidor' })
  }

  if (usuario !== adminUser || senha !== adminPassword) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos' })
  }

  const token = jwt.sign(
    { sub: usuario, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  )

  res.json({ token, expiresIn: 8 * 3600 })
})

module.exports = router
