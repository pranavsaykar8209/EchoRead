import { Badge } from '@/components/ui/Badge'
import type { BookStatus } from '@/features/library/types/book'

export function StatusBadge({ status }: { status: BookStatus }) {
  const label = status === 'uploaded' ? 'Uploaded' : status
  return <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">{label}</Badge>
}
