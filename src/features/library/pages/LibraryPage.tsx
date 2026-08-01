import { useEffect, useState } from 'react'
import { Library as LibraryIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { BookCard } from '@/features/library/components/BookCard'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book } from '@/features/library/types/book'

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { let active = true; void bookStorage.list().then((result) => { if (active) setBooks(result) }).catch(() => { if (active) setBooks([]) }).finally(() => { if (active) setIsLoading(false) }); return () => { active = false } }, [])
  return <><PageHeader title="Library" description="Your books, ready to pick up anytime." action={<Link to="/upload"><Button>Add book</Button></Link>} />{!isLoading && books.length === 0 ? <EmptyState icon={<LibraryIcon className="size-8" />} title="Your library is empty" description="Upload a PDF and its audiobook to begin building your reading library." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{books.map((book) => <BookCard key={book.id} book={book} />)}</div>}</>
}
