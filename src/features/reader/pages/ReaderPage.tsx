import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AudioControls } from '@/features/reader/components/AudioControls'
import { ReaderHeader } from '@/features/reader/components/ReaderHeader'
import { ReaderPlaceholder } from '@/features/reader/components/ReaderPlaceholder'
import { ReaderToolbar } from '@/features/reader/components/ReaderToolbar'
import { Sidebar } from '@/features/reader/components/Sidebar'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book } from '@/features/library/types/book'

export default function ReaderPage() {
  const { bookId } = useParams()
  const [book, setBook] = useState<Book>()
  useEffect(() => { if (!bookId) return; void bookStorage.get(bookId).then(setBook).catch(() => setBook(undefined)) }, [bookId])
  return <div className="flex min-h-screen bg-background pb-36"><div className="flex min-w-0 flex-1 flex-col"><ReaderHeader title={book?.title || 'Untitled book'} author={book?.author} /><main className="flex min-h-0 flex-1 flex-col p-4 sm:p-6"><ReaderPlaceholder /><ReaderToolbar /></main></div><Sidebar /><AudioControls /></div>
}
