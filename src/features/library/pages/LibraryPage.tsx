import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { BookCard } from '@/features/library/components/BookCard'
import { DeleteBookDialog } from '@/features/library/components/DeleteBookDialog'
import { EmptyLibrary } from '@/features/library/components/EmptyLibrary'
import { SearchBar } from '@/features/library/components/SearchBar'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book } from '@/features/library/types/book'

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [bookToDelete, setBookToDelete] = useState<Book>()
  const [isDeleting, setIsDeleting] = useState(false)
  useEffect(() => { let active = true; void bookStorage.list().then((result) => { if (active) setBooks(result) }).catch(() => { if (active) setBooks([]) }).finally(() => { if (active) setIsLoading(false) }); return () => { active = false } }, [])
  const visibleBooks = useMemo(() => { const query = search.trim().toLocaleLowerCase(); return query ? books.filter((book) => `${book.title} ${book.author ?? ''}`.toLocaleLowerCase().includes(query)) : books }, [books, search])
  const deleteBook = async () => { if (!bookToDelete) return; setIsDeleting(true); try { await bookStorage.remove(bookToDelete.id); setBooks((current) => current.filter((book) => book.id !== bookToDelete.id)); setBookToDelete(undefined); toast.success('Book deleted from your library') } catch { toast.error('We couldn’t delete this book. Please try again.') } finally { setIsDeleting(false) } }
  return <><PageHeader title="My library" description="Your books, ready to pick up anytime." action={<Link to="/upload"><Button>Add book</Button></Link>} />{books.length > 0 && <div className="mb-7"><SearchBar value={search} onChange={setSearch} /></div>}{isLoading ? <p className="text-sm text-muted-foreground">Loading your books…</p> : books.length === 0 ? <EmptyLibrary /> : visibleBooks.length === 0 ? <EmptyLibrary isSearchResult /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleBooks.map((book) => <BookCard key={book.id} book={book} onDelete={setBookToDelete} />)}</div>}<DeleteBookDialog book={bookToDelete} isDeleting={isDeleting} onCancel={() => { if (!isDeleting) setBookToDelete(undefined) }} onConfirm={() => { void deleteBook() }} /></>
}
