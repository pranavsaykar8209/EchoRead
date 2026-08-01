import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  disabled?: boolean
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  disabled = false,
}: VolumeControlProps) {
  const displayVolume = isMuted ? 0 : volume

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        className="size-8 p-0 text-muted-foreground hover:text-foreground"
      >
        {isMuted || volume === 0 ? <VolumeX className="size-4 text-destructive" /> : <Volume2 className="size-4" />}
      </Button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={displayVolume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        disabled={disabled}
        aria-label="Volume slider"
        className="h-1.5 w-16 cursor-pointer appearance-none rounded-full bg-muted accent-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-20"
      />
    </div>
  )
}
