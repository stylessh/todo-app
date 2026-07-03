import 'dotenv/config'
import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'

/**
 * Better Auth server instance.
 *
 * Uses a local SQLite database (better-sqlite3) and email/password auth.
 * Run `npm run auth:migrate` after changing this config to create/update the
 * required tables.
 */
export const auth = betterAuth({
  database: new Database(process.env.DATABASE_PATH ?? './sqlite.db'),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  // Origins allowed to make authenticated requests. The Vite dev server runs
  // on 5173 and proxies /api/auth to this server.
  trustedOrigins: (process.env.TRUSTED_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
})
