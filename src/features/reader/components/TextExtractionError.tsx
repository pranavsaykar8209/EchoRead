import { FileWarning, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function TextExtractionError({ message, onRetry, isRetrying }: { message?: string; onRetry: () => void; isRetrying: boolean }) {
  return <div className="flex min-h-100 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/40 bg-red-500/5 p-6 text-center"><span className="grid size-12 place-items-center rounded-xl bg-card text-red-600 shadow-sm dark:text-red-400"><FileWarning className="size-6" /></span><h2 className="mt-5 text-lg font-semibold">Text extraction wasn’t successful</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{message || 'EchoRead could not read the text in this PDF. You can retry extraction at any time.'}</p><Button type="button" variant="secondary" className="mt-5 gap-2 border border-border bg-card" disabled={isRetrying} onClick={onRetry}><RotateCcw className="size-4" />{isRetrying ? 'Retrying…' : 'Retry extraction'}</Button></div>
}
