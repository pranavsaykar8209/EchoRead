import { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/features/library/components/StatusBadge'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book, BookStatus, ProcessingState } from '@/features/library/types/book'
import { ProgressIndicator } from '@/features/processing/components/ProgressIndicator'
import { processingService } from '@/features/processing/services/processing.service'

const STAGES: { status: BookStatus; label: string }[] = [
  { status: 'uploaded', label: 'Uploaded' },
  { status: 'extracting', label: 'Extract Text' },
  { status: 'initial_sync', label: 'Initial Synchronization' },
  { status: 'anchors', label: 'Generate Audio Anchors' },
  { status: 'background_sync', label: 'Background Synchronization' },
  { status: 'ready', label: 'Ready' },
]

export function ProcessingManager({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<Book>()
  const [state, setState] = useState<ProcessingState>()

  useEffect(() => {
    void bookStorage.get(bookId).then((result) => {
      setBook(result)
      if (result) {
        setState(
          result.processingState || {
            status: result.status,
            progress: result.status === 'ready' ? 100 : 0,
            currentStep: result.status === 'ready' ? '✓ Fully Ready' : 'Preparing book…',
          }
        )
        if (result.status !== 'ready') {
          void processingService.startProcessing(bookId)
        }
      }
    })

    const unsubscribe = processingService.subscribe(bookId, (nextState) => {
      setState(nextState)
    })

    return () => unsubscribe()
  }, [bookId])

  if (!book || !state) return null

  const handleRetry = () => {
    void processingService.startProcessing(bookId)
  }

  const currentStageIndex = STAGES.findIndex((s) => s.status === state.status)

  return (
    <Card className="max-w-xl mx-auto p-6 space-y-6 shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{book.title}</h2>
          <p className="text-xs text-muted-foreground">{book.author || 'Unknown author'}</p>
        </div>
        <StatusBadge status={state.status} />
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator progress={state.progress} label={state.currentStep} size="lg" />

      {/* Pipeline Stage Timeline */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Processing Pipeline
        </h3>
        <div className="space-y-2">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex || state.status === 'ready'
            const isCurrent = idx === currentStageIndex && state.status !== 'ready'
            return (
              <div
                key={stage.status}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  isCurrent
                    ? 'bg-primary/10 font-semibold text-primary border border-primary/20'
                    : isDone
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div
                      className={`size-2.5 rounded-full ${
                        isCurrent ? 'bg-primary animate-ping' : 'bg-muted-foreground/30'
                      }`}
                    />
                  )}
                  <span>{stage.label}</span>
                </div>
                {isCurrent && <span className="font-bold tabular-nums">{state.progress}%</span>}
                {isDone && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Done</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Error state & Retry */}
      {state.status === 'failed' && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-medium text-xs">
            <AlertTriangle className="size-4" />
            <span>{state.errorMessage || 'Processing encountered an error.'}</span>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={handleRetry} className="gap-2 text-xs">
            <RefreshCw className="size-3.5" /> Retry Processing
          </Button>
        </div>
      )}
    </Card>
  )
}
