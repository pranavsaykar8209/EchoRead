import { FileText, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export function ReaderPlaceholder() {
  return <section className="relative flex min-h-100 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-muted/40 p-6"><div className="absolute inset-x-10 top-10 h-px bg-border" /><div className="absolute inset-x-16 bottom-14 h-px bg-border" /><div className="relative max-w-sm text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-card shadow-sm"><FileText className="size-6 text-muted-foreground" /></span><h2 className="mt-5 text-xl font-semibold">PDF viewer coming soon</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">This distraction-free canvas is ready for your book. PDF rendering will be added in a future phase.</p><div className="mt-6 flex flex-wrap justify-center gap-2"><Badge><Sparkles className="mr-1 size-3" /> Sync status coming soon</Badge><Badge>Current sentence coming soon</Badge></div></div></section>
}
