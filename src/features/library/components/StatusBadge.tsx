import { Badge } from '@/components/ui/Badge'
import type { BookStatus } from '@/features/library/types/book'

export function StatusBadge({ status }: { status: BookStatus }) {
  const styles: Record<BookStatus, string> = {
    uploaded: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
    extracting: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 animate-pulse',
    generating_transcript: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 animate-pulse',
    initial_sync: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 animate-pulse',
    anchors: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 animate-pulse',
    background_sync: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 animate-pulse',
    ready: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    failed: 'bg-red-500/10 text-red-700 dark:text-red-400',
  }

  const labels: Record<BookStatus, string> = {
    uploaded: 'Uploaded',
    extracting: 'Extracting',
    generating_transcript: 'Generating Transcript',
    initial_sync: 'Initial Sync',
    anchors: 'Generating Anchors',
    background_sync: 'Syncing',
    ready: 'Ready',
    failed: 'Failed',
  }

  return <Badge className={styles[status] || styles.uploaded}>{labels[status] || 'Uploaded'}</Badge>
}
