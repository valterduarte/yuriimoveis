const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const { pool } = require('../database/db')
const { requireAuth } = require('../middleware/auth')
const logger = require('../utils/logger')
const { contatoSchema } = require('../utils/schemas')

const contatoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de mensagens atingido. Tente novamente em 1 hora.' },
})

// POST /api/contato
router.post('/', contatoLimiter, async (req, res) => {
  const parsed = contatoSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { nome, email, telefone, assunto, mensagem, imovel_id } = parsed.data
  try {
    const { rows } = await pool.query(`
      INSERT INTO contatos (nome, email, telefone, assunto, mensagem, imovel_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [nome, email, telefone, assunto, mensagem, imovel_id ?? null])

    logger.info({ nome, email }, 'novo contato recebido')

    res.status(201).json({ id: rows[0].id, message: 'Mensagem enviada com sucesso!' })
  } catch (err) {
    logger.error({ err }, 'contato route error')
    res.status(500).json({ error: 'Erro ao processar mensagem' })
  }
})

// GET /api/contatos (admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))
    const offset = (page - 1) * limit

    const countResult = await pool.query('SELECT COUNT(*) as total FROM contatos')
    const total = parseInt(countResult.rows[0].total)

    const { rows } = await pool.query(
      'SELECT * FROM contatos ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )
    res.json({ contatos: rows, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PATCH /api/contato/:id/lido
router.patch('/:id/lido', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE contatos SET lido = true WHERE id = $1', [req.params.id])
    res.json({ message: 'Marcado como lido' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
