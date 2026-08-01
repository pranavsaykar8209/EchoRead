export type BookStatus = 'uploaded'

export interface StoredFile {
  name: string
  type: string
  size: number
  blob: Blob
}

export interface Book {
  id: string
  title: string
  author?: string
  pdfFile: StoredFile
  audioFile: StoredFile
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
