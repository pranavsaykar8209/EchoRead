export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const formattedMins = String(mins).padStart(2, '0')
  const formattedSecs = String(secs).padStart(2, '0')

  if (hrs > 0) {
    return `${hrs}:${formattedMins}:${formattedSecs}`
  }
  return `${formattedMins}:${formattedSecs}`
}

export function TimeDisplay({ currentTime, duration }: { currentTime: number; duration: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground font-medium select-none">
      <span>{formatTime(currentTime)}</span>
      <span>/</span>
      <span>{formatTime(duration)}</span>
    </div>
  )
}
