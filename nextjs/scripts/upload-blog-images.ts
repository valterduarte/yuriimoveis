import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = join(__dirname, 'blog-posts')
const CLOUD = 'dfl3eskr9'
const PRESET = 'Yuri-upload'

interface CloudinaryResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

async function uploadToCloudinary(sourceUrl: string, publicId: string): Promise<string> {
  const form = new FormData()
  form.append('file', sourceUrl)
  form.append('upload_preset', PRESET)
  form.append('folder', 'blog')
  form.append('public_id', publicId)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) throw new Error(`Cloudinary ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as CloudinaryResponse
  return data.secure_url
}

async function main() {
  const files = (await readdir(POSTS_DIR)).filter(f => f.endsWith('.md')).sort()
  console.log(`Processando ${files.length} posts\n`)

  for (const filename of files) {
    const path = join(POSTS_DIR, filename)
    const raw = await readFile(path, 'utf-8')

    const slugMatch = raw.match(/^slug:\s*["']?([^"'\n]+)["']?/m)
    const imgMatch = raw.match(/^imagem_capa:\s*["']?([^"'\n]+)["']?/m)

    if (!slugMatch || !imgMatch) {
      console.error(`✗ ${filename}: slug ou imagem_capa ausente`)
      continue
    }

    const slug = slugMatch[1].trim()
    const currentUrl = imgMatch[1].trim()

    if (currentUrl.includes('res.cloudinary.com')) {
      console.log(`↷ ${slug}: já está no Cloudinary, pulando`)
      continue
    }

    try {
      console.log(`↑ ${slug}: enviando ${currentUrl.slice(0, 60)}...`)
      const secureUrl = await uploadToCloudinary(currentUrl, slug)
      const updated = raw.replace(
        /^imagem_capa:\s*["']?[^"'\n]+["']?\s*$/m,
        `imagem_capa: "${secureUrl}"`,
      )
      await writeFile(path, updated, 'utf-8')
      console.log(`✓ ${slug}: ${secureUrl}`)
    } catch (err) {
      console.error(`✗ ${slug}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\nConcluído.')
}

main().catch(err => {
  console.error('Erro:', err)
  process.exit(1)
})
