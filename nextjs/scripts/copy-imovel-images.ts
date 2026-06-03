import { config } from 'dotenv'
import { Pool } from '@neondatabase/serverless'

config({ path: '.env.local' })

/**
 * Copies the `imagens` column from one property to another.
 *
 *   npx tsx scripts/copy-imovel-images.ts <sourceId> <targetId>           # dry run
 *   npx tsx scripts/copy-imovel-images.ts <sourceId> <targetId> --apply   # writes
 *
 * The target's images are only overwritten with --apply. A dry run just
 * reports what each property currently has so the change is reviewed first.
 */

interface Row {
  id: number
  titulo: string
  imagens: string | null
}

function countImages(raw: string | null): number {
  if (!raw) return 0
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

async function main(): Promise<void> {
  const [sourceArg, targetArg] = process.argv.slice(2)
  const apply = process.argv.includes('--apply')
  const sourceId = Number(sourceArg)
  const targetId = Number(targetArg)

  if (!Number.isInteger(sourceId) || !Number.isInteger(targetId)) {
    console.error('Usage: tsx scripts/copy-imovel-images.ts <sourceId> <targetId> [--apply]')
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set (expected in .env.local).')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const { rows } = await pool.query<Row>(
      'SELECT id, titulo, imagens FROM imoveis WHERE id = ANY($1::int[])',
      [[sourceId, targetId]],
    )
    const source = rows.find(r => r.id === sourceId)
    const target = rows.find(r => r.id === targetId)

    if (!source) { console.error(`Source property ${sourceId} not found.`); process.exit(1) }
    if (!target) { console.error(`Target property ${targetId} not found.`); process.exit(1) }

    console.log(`Source #${source.id}: ${source.titulo}`)
    console.log(`  ${countImages(source.imagens)} image(s)`)
    console.log(`Target #${target.id}: ${target.titulo}`)
    console.log(`  ${countImages(target.imagens)} image(s) (before)`)

    if (countImages(source.imagens) === 0) {
      console.error('\nSource has no images — nothing to copy. Aborting.')
      process.exit(1)
    }

    if (!apply) {
      console.log('\nDry run — no changes written. Re-run with --apply to copy.')
      return
    }

    const result = await pool.query(
      'UPDATE imoveis SET imagens = $1, updated_at = NOW() WHERE id = $2',
      [source.imagens, targetId],
    )
    console.log(`\n✓ Applied. ${result.rowCount} row updated.`)
    console.log(`Target #${targetId} now has ${countImages(source.imagens)} image(s).`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
