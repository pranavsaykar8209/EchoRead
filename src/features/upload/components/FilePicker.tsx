import { FileText, Music, Upload } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FilePickerProps {
  accept: string
  file?: File
  label: string
  error?: string
  onChange: (file?: File) => void
  kind: 'pdf' | 'audio'
}

export function FilePicker({ accept, file, label, error, onChange, kind }: FilePickerProps) {
  const Icon = kind === 'pdf' ? FileText : Music
  return <div><label className="block text-sm font-medium">{label}</label><label className={cn('mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-dashed p-4 transition hover:border-foreground/30 hover:bg-muted/50', error && 'border-red-500')}><span className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary"><Icon className="size-4" /></span><span className="truncate text-sm text-muted-foreground">{file ? file.name : `Choose ${kind === 'pdf' ? 'PDF' : 'audio file'}`}</span></span><span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium"><Upload className="size-4" /> Choose</span><input className="sr-only" type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0])} /></label>{error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}</div>
}
