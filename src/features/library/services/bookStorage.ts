import type { Book, BookStatus, CreateBookInput, ProcessingState, StoredFile } from '@/features/library/types/book'
import type { Transcript } from '@/features/transcript/types/transcript'
import { extractPdfText } from '@/services/pdfExtraction.service'

const DATABASE_NAME = 'echoread'
const DATABASE_VERSION = 2
const BOOK_STORE = 'books'
const TRANSCRIPT_STORE = 'transcripts'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onerror = () => reject(request.error)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(BOOK_STORE)) {
        request.result.createObjectStore(BOOK_STORE, { keyPath: 'id' })
      }
      if (!request.result.objectStoreNames.contains(TRANSCRIPT_STORE)) {
        request.result.createObjectStore(TRANSCRIPT_STORE, { keyPath: 'bookId' })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })
}

function toStoredFile(file: File): StoredFile {
  return { name: file.name, type: file.type, size: file.size, blob: file }
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

async function saveBook(book: Book): Promise<Book> {
  const database = await openDatabase()
  const transaction = database.transaction(BOOK_STORE, 'readwrite')
  await requestResult(transaction.objectStore(BOOK_STORE).put(book))
  await transactionComplete(transaction)
  database.close()
  return book
}

/** Browser persistence boundary for the local library; replace this service when a remote backend is added. */
export const bookStorage = {
  async get(bookId: string): Promise<Book | undefined> {
    const database = await openDatabase()
    const transaction = database.transaction(BOOK_STORE, 'readonly')
    const book = await requestResult(transaction.objectStore(BOOK_STORE).get(bookId))
    await transactionComplete(transaction)
    database.close()
    return book
  },

  async list(): Promise<Book[]> {
    const database = await openDatabase()
    const transaction = database.transaction(BOOK_STORE, 'readonly')
    const books = await requestResult(transaction.objectStore(BOOK_STORE).getAll())
    await transactionComplete(transaction)
    database.close()
    return books.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async create(input: CreateBookInput): Promise<Book> {
    const book: Book = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      author: input.author?.trim() || undefined,
      pdfFile: toStoredFile(input.pdfFile),
      audioFile: toStoredFile(input.audioFile),
      createdAt: new Date().toISOString(),
      lastReadPage: 1,
      status: 'uploaded',
    }
    try {
      const extracted = await extractPdfText(input.pdfFile)
      book.pages = extracted.pages
      book.extractedAt = new Date().toISOString()
    } catch (error) {
      book.extractionError = error instanceof Error ? error.message : 'Text extraction failed.'
    }
    return saveBook(book)
  },

  async extractPages(book: Book): Promise<Book> {
    try {
      const extracted = await extractPdfText(book.pdfFile.blob)
      return saveBook({ ...book, pages: extracted.pages, extractedAt: new Date().toISOString(), extractionError: undefined })
    } catch (error) {
      return saveBook({ ...book, extractionError: error instanceof Error ? error.message : 'Text extraction failed.' })
    }
  },

  async updateProgress(
    bookId: string,
    progress: { lastReadPage?: number; lastAudioPosition?: number; playbackSpeed?: number }
  ): Promise<Book | undefined> {
    const book = await this.get(bookId)
    if (!book) return undefined
    const updated: Book = {
      ...book,
      lastReadPage: progress.lastReadPage ?? book.lastReadPage,
      lastAudioPosition: progress.lastAudioPosition ?? book.lastAudioPosition ?? 0,
      playbackSpeed: progress.playbackSpeed ?? book.playbackSpeed ?? 1,
      lastOpenedAt: new Date().toISOString(),
    }
    return saveBook(updated)
  },

  async updateProcessingState(
    bookId: string,
    processingState: Partial<ProcessingState> & { status: BookStatus }
  ): Promise<Book | undefined> {
    const book = await this.get(bookId)
    if (!book) return undefined

    const mergedState: ProcessingState = {
      status: processingState.status,
      progress: processingState.progress ?? book.processingState?.progress ?? 0,
      currentStep: processingState.currentStep ?? book.processingState?.currentStep,
      startedAt: processingState.startedAt ?? book.processingState?.startedAt ?? new Date().toISOString(),
      completedAt: processingState.completedAt ?? book.processingState?.completedAt,
      errorMessage: processingState.errorMessage,
    }

    const updated: Book = {
      ...book,
      status: processingState.status,
      processingState: mergedState,
    }
    return saveBook(updated)
  },

  async remove(bookId: string): Promise<void> {
    const database = await openDatabase()
    const transaction = database.transaction(BOOK_STORE, 'readwrite')
    await requestResult(transaction.objectStore(BOOK_STORE).delete(bookId))
    await transactionComplete(transaction)
    database.close()
  },

  async getTranscript(bookId: string): Promise<Transcript | undefined> {
    const database = await openDatabase()
    const transaction = database.transaction(TRANSCRIPT_STORE, 'readonly')
    const item = await requestResult<Transcript | undefined>(transaction.objectStore(TRANSCRIPT_STORE).get(bookId))
    await transactionComplete(transaction)
    database.close()
    return item
  },

  async saveTranscript(transcript: Transcript): Promise<Transcript> {
    const database = await openDatabase()
    const transaction = database.transaction(TRANSCRIPT_STORE, 'readwrite')
    await requestResult(transaction.objectStore(TRANSCRIPT_STORE).put(transcript))
    await transactionComplete(transaction)
    database.close()
    return transcript
  },
}
