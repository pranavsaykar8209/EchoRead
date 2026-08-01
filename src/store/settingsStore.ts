import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface SettingsStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/** Shared preferences boundary for current and future EchoRead features. */
export const useSettingsStore = create<SettingsStore>()(persist(
  (set) => ({ theme: 'system', setTheme: (theme) => set({ theme }) }),
  { name: 'echoread-settings' },
))
