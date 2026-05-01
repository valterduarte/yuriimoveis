import { readdir, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import matter from 'gray-matter'
import { marked } from 'marked'
import { Pool } from '@neondatabase/serverless'

const __dirname = dirname(fileURLToPath(import.meta.url))

config({ path: join(__dirname, '..', '.env.local') })
config({ path: join(__dirname, '..', '.env') })

const POSTS_DIR = join(__dirname, 'blog-posts')

interface PostFrontmatter {
  titulo: string
  slug: string
  resumo: string
  meta_titulo: string
  meta_descricao: string
  imagem_capa: string
  tags: string[]
  publicado: boolean
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não definida. Configure em .env.local')
    process.exit(1)
  }

  const files = await readdir(POSTS_DIR)
  const mdFiles = files.filter(name => name.endsWith('.md')).sort()

  if (mdFiles.length === 0) {
    console.log('Nenhum arquivo .md encontrado em', POSTS_DIR)
    return
  }

  console.log(`Processando ${mdFiles.length} posts de ${POSTS_DIR}\n`)

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  let created = 0
  let updated = 0

  for (const filename of mdFiles) {
    const raw = await readFile(join(POSTS_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as PostFrontmatter

    const missing = ['titulo', 'slug', 'resumo'].filter(key => !fm[key as keyof PostFrontmatter])
    if (missing.length > 0) {
      console.error(`✗ ${filename}: campos obrigatórios ausentes: ${missing.join(', ')}`)
      continue
    }

    const html = await marked.parse(content)

    const result = await pool.query(
      `INSERT INTO blog_posts
         (titulo, slug, resumo, conteudo, imagem_capa, meta_titulo, meta_descricao, tags, publicado, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         titulo = EXCLUDED.titulo,
         resumo = EXCLUDED.resumo,
         conteudo = EXCLUDED.conteudo,
         imagem_capa = EXCLUDED.imagem_capa,
         meta_titulo = EXCLUDED.meta_titulo,
         meta_descricao = EXCLUDED.meta_descricao,
         tags = EXCLUDED.tags,
         publicado = EXCLUDED.publicado,
         updated_at = NOW()
       RETURNING (xmax = 0) AS inserted`,
      [
        fm.titulo,
        fm.slug,
        fm.resumo,
        html,
        fm.imagem_capa ?? '',
        fm.meta_titulo ?? '',
        fm.meta_descricao ?? '',
        JSON.stringify(fm.tags ?? []),
        fm.publicado ?? true,
      ],
    )

    if (result.rows[0].inserted) {
      console.log(`✓ Criado:    ${fm.slug}`)
      created++
    } else {
      console.log(`↻ Atualizado: ${fm.slug}`)
      updated++
    }
  }

  await pool.end()
  console.log(`\nConcluído. Criados: ${created}. Atualizados: ${updated}.`)
}

main().catch(err => {
  console.error('Erro ao executar seed:', err)
  process.exit(1)
})
