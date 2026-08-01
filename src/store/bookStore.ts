import { create } from 'zustand'
type BookStore = Record<never, never>
export const useBookStore = create<BookStore>()(() => ({}))
