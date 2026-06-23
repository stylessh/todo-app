import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth client.
 *
 * In dev, Vite proxies `/api/auth` to the auth server, so requests are
 * same-origin and `baseURL` can be left undefined. Set `VITE_BETTER_AUTH_URL`
 * to point at the auth server directly (e.g. in production).
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || undefined,
})

export const { signIn, signUp, signOut, useSession } = authClient
