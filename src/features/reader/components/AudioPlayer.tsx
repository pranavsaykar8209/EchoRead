import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { AudioControls } from '@/features/reader/components/AudioControls'
import { ProgressSlider } from '@/features/reader/components/ProgressSlider'
import { SpeedSelector } from '@/features/reader/components/SpeedSelector'
import { TimeDisplay } from '@/features/reader/components/TimeDisplay'
import { VolumeControl } from '@/features/reader/components/VolumeControl'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book } from '@/features/library/types/book'
import { useReaderStore } from '@/store/readerStore'

interface AudioPlayerProps {
  book: Book
}

export function AudioPlayer({ book }: AudioPlayerProps) {
  const { currentPage } = useReaderStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(book.lastAudioPosition || 0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(book.playbackSpeed || 1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Create Object URL for audio file and release resources on unmount
  useEffect(() => {
    setError(null)
    setIsPlaying(false)
    setCurrentTime(book.lastAudioPosition || 0)
    setSpeed(book.playbackSpeed || 1)

    if (!book.audioFile || !book.audioFile.blob) {
      setError('Audio file is missing or unavailable for this book.')
      return
    }

    let url: string | null = null
    try {
      url = URL.createObjectURL(book.audioFile.blob)
      setAudioUrl(url)
    } catch (err) {
      setError('Failed to load audio resource.')
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [book.id, book.audioFile, book.lastAudioPosition, book.playbackSpeed])

  // 2. Sync volume & muted state with audio element
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  // 3. Sync speed rate with audio element
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.playbackRate = speed
  }, [speed])

  // 4. Save reading & audio progress to local storage (debounced)
  const saveProgress = useCallback(
    (pos: number, rate: number) => {
      void bookStorage.updateProgress(book.id, {
        lastReadPage: currentPage,
        lastAudioPosition: Math.floor(pos),
        playbackSpeed: rate,
      })
    },
    [book.id, currentPage]
  )

  // Debounced save progress when time or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress(currentTime, speed)
    }, 1000)
    return () => clearTimeout(timer)
  }, [currentTime, speed, currentPage, saveProgress])

  // Audio Event Handlers
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    const dur = audioRef.current.duration
    setDuration(dur || 0)

    // Restore last audio position
    const restoredPos = book.lastAudioPosition || 0
    if (restoredPos > 0 && restoredPos < dur) {
      audioRef.current.currentTime = restoredPos
      setCurrentTime(restoredPos)
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleError = () => {
    setError('Audio playback error: Format unsupported or corrupted file.')
    setIsPlaying(false)
  }

  // Action Handlers
  const handlePlay = () => {
    if (!audioRef.current || error) return
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setError('Unable to play audio.'))
  }

  const handlePause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const handleStop = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (newTime: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleSkipBack = () => {
    if (!audioRef.current) return
    const newTime = Math.max(0, audioRef.current.currentTime - 15)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleSkipForward = () => {
    if (!audioRef.current) return
    const newTime = Math.min(duration, audioRef.current.currentTime + 15)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed
    }
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    if (newVol > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-6">
      {/* Hidden HTML5 Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
        />
      )}

      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        {/* Error Banner */}
        {error ? (
          <div className="flex w-full items-center gap-2 rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Playback Action Buttons */}
            <AudioControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onSkipBack={handleSkipBack}
              onSkipForward={handleSkipForward}
              disabled={!audioUrl}
            />

            {/* Timeline Progress Slider & Timestamp Display */}
            <div className="flex w-full flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <TimeDisplay currentTime={currentTime} duration={duration} />
              <ProgressSlider currentTime={currentTime} duration={duration} onSeek={handleSeek} disabled={!audioUrl} />
            </div>

            {/* Controls: Volume & Speed */}
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={handleVolumeChange}
                onToggleMute={handleToggleMute}
                disabled={!audioUrl}
              />
              <SpeedSelector currentSpeed={speed} onSpeedChange={handleSpeedChange} disabled={!audioUrl} />
            </div>
          </>
        )}
      </div>
    </footer>
  )
}
