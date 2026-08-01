import { useCallback, useEffect, useRef, useState } from 'react'
import { Gauge, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useReaderStore } from '@/store/readerStore'

function paragraphs(text?: string) {
  if (!text) return []
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)
}

export function AudioControls({ pageText }: { pageText?: string }) {
  const {
    currentPage,
    totalPages,
    activeParagraphIndex,
    setActiveParagraphIndex,
    isPlaying,
    setIsPlaying,
    playbackRate,
    setPlaybackRate,
    nextPage,
    prevPage,
  } = useReaderStore()

  const [speedMenuOpen, setSpeedMenuOpen] = useState(false)
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const content = paragraphs(pageText)
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying

  const speakCurrentParagraph = useCallback(
    (index: number) => {
      if (!isSpeechSupported) return
      window.speechSynthesis.cancel()

      const pText = content[index]
      if (!pText) {
        // Page finished! Advance to next page if possible
        if (currentPage < totalPages) {
          nextPage()
        } else {
          setIsPlaying(false)
        }
        return
      }

      const utterance = new SpeechSynthesisUtterance(pText)
      utterance.rate = playbackRate

      utterance.onend = () => {
        if (!isPlayingRef.current) return
        const nextIdx = index + 1
        if (nextIdx < content.length) {
          setActiveParagraphIndex(nextIdx)
        } else if (currentPage < totalPages) {
          nextPage()
        } else {
          setIsPlaying(false)
        }
      }

      utterance.onerror = () => {
        setIsPlaying(false)
      }

      window.speechSynthesis.speak(utterance)
    },
    [content, currentPage, totalPages, isSpeechSupported, playbackRate, nextPage, setActiveParagraphIndex, setIsPlaying]
  )

  // Trigger speech when active paragraph changes while playing
  useEffect(() => {
    if (isPlaying) {
      speakCurrentParagraph(activeParagraphIndex)
    } else if (isSpeechSupported) {
      window.speechSynthesis.cancel()
    }
  }, [activeParagraphIndex, isPlaying, speakCurrentParagraph, isSpeechSupported])

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeechSupported) window.speechSynthesis.cancel()
    }
  }, [isSpeechSupported])

  const togglePlayPause = () => {
    if (!isSpeechSupported) return
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      speakCurrentParagraph(activeParagraphIndex)
    }
  }

  const handleSkipBack = () => {
    if (activeParagraphIndex > 0) {
      setActiveParagraphIndex(activeParagraphIndex - 1)
    } else if (currentPage > 1) {
      prevPage()
    }
  }

  const handleSkipForward = () => {
    if (activeParagraphIndex < content.length - 1) {
      setActiveParagraphIndex(activeParagraphIndex + 1)
    } else if (currentPage < totalPages) {
      nextPage()
    }
  }

  const totalChunks = content.length || 1
  const progressPercent = Math.round(((activeParagraphIndex + 1) / totalChunks) * 100)

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            className="size-9 rounded-full px-0 hover:bg-muted"
            aria-label="Previous section"
            title="Previous section"
            onClick={handleSkipBack}
          >
            <SkipBack className="size-4" />
          </Button>

          <Button
            type="button"
            variant="default"
            className="size-11 rounded-full px-0 shadow-md transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? 'Pause audio reading' : 'Play audio reading'}
            title={isPlaying ? 'Pause audio reading' : 'Play audio reading'}
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current translate-x-0.5" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="size-9 rounded-full px-0 hover:bg-muted"
            aria-label="Next section"
            title="Next section"
            onClick={handleSkipForward}
          >
            <SkipForward className="size-4" />
          </Button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full flex-1">
          <div className="flex items-center gap-3 text-xs tabular-nums text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Volume2 className="size-3.5 text-primary" />
              Section {content.length > 0 ? activeParagraphIndex + 1 : 0} of {content.length}
            </span>

            {/* Custom Interactive Track */}
            <div className="relative flex-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <span className="font-medium text-muted-foreground">{progressPercent}%</span>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="relative mx-auto sm:mx-0">
          <Button
            type="button"
            variant="secondary"
            className="h-9 gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold shadow-xs"
            aria-label="Choose playback speed"
            aria-expanded={speedMenuOpen}
            onClick={() => setSpeedMenuOpen((open) => !open)}
          >
            <Gauge className="size-3.5 text-primary" /> {playbackRate}×
          </Button>

          {speedMenuOpen && (
            <div className="absolute bottom-12 right-0 z-40 w-32 rounded-xl border border-border bg-card p-1 shadow-xl">
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Reading Speed
              </div>
              {speeds.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setPlaybackRate(value)
                    setSpeedMenuOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm hover:bg-muted ${
                    playbackRate === value ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground'
                  }`}
                >
                  <span>{value}×</span>
                  {playbackRate === value && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
