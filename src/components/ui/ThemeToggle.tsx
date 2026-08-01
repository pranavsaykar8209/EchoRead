import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/store/settingsStore'

export function ThemeToggle() {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const nextTheme = isDark ? 'light' : 'dark'
  return <Button type="button" variant="secondary" className="h-9 gap-2 border border-border bg-card px-3 shadow-sm" aria-label={`Switch to ${nextTheme} mode`} title={`Switch to ${nextTheme} mode`} onClick={() => setTheme(nextTheme)}>{isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}<span className="hidden sm:inline">{isDark ? 'Light mode' : 'Dark mode'}</span></Button>
}
