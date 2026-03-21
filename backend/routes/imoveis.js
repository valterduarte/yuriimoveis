const express = require('express')
const router = express.Router()
const db = require('../database/db')

// GET /api/imoveis - list with filters and pagination
router.get('/', (req, res) => {
  try {
    const {
      tipo, categoria, cidade, bairro,
      precoMin, precoMax, quartos, destaque,
      ordem = 'recente', page = 1, limit = 9,
    } = req.query

    let where = ['ativo = 1']
    const params = {}

    if (tipo) { where.push('tipo = @tipo'); params.tipo = tipo }
    if (categoria) { where.push('categoria = @categoria'); params.categoria = categoria }
    if (cidade) { where.push('cidade = @cidade'); params.cidade = cidade }
    if (bairro) { where.push('bairro LIKE @bairro'); params.bairro = `%${bairro}%` }
    if (precoMin) { where.push('preco >= @precoMin'); params.precoMin = Number(precoMin) }
    if (precoMax) { where.push('preco <= @precoMax'); params.precoMax = Number(precoMax) }
    if (destaque) { where.push('destaque = 1') }
    if (quartos) {
      if (quartos === '4+') {
        where.push('quartos >= 4')
      } else {
        where.push('quartos >= @quartos')
        params.quartos = Number(quartos)
      }
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const orderMap = {
      recente: 'created_at DESC',
      menor_preco: 'preco ASC',
      maior_preco: 'preco DESC',
      maior_area: 'area DESC',
    }
    const orderClause = `ORDER BY destaque DESC, ${orderMap[ordem] || orderMap.recente}`

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const offset = (pageNum - 1) * limitNum

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM imoveis ${whereClause}`)
    const { total } = countStmt.get(params)

    const stmt = db.prepare(
      `SELECT * FROM imoveis ${whereClause} ${orderClause} LIMIT @limit OFFSET @offset`
    )
    const rows = stmt.all({ ...params, limit: limitNum, offset })

    const imoveis = rows.map(row => ({
      ...row,
      imagens: JSON.parse(row.imagens || '[]'),
      diferenciais: JSON.parse(row.diferenciais || '[]'),
      destaque: Boolean(row.destaque),
      ativo: Boolean(row.ativo),
    }))

    res.json({ imoveis, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/imoveis/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM imoveis WHERE id = ? AND ativo = 1').get(req.params.id)
    if (!row) return res.status(404).json({ error: 'Imóvel não encontrado' })
    res.json({
      ...row,
      imagens: JSON.parse(row.imagens || '[]'),
      diferenciais: JSON.parse(row.diferenciais || '[]'),
      destaque: Boolean(row.destaque),
      ativo: Boolean(row.ativo),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /api/imoveis - create
router.post('/', (req, res) => {
  try {
    const {
      titulo, descricao, tipo, categoria, preco, area,
      quartos, banheiros, vagas, endereco, bairro, cidade,
      cep, destaque, imagens, diferenciais,
    } = req.body

    if (!titulo || !tipo || !categoria || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios: titulo, tipo, categoria, preco' })
    }

    const stmt = db.prepare(`
      INSERT INTO imoveis (titulo, descricao, tipo, categoria, preco, area, quartos, banheiros, vagas, endereco, bairro, cidade, cep, destaque, imagens, diferenciais)
      VALUES (@titulo, @descricao, @tipo, @categoria, @preco, @area, @quartos, @banheiros, @vagas, @endereco, @bairro, @cidade, @cep, @destaque, @imagens, @diferenciais)
    `)
    const result = stmt.run({
      titulo, descricao: descricao || '',
      tipo, categoria, preco: Number(preco),
      area: Number(area) || 0,
      quartos: Number(quartos) || 0,
      banheiros: Number(banheiros) || 0,
      vagas: Number(vagas) || 0,
      endereco: endereco || '', bairro: bairro || '',
      cidade: cidade || 'Canela', cep: cep || '',
      destaque: destaque ? 1 : 0,
      imagens: JSON.stringify(imagens || []),
      diferenciais: JSON.stringify(diferenciais || []),
    })

    res.status(201).json({ id: result.lastInsertRowid, message: 'Imóvel criado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar imóvel' })
  }
})

// PUT /api/imoveis/:id
router.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM imoveis WHERE id = ?').get(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Imóvel não encontrado' })

    const {
      titulo, descricao, tipo, categoria, preco, area,
      quartos, banheiros, vagas, endereco, bairro, cidade,
      cep, destaque, imagens, diferenciais, ativo,
    } = req.body

    db.prepare(`
      UPDATE imoveis SET
        titulo = COALESCE(@titulo, titulo),
        descricao = COALESCE(@descricao, descricao),
        tipo = COALESCE(@tipo, tipo),
        categoria = COALESCE(@categoria, categoria),
        preco = COALESCE(@preco, preco),
        area = COALESCE(@area, area),
        quartos = COALESCE(@quartos, quartos),
        banheiros = COALESCE(@banheiros, banheiros),
        vagas = COALESCE(@vagas, vagas),
        endereco = COALESCE(@endereco, endereco),
        bairro = COALESCE(@bairro, bairro),
        cidade = COALESCE(@cidade, cidade),
        cep = COALESCE(@cep, cep),
        destaque = COALESCE(@destaque, destaque),
        imagens = COALESCE(@imagens, imagens),
        diferenciais = COALESCE(@diferenciais, diferenciais),
        ativo = COALESCE(@ativo, ativo),
        updated_at = datetime('now')
      WHERE id = @id
    `).run({
      titulo, descricao, tipo, categoria,
      preco: preco != null ? Number(preco) : null,
      area: area != null ? Number(area) : null,
      quartos: quartos != null ? Number(quartos) : null,
      banheiros: banheiros != null ? Number(banheiros) : null,
      vagas: vagas != null ? Number(vagas) : null,
      endereco, bairro, cidade, cep,
      destaque: destaque != null ? (destaque ? 1 : 0) : null,
      imagens: imagens ? JSON.stringify(imagens) : null,
      diferenciais: diferenciais ? JSON.stringify(diferenciais) : null,
      ativo: ativo != null ? (ativo ? 1 : 0) : null,
      id: req.params.id,
    })

    res.json({ message: 'Imóvel atualizado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar imóvel' })
  }
})

// DELETE /api/imoveis/:id (soft delete)
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare("UPDATE imoveis SET ativo = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ error: 'Imóvel não encontrado' })
    res.json({ message: 'Imóvel removido com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao remover imóvel' })
  }
})

module.exports = router
