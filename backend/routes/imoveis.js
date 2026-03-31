const express = require('express')
const router = express.Router()
const { pool } = require('../database/db')
const { requireAuth } = require('../middleware/auth')
const logger = require('../utils/logger')

// GET /api/imoveis - list with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      tipo, categoria, cidade, bairro,
      precoMin, precoMax, quartos, destaque,
      ordem = 'recente', page = 1, limit = 9,
    } = req.query

    const { todos } = req.query
    const conditions = todos === 'true' ? [] : ['ativo = true']
    const params = []
    let idx = 1

    if (tipo)     { conditions.push(`tipo = $${idx++}`);           params.push(tipo) }
    if (categoria){ conditions.push(`categoria = $${idx++}`);      params.push(categoria) }
    if (cidade)   { conditions.push(`cidade = $${idx++}`);         params.push(cidade) }
    if (bairro)   { conditions.push(`bairro ILIKE $${idx++}`);     params.push(`%${bairro}%`) }
    if (precoMin) { conditions.push(`preco >= $${idx++}`);         params.push(Number(precoMin)) }
    if (precoMax) { conditions.push(`preco <= $${idx++}`);         params.push(Number(precoMax)) }
    if (destaque) { conditions.push('destaque = true') }
    if (quartos) {
      if (quartos === '4+') {
        conditions.push('quartos >= 4')
      } else {
        conditions.push(`quartos >= $${idx++}`)
        params.push(Number(quartos))
      }
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderMap = {
      recente:     'created_at DESC',
      menor_preco: 'preco ASC',
      maior_preco: 'preco DESC',
      maior_area:  'area DESC',
    }
    const orderClause = `ORDER BY destaque DESC, ${orderMap[ordem] || orderMap.recente}`

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const offset   = (pageNum - 1) * limitNum

    const countResult = await pool.query(`SELECT COUNT(*) as total FROM imoveis ${whereClause}`, params)
    const total = parseInt(countResult.rows[0].total)

    const dataResult = await pool.query(
      `SELECT * FROM imoveis ${whereClause} ${orderClause} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limitNum, offset]
    )

    const imoveis = dataResult.rows.map(row => ({
      ...row,
      imagens:      JSON.parse(row.imagens      || '[]'),
      diferenciais: JSON.parse(row.diferenciais || '[]'),
    }))

    res.set('Cache-Control', 'public, max-age=60')
    res.json({ imoveis, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  } catch (err) {
    logger.error({ err }, 'imoveis route error')
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/imoveis/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM imoveis WHERE id = $1 AND ativo = true', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Imóvel não encontrado' })
    const row = rows[0]
    res.set('Cache-Control', 'public, max-age=300')
    res.json({
      ...row,
      imagens:      JSON.parse(row.imagens      || '[]'),
      diferenciais: JSON.parse(row.diferenciais || '[]'),
    })
  } catch (err) {
    logger.error({ err }, 'imoveis route error')
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /api/imoveis
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      titulo, descricao, descricao_seo, tipo, categoria, preco, area,
      quartos, banheiros, vagas, endereco, bairro, cidade,
      cep, destaque, imagens, diferenciais, status, parcela_display, parcela_label,
    } = req.body

    if (!titulo || !tipo || !categoria || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios: titulo, tipo, categoria, preco' })
    }

    const { rows } = await pool.query(`
      INSERT INTO imoveis (titulo, descricao, descricao_seo, tipo, categoria, preco, area, quartos, banheiros, vagas, endereco, bairro, cidade, cep, destaque, imagens, diferenciais, status, parcela_display, parcela_label)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING id
    `, [
      titulo, descricao || '', descricao_seo || '', tipo, categoria, Number(preco),
      Number(area) || 0, Number(quartos) || 0, Number(banheiros) || 0, Number(vagas) || 0,
      endereco || '', bairro || '', cidade || 'Osasco', cep || '',
      destaque ? true : false,
      JSON.stringify(imagens || []),
      JSON.stringify(diferenciais || []),
      status || 'pronto',
      parcela_display || '',
      parcela_label || '',
    ])

    res.status(201).json({ id: rows[0].id, message: 'Imóvel criado com sucesso' })
  } catch (err) {
    logger.error({ err }, 'imoveis route error')
    res.status(500).json({ error: 'Erro ao criar imóvel' })
  }
})

// PUT /api/imoveis/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await pool.query('SELECT id FROM imoveis WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) return res.status(404).json({ error: 'Imóvel não encontrado' })

    const {
      titulo, descricao, descricao_seo, tipo, categoria, preco, area,
      quartos, banheiros, vagas, endereco, bairro, cidade,
      cep, destaque, imagens, diferenciais, ativo, status, parcela_display, parcela_label,
    } = req.body

    await pool.query(`
      UPDATE imoveis SET
        titulo          = COALESCE($1,  titulo),
        descricao       = COALESCE($2,  descricao),
        descricao_seo   = COALESCE($3,  descricao_seo),
        tipo            = COALESCE($4,  tipo),
        categoria       = COALESCE($5,  categoria),
        preco           = COALESCE($6,  preco),
        area            = COALESCE($7,  area),
        quartos         = COALESCE($8,  quartos),
        banheiros       = COALESCE($9,  banheiros),
        vagas           = COALESCE($10, vagas),
        endereco        = COALESCE($11, endereco),
        bairro          = COALESCE($12, bairro),
        cidade          = COALESCE($13, cidade),
        cep             = COALESCE($14, cep),
        destaque        = COALESCE($15, destaque),
        imagens         = COALESCE($16, imagens),
        diferenciais    = COALESCE($17, diferenciais),
        ativo           = COALESCE($18, ativo),
        status          = COALESCE($19, status),
        parcela_display = COALESCE($20, parcela_display),
        parcela_label   = COALESCE($21, parcela_label),
        updated_at      = NOW()
      WHERE id = $22
    `, [
      titulo, descricao, descricao_seo || null, tipo, categoria,
      preco != null ? Number(preco) : null,
      area  != null ? Number(area)  : null,
      quartos   != null ? Number(quartos)   : null,
      banheiros != null ? Number(banheiros) : null,
      vagas     != null ? Number(vagas)     : null,
      endereco, bairro, cidade, cep,
      destaque  != null ? Boolean(destaque)  : null,
      imagens      ? JSON.stringify(imagens)      : null,
      diferenciais ? JSON.stringify(diferenciais) : null,
      ativo != null ? Boolean(ativo) : null,
      status || null,
      parcela_display || null,
      parcela_label || null,
      req.params.id,
    ])

    res.json({ message: 'Imóvel atualizado com sucesso' })
  } catch (err) {
    logger.error({ err }, 'imoveis route error')
    res.status(500).json({ error: 'Erro ao atualizar imóvel' })
  }
})

// DELETE /api/imoveis/:id (soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE imoveis SET ativo = false, updated_at = NOW() WHERE id = $1',
      [req.params.id]
    )
    if (result.rowCount === 0) return res.status(404).json({ error: 'Imóvel não encontrado' })
    res.json({ message: 'Imóvel removido com sucesso' })
  } catch (err) {
    logger.error({ err }, 'imoveis route error')
    res.status(500).json({ error: 'Erro ao remover imóvel' })
  }
})

module.exports = router
