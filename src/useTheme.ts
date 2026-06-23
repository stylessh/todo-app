import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_PREFERENCE,
  isThemePreference,
  resolveTheme,
  type ThemeId,
  type ThemePreference,
} from './themes'

const STORAGE_KEY = 'diffkit-playground-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function loadPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (isThemePreference(raw)) return raw
  } catch {
    // ignore unavailable/blocked storage
  }
  return DEFAULT_PREFERENCE
}

function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(DARK_QUERY).matches
  )
}

/**
 * Manages the user's theme preference: persists it, applies the resolved
 * palette to the document via `data-theme`, and tracks the OS color scheme
 * so the `system` option stays in sync.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(loadPreference)
  const [systemDark, setSystemDark] = useState<boolean>(prefersDark)

  // Keep `systemDark` in sync with the OS while `system` is selected.
  useEffect(() => {
    const mql = window.matchMedia(DARK_QUERY)
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const resolved: ThemeId = resolveTheme(preference, systemDark)

  // Apply the resolved theme to the document root.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  // Persist the user's choice.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference)
    } catch {
      // ignore unavailable/blocked storage
    }
  }, [preference])

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next)
  }, [])

  return { preference, resolved, setTheme }
}
