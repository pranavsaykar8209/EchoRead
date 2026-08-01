import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AudioPlayer } from '@/features/reader/components/AudioPlayer'
import { ReaderHeader } from '@/features/reader/components/ReaderHeader'
import { ReaderNavigation } from '@/features/reader/components/ReaderNavigation'
import { TextExtractionError } from '@/features/reader/components/TextExtractionError'
import { TextReader } from '@/features/reader/components/TextReader'
import { TextReaderLoading } from '@/features/reader/components/TextReaderLoading'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book } from '@/features/library/types/book'
import { useReaderStore } from '@/store/readerStore'

export default function ReaderPage() {
  const { bookId } = useParams()
  const [book, setBook] = useState<Book>()
  const [isBookLoading, setIsBookLoading] = useState(true)
  const [isExtracting, setIsExtracting] = useState(false)
  const resetDocument = useReaderStore((state) => state.resetDocument)
  const { currentPage, setTotalPages, nextPage, prevPage, isFullscreen, setFullscreen } = useReaderStore()

  // Keyboard navigation shortcuts & Escape to exit Full Screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase()
      if (activeTag === 'input' || activeTag === 'textarea') return

      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault()
        setFullscreen(false)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevPage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPage, prevPage, isFullscreen, setFullscreen])

  const extractText = useCallback(
    async (target: Book) => {
      setIsExtracting(true)
      const updated = await bookStorage.extractPages(target)
      setBook(updated)
      setTotalPages(updated.pages?.length ?? 0)
      setIsExtracting(false)
    },
    [setTotalPages]
  )

  useEffect(() => {
    if (!bookId) {
      setIsBookLoading(false)
      return
    }
    setIsBookLoading(true)
    void bookStorage
      .get(bookId)
      .then((result) => {
        setBook(result)
        resetDocument(result?.lastReadPage)
        setTotalPages(result?.pages?.length ?? 0)
        if (result && !result.pages && !result.extractionError) {
          void extractText(result)
        }
      })
      .catch(() => setBook(undefined))
      .finally(() => setIsBookLoading(false))
  }, [bookId, extractText, resetDocument, setTotalPages])

  const page = book?.pages?.[currentPage - 1]

  return (
    <div className={`relative flex min-h-screen bg-background ${isFullscreen ? 'p-0 overflow-hidden' : 'pb-36'}`}>
      <div className="flex min-w-0 flex-1 flex-col">
        {!isFullscreen && <ReaderHeader title={book?.title || 'Loading book…'} author={book?.author} />}

        <main className={`flex min-h-0 flex-1 flex-col ${isFullscreen ? 'p-0' : 'p-4 sm:p-6'}`}>
          {isBookLoading || isExtracting ? (
            <TextReaderLoading label={isExtracting ? 'Extracting text from your PDF…' : 'Loading book…'} />
          ) : book?.pages ? (
            <>
              <TextReader page={page} title={book.title} />
              {!isFullscreen && <ReaderNavigation />}
            </>
          ) : (
            <TextExtractionError
              message={book?.extractionError}
              isRetrying={isExtracting}
              onRetry={() => {
                if (book) void extractText(book)
              }}
            />
          )}
        </main>
      </div>

      {!isFullscreen && book && <AudioPlayer book={book} />}
    </div>
  )
}
