import { useEffect, useState } from 'react'
import { CheckCircle2, FileText, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { transcriptService } from '@/features/transcript/services/transcript.service'

export function TranscriptStatus({ bookId }: { bookId: string }) {
  const [hasTranscript, setHasTranscript] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const check = async () => {
      const exists = await transcriptService.hasTranscript(bookId)
      if (isMounted) setHasTranscript(exists)
    }

    void check()
    const interval = setInterval(check, 2000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [bookId])

  if (hasTranscript === null) return null

  return (
    <Badge
      variant="secondary"
      className={
        hasTranscript
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1.5'
          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 gap-1.5 animate-pulse'
      }
    >
      {hasTranscript ? (
        <>
          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>✓ Transcript Ready</span>
        </>
      ) : (
        <>
          <Loader2 className="size-3.5 animate-spin text-amber-600 dark:text-amber-400" />
          <span>Generating Transcript…</span>
        </>
      )}
    </Badge>
  )
}
