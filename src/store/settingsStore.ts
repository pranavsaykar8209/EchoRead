import { create } from 'zustand'
type SettingsStore = Record<never, never>
export const useSettingsStore = create<SettingsStore>()(() => ({}))
