import type { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { useSettingsStore } from '@/store/settingsStore'

export function AppProviders({ children }: PropsWithChildren) {
  const theme = useSettingsStore((state) => state.theme)
  return <ThemeProvider>{children}<Toaster position="bottom-right" richColors theme={theme} /></ThemeProvider>
}
