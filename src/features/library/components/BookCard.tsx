import { BookOpen, CalendarDays } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/features/library/components/StatusBadge'
import type { Book } from '@/features/library/types/book'

export function BookCard({ book }: { book: Book }) {
  const uploadedAt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(book.createdAt))
  return <Card className="flex min-h-48 flex-col"><div className="flex items-start justify-between gap-4"><span className="grid size-10 place-items-center rounded-xl bg-secondary"><BookOpen className="size-5" /></span><StatusBadge status={book.status} /></div><div className="mt-auto pt-7"><h2 className="font-semibold">{book.title}</h2><p className="mt-1 truncate text-sm text-muted-foreground">{book.author || 'Unknown author'}</p><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /> Uploaded {uploadedAt}</p></div></Card>
}
