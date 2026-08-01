import { Bookmark, ChevronLeft, ListTree, NotebookPen } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EmptyPanel } from '@/features/reader/components/EmptyPanel'
import { cn } from '@/lib/cn'

const panels = [
  { label: 'Chapters', icon: ListTree, title: 'No chapters yet', description: 'Chapter navigation will be available when book structure is added.' },
  { label: 'Bookmarks', icon: Bookmark, title: 'No bookmarks yet', description: 'Save your place as you read in a future update.' },
  { label: 'Notes', icon: NotebookPen, title: 'No notes yet', description: 'Your reading notes will live here.' },
]

export function Sidebar() {
  const [active, setActive] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  const panel = panels[active]
  const PanelIcon = panel.icon
  if (collapsed) return <aside className="hidden border-l border-border bg-card lg:flex"><Button type="button" variant="ghost" className="m-2 size-9 px-0" aria-label="Expand sidebar" onClick={() => setCollapsed(false)}><ChevronLeft className="size-4 rotate-180" /></Button></aside>
  return <aside className="hidden w-72 shrink-0 border-l border-border bg-card lg:flex lg:flex-col"><div className="flex items-center justify-between border-b border-border p-3"><span className="text-sm font-medium">Reader tools</span><Button type="button" variant="ghost" className="size-8 px-0" aria-label="Collapse sidebar" onClick={() => setCollapsed(true)}><ChevronLeft className="size-4" /></Button></div><div className="grid grid-cols-3 gap-1 border-b border-border p-2">{panels.map(({ label, icon: Icon }, index) => <Button key={label} type="button" variant="ghost" onClick={() => setActive(index)} aria-pressed={active === index} className={cn('h-16 flex-col gap-1 px-1 text-xs', active === index && 'bg-secondary')}><Icon className="size-4" /><span>{label}</span></Button>)}</div><EmptyPanel icon={<PanelIcon className="size-5" />} title={panel.title} description={panel.description} /></aside>
}
