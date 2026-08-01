export type BookStatus = 'uploaded' | 'processing' | 'ready'

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
  status: BookStatus
}

export interface CreateBookInput {
  title: string
  author?: string
  pdfFile: File
  audioFile: File
}
