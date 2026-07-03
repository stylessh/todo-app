import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth'

const app = new Hono()

// Allow the frontend origin(s) to send credentials (auth cookies).
app.use(
  '/api/auth/*',
  cors({
    origin: (process.env.TRUSTED_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
)

// Hand every /api/auth/* request to Better Auth's web-standard handler.
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.get('/health', (c) => c.json({ ok: true }))

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, ({ port }) => {
  console.log(`🔐 Auth server listening on http://localhost:${port}`)
})
