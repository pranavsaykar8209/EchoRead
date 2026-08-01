import { useState } from 'react'
import { Gauge } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SpeedSelectorProps {
  currentSpeed: number
  onSpeedChange: (speed: number) => void
  disabled?: boolean
}

export function SpeedSelector({ currentSpeed, onSpeedChange, disabled = false }: SpeedSelectorProps) {
  const [open, setOpen] = useState(false)
  const speeds = [0.75, 1, 1.25, 1.5, 1.75, 2]

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="h-9 gap-1.5 rounded-xl border border-border/80 bg-card px-3 text-xs font-semibold shadow-xs"
        aria-label="Choose playback speed"
        aria-expanded={open}
      >
        <Gauge className="size-3.5 text-primary" />
        <span>{currentSpeed}×</span>
      </Button>

      {open && (
        <div className="absolute bottom-11 right-0 z-50 w-32 rounded-xl border border-border/80 bg-card/95 p-1 shadow-xl backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Playback Speed
          </div>
          {speeds.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => {
                onSpeedChange(rate)
                setOpen(false)
              }}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted ${
                currentSpeed === rate ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground'
              }`}
            >
              <span>{rate}×</span>
              {currentSpeed === rate && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
