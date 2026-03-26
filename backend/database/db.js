const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS imoveis (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      descricao TEXT DEFAULT '',
      tipo TEXT NOT NULL CHECK(tipo IN ('venda', 'aluguel')),
      categoria TEXT NOT NULL,
      preco NUMERIC NOT NULL,
      area NUMERIC DEFAULT 0,
      quartos INTEGER DEFAULT 0,
      banheiros INTEGER DEFAULT 0,
      vagas INTEGER DEFAULT 0,
      endereco TEXT DEFAULT '',
      bairro TEXT DEFAULT '',
      cidade TEXT DEFAULT 'Osasco',
      estado TEXT DEFAULT 'SP',
      cep TEXT DEFAULT '',
      lat NUMERIC,
      lng NUMERIC,
      status TEXT DEFAULT 'pronto',
      parcela_display TEXT DEFAULT '',
      destaque BOOLEAN DEFAULT false,
      ativo BOOLEAN DEFAULT true,
      imagens TEXT DEFAULT '[]',
      diferenciais TEXT DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Migrations: adiciona colunas se não existirem
  await pool.query(`ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pronto'`)
  await pool.query(`ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS parcela_display TEXT DEFAULT ''`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contatos (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT DEFAULT '',
      assunto TEXT DEFAULT '',
      mensagem TEXT NOT NULL,
      imovel_id INTEGER,
      lido BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

module.exports = { pool, initDB }
