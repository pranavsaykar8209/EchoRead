import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function PageNavigation({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const [jumpPage, setJumpPage] = useState(String(page))
  const [error, setError] = useState('')

  useEffect(() => {
    setJumpPage(String(page))
    setError('')
  }, [page])

  const goToPage = () => {
    const next = Number(jumpPage)
    if (!Number.isInteger(next) || next < 1 || next > totalPages) {
      setError(`Enter a page from 1 to ${totalPages}.`)
      return
    }
    onChange(next)
  }

  const disabled = totalPages === 0
  const isFirst = disabled || page <= 1
  const isLast = disabled || page >= totalPages

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
      {/* Previous Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-9 gap-1.5 border border-border bg-card px-3 font-medium shadow-xs hover:bg-accent"
        aria-label="Previous page"
        title="Previous page (← Left Arrow)"
        disabled={isFirst}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        <span>Prev</span>
      </Button>

      {/* Page Info */}
      <div className="flex items-center gap-1 px-1">
        <span className="text-muted-foreground">Page</span>
        <span className="font-semibold text-foreground">{page}</span>
        <span className="text-muted-foreground">of {totalPages || '—'}</span>
      </div>

      {/* Next Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-9 gap-1.5 border border-border bg-card px-3 font-medium shadow-xs hover:bg-accent"
        aria-label="Next page"
        title="Next page (→ Right Arrow)"
        disabled={isLast}
        onClick={() => onChange(page + 1)}
      >
        <span>Next</span>
        <ChevronRight className="size-4" />
      </Button>

      {/* Jump to Page input */}
      <div className="relative ml-2 flex items-center gap-1.5">
        <input
          inputMode="numeric"
          value={jumpPage}
          onChange={(event) => setJumpPage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') goToPage()
          }}
          aria-label="Page number"
          placeholder="Go to"
          className="h-9 w-14 rounded-lg border border-input bg-card px-2 text-center text-sm font-medium outline-none ring-primary focus:ring-2"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium"
          disabled={disabled}
          onClick={goToPage}
        >
          Go
        </Button>
        {error && (
          <p className="absolute left-0 top-11 z-30 w-52 rounded-lg bg-destructive p-2 text-xs font-medium text-destructive-foreground shadow-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
