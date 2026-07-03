# Todos · React + TypeScript + Vite

A small todo app with email/password authentication powered by
[Better Auth](https://www.better-auth.com/).

## Authentication

Auth runs on a lightweight [Hono](https://hono.dev/) server backed by SQLite
(`better-sqlite3`). The React app talks to it through the Better Auth React
client; in dev, Vite proxies `/api/auth` to the server so the browser stays
same-origin.

```
src/lib/auth-client.ts   Better Auth React client (signIn / signUp / useSession)
src/AuthForm.tsx         Sign-in / sign-up form
server/auth.ts           Better Auth server config (email/password, SQLite)
server/index.ts          Hono server mounting the auth handler at /api/auth/*
server/migrate.ts        Creates/updates the auth tables
```

### Setup

```bash
npm install

# Create your env file and set a secret
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # paste into BETTER_AUTH_SECRET

# Create the auth tables (user, session, account, verification)
npm run auth:migrate
```

### Run

```bash
npm run dev      # starts the Vite app (5173) and the auth server (3000) together
```

Open http://localhost:5173, create an account, and your todos appear once
you're signed in.

### Adding social providers

`server/auth.ts` is ready to extend. For example, GitHub:

```ts
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
},
```

Add the credentials to `.env` and a matching `signIn.social({ provider: 'github' })`
button in the UI.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
