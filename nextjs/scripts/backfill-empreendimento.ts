import { config } from 'dotenv'
import { Pool } from '@neondatabase/serverless'
import { extractEmpreendimentoFromTitulo } from '../lib/empreendimento'

config({ path: '.env.local' })

/**
 * Backfills the `empreendimento` column for existing properties by parsing the
 * listing title — pinning the current groups so they stay stable once the
 * explicit field takes over. Only touches rows where empreendimento IS NULL and
 * a name can be parsed; never overwrites an existing value.
 *
 *   npx tsx scripts/backfill-empreendimento.ts           # dry run
 *   npx tsx scripts/backfill-empreendimento.ts --apply    # writes
 */

interface Row {
  id: number
  titulo: string
}

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply')
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set (expected in .env.local).')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const { rows } = await pool.query<Row>(
      "SELECT id, titulo FROM imoveis WHERE empreendimento IS NULL AND titulo IS NOT NULL",
    )

    const planned = rows
      .map(r => ({ id: r.id, nome: extractEmpreendimentoFromTitulo(r.titulo), titulo: r.titulo }))
      .filter((r): r is { id: number; nome: string; titulo: string } => r.nome !== null)

    console.log(`${rows.length} row(s) without empreendimento; ${planned.length} have a parseable name.\n`)
    for (const p of planned) console.log(`  #${p.id}  "${p.nome}"   ← ${p.titulo}`)

    if (!apply) {
      console.log('\nDry run — no changes written. Re-run with --apply.')
      return
    }

    let updated = 0
    for (const p of planned) {
      const result = await pool.query(
        'UPDATE imoveis SET empreendimento = $1, updated_at = NOW() WHERE id = $2 AND empreendimento IS NULL',
        [p.nome, p.id],
      )
      updated += result.rowCount ?? 0
    }
    console.log(`\n✓ Applied. ${updated} row(s) updated.`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
