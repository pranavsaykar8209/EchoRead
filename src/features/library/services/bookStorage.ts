import type { Book, CreateBookInput, StoredFile } from '@/features/library/types/book'

const DATABASE_NAME = 'echoread'
const DATABASE_VERSION = 1
const BOOK_STORE = 'books'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onerror = () => reject(request.error)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(BOOK_STORE)) {
        request.result.createObjectStore(BOOK_STORE, { keyPath: 'id' })
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

/** Browser persistence boundary for the local library; replace this service when a remote backend is added. */
export const bookStorage = {
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
    const database = await openDatabase()
    const transaction = database.transaction(BOOK_STORE, 'readwrite')
    await requestResult(transaction.objectStore(BOOK_STORE).add(book))
    await transactionComplete(transaction)
    database.close()
    return book
  },

  async remove(bookId: string): Promise<void> {
    const database = await openDatabase()
    const transaction = database.transaction(BOOK_STORE, 'readwrite')
    await requestResult(transaction.objectStore(BOOK_STORE).delete(bookId))
    await transactionComplete(transaction)
    database.close()
  },
}
