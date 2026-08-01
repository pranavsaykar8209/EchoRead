import { Badge } from '@/components/ui/Badge'
import type { BookStatus } from '@/features/library/types/book'

export function StatusBadge({ status }: { status: BookStatus }) {
  const styles: Record<BookStatus, string> = {
    uploaded: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
    processing: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    ready: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  }
  const labels: Record<BookStatus, string> = { uploaded: 'Uploaded', processing: 'Processing', ready: 'Ready' }
  return <Badge className={styles[status]}>{labels[status]}</Badge>
}
