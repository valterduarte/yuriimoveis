const express = require('express')
const router = express.Router()
const db = require('../database/db')

// POST /api/contato
router.post('/', (req, res) => {
  try {
    const { nome, email, telefone, assunto, mensagem } = req.body

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, mensagem' })
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido' })
    }

    const stmt = db.prepare(`
      INSERT INTO contatos (nome, email, telefone, assunto, mensagem)
      VALUES (@nome, @email, @telefone, @assunto, @mensagem)
    `)
    const result = stmt.run({ nome, email, telefone: telefone || '', assunto: assunto || '', mensagem })

    console.log(`📩 Novo contato: ${nome} <${email}>`)

    res.status(201).json({ id: result.lastInsertRowid, message: 'Mensagem enviada com sucesso!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao processar mensagem' })
  }
})

// GET /api/contato (admin)
router.get('/', (req, res) => {
  try {
    const contatos = db.prepare('SELECT * FROM contatos ORDER BY created_at DESC').all()
    res.json(contatos)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PATCH /api/contato/:id/lido
router.patch('/:id/lido', (req, res) => {
  try {
    db.prepare('UPDATE contatos SET lido = 1 WHERE id = ?').run(req.params.id)
    res.json({ message: 'Marcado como lido' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
