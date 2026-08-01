import { Gauge, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/features/reader/components/ProgressBar'

export function AudioControls() {
  const [speed, setSpeed] = useState(1)
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false)
  const speeds = [0.5, 1, 1.5, 2]
  return <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6"><div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"><div className="flex items-center justify-center gap-1"><Button type="button" variant="ghost" className="size-9 px-0" aria-label="Previous chapter"><SkipBack className="size-4" /></Button><Button type="button" className="size-10 rounded-full px-0" aria-label="Play audio"><Play className="size-4 fill-current" /></Button><Button type="button" variant="ghost" className="size-9 px-0" aria-label="Pause audio"><Pause className="size-4 fill-current" /></Button><Button type="button" variant="ghost" className="size-9 px-0" aria-label="Next chapter"><SkipForward className="size-4" /></Button></div><div className="w-full flex-1"><ProgressBar /></div><div className="relative mx-auto sm:mx-0"><Button type="button" variant="secondary" className="h-8 gap-1.5 border border-border bg-card px-2.5 text-xs" aria-label="Choose playback speed" aria-expanded={speedMenuOpen} onClick={() => setSpeedMenuOpen((open) => !open)}><Gauge className="size-3.5" /> {speed}×</Button>{speedMenuOpen && <div className="absolute bottom-10 right-0 z-40 w-28 rounded-xl border border-border bg-card p-1 shadow-lg">{speeds.map((value) => <button key={value} type="button" onClick={() => { setSpeed(value); setSpeedMenuOpen(false) }} className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted ${speed === value ? 'bg-secondary font-medium' : ''}`}><span>{value}×</span>{speed === value && <span aria-hidden="true">✓</span>}</button>)}</div>}</div></div></footer>
}
