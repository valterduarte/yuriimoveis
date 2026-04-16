CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(250) NOT NULL UNIQUE,
  resumo VARCHAR(500) NOT NULL DEFAULT '',
  conteudo TEXT NOT NULL DEFAULT '',
  imagem_capa VARCHAR(500) DEFAULT '',
  meta_titulo VARCHAR(200) DEFAULT '',
  meta_descricao VARCHAR(300) DEFAULT '',
  tags TEXT DEFAULT '[]',
  publicado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publicado ON blog_posts (publicado, created_at DESC);
