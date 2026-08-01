import { useEffect, type PropsWithChildren } from 'react'
import { useSettingsStore, type Theme } from '@/store/settingsStore'

function resolveTheme(theme: Theme) {
  return theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useSettingsStore((state) => state.theme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolved = resolveTheme(theme)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
      document.documentElement.style.colorScheme = resolved
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#101010' : '#fafafa')
    }
    applyTheme()
    if (theme !== 'system') return undefined
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])

  return children
}
