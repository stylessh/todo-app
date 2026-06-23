import { useState } from 'react'
import type { FormEvent } from 'react'
import { signIn, signUp } from './lib/auth-client'

type Mode = 'sign-in' | 'sign-up'

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } =
      mode === 'sign-in'
        ? await signIn.email({ email, password })
        : await signUp.email({ name: name || email, email, password })

    setPending(false)
    if (error) {
      setError(error.message ?? 'Something went wrong. Please try again.')
    }
    // On success the session updates and <App /> swaps to the todo view.
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
  }

  return (
    <div className="auth">
      <div className="auth__heading">
        <h1 className="app__title">
          {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="app__subtitle">
          {mode === 'sign-in'
            ? 'Sign in to access your todos.'
            : 'Sign up to start tracking your todos.'}
        </p>
      </div>

      <form className="auth__form" onSubmit={onSubmit}>
        {mode === 'sign-up' && (
          <div className="auth__field">
            <label className="auth__label" htmlFor="auth-name">
              Name
            </label>
            <input
              id="auth-name"
              className="todo-form__input"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="auth__field">
          <label className="auth__label" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            className="todo-form__input"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            className="todo-form__input"
            type="password"
            autoComplete={
              mode === 'sign-in' ? 'current-password' : 'new-password'
            }
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <button
          className="todo-form__submit auth__submit"
          type="submit"
          disabled={pending}
        >
          {pending
            ? 'Please wait…'
            : mode === 'sign-in'
              ? 'Sign in'
              : 'Sign up'}
        </button>
      </form>

      <p className="auth__switch">
        {mode === 'sign-in' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="auth__link"
              onClick={() => switchMode('sign-up')}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              className="auth__link"
              onClick={() => switchMode('sign-in')}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  )
}
