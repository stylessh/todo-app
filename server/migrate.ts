import 'dotenv/config'
import { getMigrations } from 'better-auth/db/migration'
import { auth } from './auth'

/**
 * Creates/updates the Better Auth tables (user, session, account,
 * verification) in the configured SQLite database.
 *
 * Run with `npm run auth:migrate`. Safe to run repeatedly — it only applies
 * the operations needed to bring the schema up to date.
 */
async function main() {
  const { toBeAdded, toBeCreated, runMigrations } = await getMigrations(
    auth.options,
  )

  if (toBeAdded.length === 0 && toBeCreated.length === 0) {
    console.log('✅ Database schema is already up to date.')
    return
  }

  await runMigrations()

  const created = toBeCreated.map((t) => t.table).join(', ')
  const altered = toBeAdded.map((t) => t.table).join(', ')
  console.log('✅ Better Auth migration complete.')
  if (created) console.log(`   Created tables: ${created}`)
  if (altered) console.log(`   Updated tables: ${altered}`)
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
