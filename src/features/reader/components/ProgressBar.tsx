export function ProgressBar() {
  return <div className="flex items-center gap-3 text-xs tabular-nums text-muted-foreground"><span>00:00</span><input type="range" min="0" max="100" value="0" readOnly aria-label="Audio progress" className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary" /><span>08:32:11</span></div>
}
