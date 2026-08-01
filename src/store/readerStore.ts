import { create } from 'zustand'

interface ReaderStore {
  currentPage: number
  totalPages: number
  activeParagraphIndex: number
  isPlaying: boolean
  playbackRate: number
  autoScrollEnabled: boolean
  focusMode: boolean
  isFullscreen: boolean
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  nextPage: () => void
  prevPage: () => void
  setActiveParagraphIndex: (index: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  setPlaybackRate: (rate: number) => void
  setAutoScrollEnabled: (enabled: boolean) => void
  setFocusMode: (enabled: boolean) => void
  setFullscreen: (isFullscreen: boolean) => void
  toggleFullscreen: () => void
  resetDocument: (initialPage?: number) => void
}

export const useReaderStore = create<ReaderStore>()((set, get) => ({
  currentPage: 1,
  totalPages: 0,
  activeParagraphIndex: 0,
  isPlaying: false,
  playbackRate: 1,
  autoScrollEnabled: true,
  focusMode: true,
  isFullscreen: false,
  setCurrentPage: (currentPage) => {
    const { totalPages } = get()
    const valid = Math.max(1, Math.min(currentPage, totalPages || 1))
    set({ currentPage: valid, activeParagraphIndex: 0 })
  },
  setTotalPages: (totalPages) => set({ totalPages }),
  nextPage: () => {
    const { currentPage, totalPages } = get()
    if (totalPages > 0 && currentPage < totalPages) {
      set({ currentPage: currentPage + 1, activeParagraphIndex: 0 })
    }
  },
  prevPage: () => {
    const { currentPage } = get()
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1, activeParagraphIndex: 0 })
    }
  },
  setActiveParagraphIndex: (activeParagraphIndex) => set({ activeParagraphIndex }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setAutoScrollEnabled: (autoScrollEnabled) => set({ autoScrollEnabled }),
  setFocusMode: (focusMode) => set({ focusMode }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  resetDocument: (initialPage = 1) =>
    set({
      currentPage: initialPage,
      totalPages: 0,
      activeParagraphIndex: 0,
      isPlaying: false,
      isFullscreen: false,
    }),
}))

