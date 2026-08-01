export type BookStatus =
  | 'uploaded'
  | 'extracting'
  | 'initial_sync'
  | 'anchors'
  | 'background_sync'
  | 'ready'
  | 'failed'

export interface ProcessingState {
  status: BookStatus
  progress: number // 0 - 100
  currentStep?: string
  startedAt?: string
  completedAt?: string
  errorMessage?: string
}

export interface StoredFile {
  name: string
  type: string
  size: number
  blob: Blob
}

export interface BookPage {
  pageNumber: number
  text: string
}

export interface Book {
  id: string
  title: string
  author?: string
  pdfFile: StoredFile
  audioFile: StoredFile
  pages?: BookPage[]
  extractionError?: string
  extractedAt?: string
  createdAt: string
  lastReadPage: number
  lastAudioPosition?: number
  playbackSpeed?: number
  lastOpenedAt?: string
  status: BookStatus
  processingState?: ProcessingState
}

export interface CreateBookInput {
  title: string
  author?: string
  pdfFile: File
  audioFile: File
}
