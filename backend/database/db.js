const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_DIR = path.join(__dirname)
const DB_PATH = path.join(DB_DIR, 'canelaforce.db')

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)

// Enable WAL mode for performance
db.pragma('journal_mode = WAL')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS imoveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT NOT NULL CHECK(tipo IN ('venda', 'aluguel')),
    categoria TEXT NOT NULL,
    preco REAL NOT NULL,
    area REAL DEFAULT 0,
    quartos INTEGER DEFAULT 0,
    banheiros INTEGER DEFAULT 0,
    vagas INTEGER DEFAULT 0,
    endereco TEXT,
    bairro TEXT,
    cidade TEXT DEFAULT 'Canela',
    estado TEXT DEFAULT 'RS',
    cep TEXT,
    lat REAL,
    lng REAL,
    destaque INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    imagens TEXT DEFAULT '[]',
    diferenciais TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    assunto TEXT,
    mensagem TEXT NOT NULL,
    lido INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

module.exports = db
