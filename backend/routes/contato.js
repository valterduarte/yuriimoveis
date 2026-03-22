const express = require('express')
const router = express.Router()
const { pool } = require('../database/db')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// POST /api/contato
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, assunto, mensagem, imovel_id } = req.body

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, mensagem' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido' })
    }

    const { rows } = await pool.query(`
      INSERT INTO contatos (nome, email, telefone, assunto, mensagem, imovel_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [nome, email, telefone || '', assunto || '', mensagem, imovel_id || null])

    console.log(`📩 Novo contato: ${nome} <${email}>`)

    transporter.sendMail({
      from: `"Yuri Imóveis" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Novo contato: ${assunto || 'Sem assunto'} - ${nome}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
        <p><strong>Assunto:</strong> ${assunto || 'Não informado'}</p>
        <p><strong>Mensagem:</strong><br>${mensagem}</p>
        ${imovel_id ? `<p><strong>Imóvel ID:</strong> ${imovel_id}</p>` : ''}
      `,
    }).catch(err => console.error('Erro ao enviar email:', err))

    res.status(201).json({ id: rows[0].id, message: 'Mensagem enviada com sucesso!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao processar mensagem' })
  }
})

// GET /api/contato (admin)
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contatos ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PATCH /api/contato/:id/lido
router.patch('/:id/lido', async (req, res) => {
  try {
    await pool.query('UPDATE contatos SET lido = true WHERE id = $1', [req.params.id])
    res.json({ message: 'Marcado como lido' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
