import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/features/library/components/StatusBadge'
import type { Book, ProcessingState } from '@/features/library/types/book'
import { processingService } from '@/features/processing/services/processing.service'

export function ProcessingBanner({ book }: { book: Book }) {
  const [state, setState] = useState<ProcessingState>(
    book.processingState || {
      status: book.status,
      progress: book.status === 'ready' ? 100 : 0,
      currentStep: book.status === 'ready' ? '✓ Fully Ready' : 'Preparing book…',
    }
  )

  useEffect(() => {
    // Subscribe to live processing updates
    const unsubscribe = processingService.subscribe(book.id, (nextState) => {
      setState(nextState)
    })

    // Kick off pipeline if book is not ready
    if (book.status !== 'ready') {
      void processingService.startProcessing(book.id)
    }

    return () => unsubscribe()
  }, [book.id, book.status])

  // Don't render banner if processing is fully ready
  if (state.status === 'ready') return null

  return (
    <div className="mx-4 my-2 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 shadow-xs backdrop-blur-sm sm:mx-6">
      <div className="flex items-center gap-3 min-w-0">
        {state.status === 'ready' ? (
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">
            {state.currentStep || 'Preparing book…'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={state.status} />
        <span className="text-xs font-bold tabular-nums text-foreground">{state.progress}%</span>
      </div>
    </div>
  )
}
