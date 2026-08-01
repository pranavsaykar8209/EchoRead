import { useEffect, useRef } from 'react'
import { BookOpen, Eye, EyeOff, Maximize2, Minimize2, Volume2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BookPage } from '@/features/library/types/book'
import { useReaderStore } from '@/store/readerStore'
import { cn } from '@/lib/cn'

/**
 * Intelligently splits page text into comfortable, digestible reading chunks (~200 chars or by sentence boundaries).
 */
function extractChunks(rawText?: string): string[] {
  if (!rawText) return []
  const text = rawText.replace(/\r\n/g, '\n').trim()
  if (!text) return []

  const sentences = text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map((s) => s.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  if (sentences.length === 0) return [text]

  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if (current.length + sentence.length > 250 && current.length > 0) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? `${current} ${sentence}` : sentence
    }
  }
  if (current.trim()) chunks.push(current.trim())

  return chunks.length > 0 ? chunks : [text]
}

export function TextReader({ page, title }: { page?: BookPage; title: string }) {
  const chunks = extractChunks(page?.text)
  const {
    activeParagraphIndex,
    setActiveParagraphIndex,
    autoScrollEnabled,
    setAutoScrollEnabled,
    focusMode,
    setFocusMode,
    isFullscreen,
    toggleFullscreen,
  } = useReaderStore()

  const activeElRef = useRef<HTMLDivElement | null>(null)

  // Ensure active index stays in valid range when page changes
  useEffect(() => {
    if (activeParagraphIndex >= chunks.length && chunks.length > 0) {
      setActiveParagraphIndex(0)
    }
  }, [chunks.length, activeParagraphIndex, setActiveParagraphIndex])

  // Auto-scroll when active paragraph changes
  useEffect(() => {
    if (!autoScrollEnabled || !activeElRef.current) return
    activeElRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [activeParagraphIndex, autoScrollEnabled])

  const activeChunk = chunks[activeParagraphIndex] || chunks[0] || ''

  return (
    <article
      data-reader-text-surface
      className={cn(
        'relative flex min-h-100 flex-1 flex-col overflow-auto scroll-smooth rounded-2xl bg-card px-6 py-8 shadow-sm sm:px-12 sm:py-12 transition-all duration-300',
        isFullscreen && 'fixed inset-0 z-50 min-h-screen rounded-none bg-background px-6 py-10 sm:px-16 sm:py-14'
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col text-center">
        {/* Header Control Bar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <BookOpen className="mr-1 size-3.5 text-primary" /> Chapter
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              Page {page?.pageNumber ?? '—'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Scroll Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
              className={cn(
                'h-8 gap-1.5 rounded-lg px-2.5 text-xs transition-colors',
                autoScrollEnabled ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
              )}
              title="Toggle automatic scrolling as text is read"
            >
              <Volume2 className="size-3.5" />
              <span>Auto-scroll: {autoScrollEnabled ? 'ON' : 'OFF'}</span>
            </Button>

            {/* Focus Mode Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFocusMode(!focusMode)}
              className={cn(
                'h-8 gap-1.5 rounded-lg px-2.5 text-xs transition-colors',
                focusMode ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
              )}
              title="Focus Mode: Only display the active reading content"
            >
              {focusMode ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              <span>{focusMode ? 'Focus View (Single Chunk)' : 'Full Page View'}</span>
            </Button>

            {/* Full Screen Mode Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className={cn(
                'h-8 gap-1.5 rounded-lg px-2.5 text-xs transition-colors',
                isFullscreen
                  ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen Mode'}
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
            </Button>
          </div>
        </div>

        {/* Vertically Centered Main Text Content */}
        <div className="my-auto flex flex-1 flex-col justify-center py-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>

          {chunks.length > 0 ? (
            focusMode ? (
              /* FOCUSED CHUNK MODE: Only active reading section is displayed */
              <div className="mt-10 flex flex-col items-center justify-center space-y-6">
                <div
                  ref={activeElRef}
                  className="w-full max-w-2xl text-center text-2xl font-medium leading-relaxed text-foreground transition-all duration-300 sm:text-3xl sm:leading-loose"
                >
                  <p className="whitespace-pre-wrap">{activeChunk}</p>
                </div>

                <div className="text-xs font-medium text-muted-foreground/80 tabular-nums">
                  Section {activeParagraphIndex + 1} of {chunks.length}
                </div>
              </div>
            ) : (
              /* FULL PAGE VIEW: Displays all chunks with active section highlighted */
              <div className="mt-10 space-y-8 text-center text-xl leading-relaxed sm:text-2xl sm:leading-loose">
                {chunks.map((chunk, index) => {
                  const isActive = index === activeParagraphIndex
                  return (
                    <div
                      key={`${page?.pageNumber}-${index}`}
                      ref={isActive ? activeElRef : null}
                      onClick={() => setActiveParagraphIndex(index)}
                      className={cn(
                        'cursor-pointer py-2 transition-all duration-300 text-center select-text',
                        isActive
                          ? 'text-foreground font-semibold opacity-100 scale-[1.02]'
                          : 'text-foreground/75 opacity-60 hover:opacity-100 hover:text-foreground'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{chunk}</p>
                    </div>
                  )
                })}
              </div>
            )
          ) : (
            <div className="mt-12 text-center text-base leading-6 text-muted-foreground">
              This page contains no readable text content.
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
