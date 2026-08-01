import { Pause, Play, RotateCcw, RotateCw, Square } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AudioControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSkipBack: () => void
  onSkipForward: () => void
  disabled?: boolean
}

export function AudioControls({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onSkipBack,
  onSkipForward,
  disabled = false,
}: AudioControlsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Skip Backward 15 Seconds */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onSkipBack}
        aria-label="Skip backward 15 seconds"
        title="Skip backward 15 seconds (-15s)"
        className="size-9 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <RotateCcw className="size-4" />
      </Button>

      {/* Play / Pause Toggle */}
      {isPlaying ? (
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={disabled}
          onClick={onPause}
          aria-label="Pause audio"
          title="Pause"
          className="size-11 rounded-full p-0 shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Pause className="size-5 fill-current" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={disabled}
          onClick={onPlay}
          aria-label="Play audio"
          title="Play"
          className="size-11 rounded-full p-0 shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Play className="size-5 translate-x-0.5 fill-current" />
        </Button>
      )}

      {/* Stop Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onStop}
        aria-label="Stop audio"
        title="Stop"
        className="size-9 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Square className="size-4 fill-current" />
      </Button>

      {/* Skip Forward 15 Seconds */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onSkipForward}
        aria-label="Skip forward 15 seconds"
        title="Skip forward 15 seconds (+15s)"
        className="size-9 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <RotateCw className="size-4" />
      </Button>
    </div>
  )
}
