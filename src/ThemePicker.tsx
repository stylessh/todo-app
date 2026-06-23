import { THEMES, type ThemePreference } from './themes'

type ThemePickerProps = {
  value: ThemePreference
  onChange: (value: ThemePreference) => void
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="theme-picker">
      <label className="visually-hidden" htmlFor="theme-select">
        Theme
      </label>
      <select
        id="theme-select"
        className="theme-picker__select"
        value={value}
        onChange={(e) => onChange(e.target.value as ThemePreference)}
        aria-label="Theme"
      >
        {THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  )
}
