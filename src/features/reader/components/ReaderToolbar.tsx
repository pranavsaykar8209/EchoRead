import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ReaderToolbar() {
  return <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3 sm:px-6"><p className="text-sm text-muted-foreground">Page 1 <span className="text-border">/</span> 200</p><div className="flex items-center rounded-xl border bg-card p-1 shadow-sm"><Button type="button" variant="ghost" className="size-8 px-0" aria-label="Zoom out"><Minus className="size-4" /></Button><span className="grid min-w-14 place-items-center text-xs font-medium">100%</span><Button type="button" variant="ghost" className="size-8 px-0" aria-label="Zoom in"><Plus className="size-4" /></Button></div></div>
}
