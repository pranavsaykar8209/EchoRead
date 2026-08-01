interface ProgressIndicatorProps {
  progress: number // 0 - 100
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressIndicator({ progress, label, size = 'md' }: ProgressIndicatorProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)))

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  return (
    <div className="w-full space-y-1.5">
      {(label || clamped !== undefined) && (
        <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground font-medium">
          <span className="truncate">{label || 'Processing…'}</span>
          <span className="font-semibold text-foreground">{clamped}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-muted ${heightClasses[size]}`}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
