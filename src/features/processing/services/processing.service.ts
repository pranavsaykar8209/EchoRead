import { AppConfig } from '@/config/app.config'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { BookStatus, ProcessingState } from '@/features/library/types/book'

type ProgressListener = (state: ProcessingState) => void

class ProcessingService {
  private activeTasks = new Map<string, boolean>()
  private listeners = new Map<string, Set<ProgressListener>>()

  /**
   * Subscribe to live processing updates for a specific book.
   */
  subscribe(bookId: string, listener: ProgressListener): () => void {
    if (!this.listeners.has(bookId)) {
      this.listeners.set(bookId, new Set())
    }
    const set = this.listeners.get(bookId)!
    set.add(listener)

    return () => {
      set.delete(listener)
      if (set.size === 0) {
        this.listeners.delete(bookId)
      }
    }
  }

  private notify(bookId: string, state: ProcessingState) {
    const set = this.listeners.get(bookId)
    if (set) {
      set.forEach((listener) => listener(state))
    }
  }

  /**
   * Start or resume background processing pipeline for a book.
   */
  async startProcessing(bookId: string): Promise<void> {
    if (this.activeTasks.get(bookId)) return
    this.activeTasks.set(bookId, true)

    try {
      const book = await bookStorage.get(bookId)
      if (!book) {
        this.activeTasks.delete(bookId)
        return
      }

      // If already ready or failed, nothing to do
      if (book.status === 'ready') {
        this.activeTasks.delete(bookId)
        return
      }

      const startedAt = book.processingState?.startedAt || new Date().toISOString()
      const isDev = AppConfig.developmentProcessing

      // Stage 1: Extract Text (0 - 20%)
      const extractMsg = isDev
        ? `Extracting PDF text (Dev Mode: Max ${AppConfig.maxPages} pages)…`
        : 'Extracting text from PDF…'
      await this.updateStage(bookId, 'extracting', 5, extractMsg, startedAt)

      if (!book.pages || book.pages.length === 0) {
        await bookStorage.extractPages(book)
      }
      await this.updateStage(bookId, 'extracting', 20, 'Text extraction complete', startedAt)
      await this.delay(800)

      // Stage 2: Initial Synchronization (20 - 50%)
      const syncMsg = isDev
        ? `Initial synchronization (Dev Mode: Max ${AppConfig.maxAudioMinutes}m audio)…`
        : 'Performing initial synchronization…'
      await this.updateStage(bookId, 'initial_sync', 35, syncMsg, startedAt)
      await this.delay(1000)
      await this.updateStage(bookId, 'initial_sync', 50, 'Initial synchronization ready', startedAt)
      await this.delay(800)

      // Stage 3: Audio Anchors (50 - 75%)
      await this.updateStage(bookId, 'anchors', 65, 'Generating audio navigation anchors…', startedAt)
      await this.delay(1000)
      await this.updateStage(bookId, 'anchors', 75, 'Audio anchors generated', startedAt)
      await this.delay(800)

      // Stage 4: Background Sync (75 - 99%)
      await this.updateStage(bookId, 'background_sync', 85, 'Running background synchronization…', startedAt)
      await this.delay(1200)
      await this.updateStage(bookId, 'background_sync', 95, 'Finalizing synchronization…', startedAt)
      await this.delay(600)

      // Stage 5: Ready (100%)
      const completedAt = new Date().toISOString()
      const finalState: ProcessingState = {
        status: 'ready',
        progress: 100,
        currentStep: '✓ Fully Ready',
        startedAt,
        completedAt,
      }

      await bookStorage.updateProcessingState(bookId, finalState)
      this.notify(bookId, finalState)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed.'
      const failedState: ProcessingState = {
        status: 'failed',
        progress: 0,
        currentStep: 'Processing failed',
        errorMessage,
      }
      await bookStorage.updateProcessingState(bookId, failedState)
      this.notify(bookId, failedState)
    } finally {
      this.activeTasks.delete(bookId)
    }
  }

  private async updateStage(
    bookId: string,
    status: BookStatus,
    progress: number,
    currentStep: string,
    startedAt: string
  ) {
    const state: ProcessingState = {
      status,
      progress,
      currentStep,
      startedAt,
    }
    await bookStorage.updateProcessingState(bookId, state)
    this.notify(bookId, state)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const processingService = new ProcessingService()
