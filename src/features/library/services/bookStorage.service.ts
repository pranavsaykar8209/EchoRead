import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book, BookArtifacts, BookPage, CreateBookInput } from '@/features/library/types/book'
import type { Transcript } from '@/features/transcript/types/transcript'

/**
 * Default artifact state for newly imported books.
 */
const DEFAULT_ARTIFACTS: BookArtifacts = {
  metadata: true,
  pdf: true,
  audio: true,
  extractedPages: false,
  transcript: false,
  anchors: false,
  synchronization: false,
}

/**
 * Ensures legacy books have valid artifacts flags.
 */
export function normalizeBookArtifacts(book: Book): Book {
  const hasPages = Boolean(book.pages && book.pages.length > 0)
  const mergedArtifacts: BookArtifacts = {
    metadata: true,
    pdf: Boolean(book.pdfFile),
    audio: Boolean(book.audioFile),
    extractedPages: book.artifacts?.extractedPages ?? hasPages,
    transcript: book.artifacts?.transcript ?? false,
    anchors: book.artifacts?.anchors ?? false,
    synchronization: book.artifacts?.synchronization ?? false,
  }
  return { ...book, artifacts: mergedArtifacts }
}

class BookStorageService {
  /**
   * Import and save a new book into its storage container.
   */
  async saveBook(input: CreateBookInput): Promise<Book> {
    const created = await bookStorage.create(input)
    const normalized = normalizeBookArtifacts({
      ...created,
      artifacts: { ...DEFAULT_ARTIFACTS },
    })
    return (await bookStorage.saveBook(normalized)) || normalized
  }

  /**
   * Load a book container by ID.
   */
  async loadBook(id: string): Promise<Book | undefined> {
    const book = await bookStorage.get(id)
    if (!book) return undefined
    return normalizeBookArtifacts(book)
  }

  /**
   * Load all books from storage.
   */
  async getAllBooks(): Promise<Book[]> {
    const books = await bookStorage.getAll()
    return books.map(normalizeBookArtifacts)
  }

  /**
   * Update book metadata.
   */
  async updateMetadata(id: string, updates: Partial<Book>): Promise<Book | undefined> {
    const existing = await this.loadBook(id)
    if (!existing) return undefined

    const updated: Book = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      artifacts: {
        ...existing.artifacts,
        metadata: true,
      },
    }
    return bookStorage.saveBook(updated)
  }

  /**
   * Save extracted PDF text pages as an artifact.
   */
  async saveExtractedPages(id: string, pages: BookPage[]): Promise<Book | undefined> {
    const book = await this.loadBook(id)
    if (!book) return undefined

    const updated: Book = {
      ...book,
      pages,
      extractedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      artifacts: {
        ...book.artifacts,
        extractedPages: true,
      },
    }
    return bookStorage.saveBook(updated)
  }

  /**
   * Read extracted PDF text pages from storage container.
   */
  async readExtractedPages(id: string): Promise<BookPage[]> {
    const book = await this.loadBook(id)
    return book?.pages || []
  }

  /**
   * Save timestamped transcript artifact.
   */
  async saveTranscript(id: string, transcript: Transcript): Promise<Transcript> {
    const saved = await bookStorage.saveTranscript(transcript)
    const book = await this.loadBook(id)
    if (book) {
      await bookStorage.saveBook({
        ...book,
        artifacts: { ...book.artifacts, transcript: true },
        updatedAt: new Date().toISOString(),
      })
    }
    return saved
  }

  /**
   * Load timestamped transcript artifact.
   */
  async loadTranscript(id: string): Promise<Transcript | undefined> {
    return bookStorage.getTranscript(id)
  }

  /**
   * Save audio navigation anchors artifact (Future Engine API).
   */
  async saveAnchors(id: string, _anchors: unknown): Promise<{ status: string }> {
    const book = await this.loadBook(id)
    if (book) {
      await bookStorage.saveBook({
        ...book,
        artifacts: { ...book.artifacts, anchors: true },
        updatedAt: new Date().toISOString(),
      })
    }
    return { status: 'Not Implemented (Placeholder Saved)' }
  }

  /**
   * Load audio navigation anchors artifact (Future Engine API).
   */
  async loadAnchors(_id: string): Promise<{ status: string }> {
    return { status: 'Not Implemented' }
  }

  /**
   * Save synchronization data artifact (Future Engine API).
   */
  async saveSynchronization(id: string, _syncData: unknown): Promise<{ status: string }> {
    const book = await this.loadBook(id)
    if (book) {
      await bookStorage.saveBook({
        ...book,
        artifacts: { ...book.artifacts, synchronization: true },
        updatedAt: new Date().toISOString(),
      })
    }
    return { status: 'Not Implemented (Placeholder Saved)' }
  }

  /**
   * Load synchronization data artifact (Future Engine API).
   */
  async loadSynchronization(_id: string): Promise<{ status: string }> {
    return { status: 'Not Implemented' }
  }

  /**
   * Get current artifact availability flags for a book container.
   */
  async getArtifacts(id: string): Promise<BookArtifacts | undefined> {
    const book = await this.loadBook(id)
    return book?.artifacts
  }

  /**
   * Remove a book container from storage.
   */
  async remove(id: string): Promise<void> {
    return bookStorage.remove(id)
  }
}

export const bookStorageService = new BookStorageService()
