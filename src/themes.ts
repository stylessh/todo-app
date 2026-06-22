export type ThemePreference = 'system' | ThemeId

export type ThemeId = 'light' | 'dark' | 'midnight' | 'ocean' | 'rose' | 'forest'

export type ThemeOption = {
  /** Stored preference value. */
  id: ThemePreference
  /** Human-readable name shown in the picker. */
  label: string
  /** Whether the resolved palette is dark, used for the system fallback. */
  dark?: boolean
}

/** All selectable themes, in the order shown in the picker. */
export const THEMES: ThemeOption[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark', dark: true },
  { id: 'midnight', label: 'Midnight', dark: true },
  { id: 'ocean', label: 'Ocean' },
  { id: 'rose', label: 'Rose' },
  { id: 'forest', label: 'Forest' },
]

export const DEFAULT_PREFERENCE: ThemePreference = 'system'

const THEME_IDS = new Set<ThemePreference>(THEMES.map((t) => t.id))

/** Type guard for a persisted/unknown value being a valid preference. */
export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && THEME_IDS.has(value as ThemePreference)
}

/**
 * Resolves a preference to the concrete theme applied to the DOM.
 * `system` maps to `light`/`dark` based on the OS color scheme.
 */
export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ThemeId {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}
