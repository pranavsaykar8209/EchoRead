import { create } from 'zustand'
type ReaderStore = Record<never, never>
export const useReaderStore = create<ReaderStore>()(() => ({}))
