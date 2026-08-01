import { useEffect, useState } from 'react'
import { BookOpen, CalendarDays, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/features/library/components/StatusBadge'
import type { Book, ProcessingState } from '@/features/library/types/book'
import { ProgressIndicator } from '@/features/processing/components/ProgressIndicator'
import { processingService } from '@/features/processing/services/processing.service'

export function BookCard({ book, onDelete }: { book: Book; onDelete: (book: Book) => void }) {
  const [state, setState] = useState<ProcessingState>(
    book.processingState || {
      status: book.status,
      progress: book.status === 'ready' ? 100 : 0,
      currentStep: book.status === 'ready' ? '✓ Fully Ready' : 'Processing…',
    }
  )

  useEffect(() => {
    const unsubscribe = processingService.subscribe(book.id, (nextState) => {
      setState(nextState)
    })

    if (book.status !== 'ready') {
      void processingService.startProcessing(book.id)
    }

    return () => unsubscribe()
  }, [book.id, book.status])

  const uploadedAt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(book.createdAt))

  return (
    <Card className="flex min-h-60 flex-col">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-xl bg-secondary">
          <BookOpen className="size-5" />
        </span>
        <StatusBadge status={state.status} />
      </div>

      <div className="mt-4 pt-2">
        <h2 className="truncate font-semibold">{book.title}</h2>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{book.author || 'Unknown author'}</p>
      </div>

      {/* Live Processing Progress Bar */}
      {state.status !== 'ready' && (
        <div className="mt-4">
          <ProgressIndicator progress={state.progress} label={state.currentStep} size="sm" />
        </div>
      )}

      <div className="mt-auto pt-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" /> Uploaded {uploadedAt}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to={`/reader/${book.id}`}>
            <Button className="w-full">Open</Button>
          </Link>
          <Button
            type="button"
            variant="secondary"
            className="w-full gap-2 border border-border text-red-700 hover:bg-red-500/10 dark:text-red-400"
            aria-label={`Delete ${book.title}`}
            onClick={() => onDelete(book)}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
