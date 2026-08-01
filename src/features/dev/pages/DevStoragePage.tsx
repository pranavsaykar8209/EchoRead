import { useEffect, useState } from 'react'
import { Database, HardDrive, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/features/library/components/StatusBadge'
import { bookStorageService } from '@/features/library/services/bookStorage.service'
import type { Book } from '@/features/library/types/book'
import { cn } from '@/lib/cn'

export default function DevStoragePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadStorage = async () => {
    setIsLoading(true)
    try {
      const result = await bookStorageService.getAllBooks()
      setBooks(result)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadStorage()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Developer Storage Dashboard"
          description="Inspect stored book containers, metadata, and artifact availability."
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={loadStorage}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />
          Refresh Storage
        </Button>
      </div>

      {books.length === 0 ? (
        <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
          <Database className="size-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-lg">No Storage Containers Found</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload a book to create your first storage artifact container.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {books.map((book) => {
            const artifacts = book.artifacts
            const pdfSize = (book.pdfFile.size / (1024 * 1024)).toFixed(2)
            const audioSize = (book.audioFile.size / (1024 * 1024)).toFixed(2)

            return (
              <Card key={book.id} className="p-6 space-y-5 shadow-sm">
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="size-4 text-primary" />
                      <h2 className="font-bold text-lg">{book.title}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ID: <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono">{book.id}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={book.status} />
                    <span className="text-xs font-mono bg-secondary px-2.5 py-1 rounded-md text-secondary-foreground font-medium">
                      Pages: {book.pages?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Metadata & File Sizes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Author</span>
                    <span className="font-medium text-foreground">{book.author || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">PDF Artifact</span>
                    <span className="font-medium text-foreground">{pdfSize} MB</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Audio Artifact</span>
                    <span className="font-medium text-foreground">{audioSize} MB</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Created At</span>
                    <span className="font-medium text-foreground">
                      {new Date(book.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Artifact Container Availability Grid */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Artifact Container State
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.metadata ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.metadata ? '✓' : '○'}</span> Metadata
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">Book Properties & State</p>
                    </div>

                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.pdf ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.pdf ? '✓' : '○'}</span> PDF Document
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">{book.pdfFile.name}</p>
                    </div>

                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.audio ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.audio ? '✓' : '○'}</span> Audiobook
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">{book.audioFile.name}</p>
                    </div>

                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.extractedPages ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.extractedPages ? '✓' : '○'}</span> Extracted Pages
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">{book.pages?.length || 0} pages extracted</p>
                    </div>

                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.transcript ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.transcript ? '✓' : '○'}</span> Transcript
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">Timestamped Segments</p>
                    </div>

                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.anchors ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.anchors ? '✓' : '○'}</span> Audio Anchors
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">Future Engine API</p>
                    </div>

                    <div className={cn('rounded-xl p-3 border transition-colors', artifacts.synchronization ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-muted/30 border-border text-muted-foreground')}>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifacts.synchronization ? '✓' : '○'}</span> Synchronization
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">Future Engine API</p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
