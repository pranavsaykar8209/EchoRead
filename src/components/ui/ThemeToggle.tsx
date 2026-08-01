import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/store/settingsStore'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const nextTheme = isDark ? 'light' : 'dark'
  return <Button type="button" variant="secondary" className={compact ? 'size-11 border border-border bg-card px-0 shadow-sm' : 'h-10 gap-2 border border-border bg-card px-3 shadow-sm'} aria-label={`Switch to ${nextTheme} mode`} title={`Switch to ${nextTheme} mode`} onClick={() => setTheme(nextTheme)}>{isDark ? <Sun aria-hidden="true" strokeWidth={2.5} className="shrink-0" style={{ width: 22, height: 22 }} /> : <Moon aria-hidden="true" strokeWidth={2.5} className="shrink-0" style={{ width: 22, height: 22 }} />}{!compact && <span className="hidden sm:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>}</Button>
}
