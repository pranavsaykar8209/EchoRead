import React from 'react'

interface ProgressSliderProps {
  currentTime: number
  duration: number
  onSeek: (newTime: number) => void
  disabled?: boolean
}

export function ProgressSlider({ currentTime, duration, onSeek, disabled = false }: ProgressSliderProps) {
  const percent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    const newTime = (val / 100) * duration
    onSeek(newTime)
  }

  return (
    <div className="relative flex w-full items-center">
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={percent}
        onChange={handleChange}
        disabled={disabled || duration === 0}
        aria-label="Audio timeline progress"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
}
