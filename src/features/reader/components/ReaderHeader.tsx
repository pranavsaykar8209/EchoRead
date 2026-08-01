import { ArrowLeft, Bookmark, MoreHorizontal, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { TranscriptStatus } from '@/features/transcript/components/TranscriptStatus'

export function ReaderHeader({ bookId, title, author }: { bookId?: string; title: string; author?: string }) {
  return (
    <header className="grid h-20 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border px-4 sm:px-6">
      <Link
        to="/library"
        className="justify-self-start inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-5" /> <span>Library</span>
      </Link>

      <div className="min-w-0 px-3 text-center flex flex-col items-center gap-0.5">
        <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>
        <div className="flex items-center gap-2">
          <p className="truncate text-xs text-muted-foreground">{author || 'Unknown author'}</p>
          {bookId && <TranscriptStatus bookId={bookId} />}
        </div>
      </div>

      <div className="flex justify-self-end items-center gap-2">
        <ThemeToggle compact />

        <Button
          type="button"
          variant="secondary"
          className="h-9 gap-2 border border-border bg-card px-3"
          aria-label="Search coming soon"
          title="Search coming soon"
        >
          <Search className="size-4" />
          <span className="hidden xl:inline">Search</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-9 gap-2 border border-border bg-card px-3"
          aria-label="Bookmarks coming soon"
          title="Bookmarks coming soon"
        >
          <Bookmark className="size-4" />
          <span className="hidden xl:inline">Bookmarks</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-9 gap-2 border border-border bg-card px-3"
          aria-label="Reader settings coming soon"
          title="Reader settings coming soon"
        >
          <MoreHorizontal className="size-5" />
          <span className="hidden xl:inline">More</span>
        </Button>
      </div>
    </header>
  )
}
