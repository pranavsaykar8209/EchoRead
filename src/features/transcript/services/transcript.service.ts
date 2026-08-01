import { AppConfig } from '@/config/app.config'
import { bookStorage } from '@/features/library/services/bookStorage'
import type { Book } from '@/features/library/types/book'
import type { Transcript, TranscriptSegment, TranscriptWord } from '@/features/transcript/types/transcript'

class TranscriptService {
  /**
   * Get cached transcript for a book if it exists.
   */
  async getTranscript(bookId: string): Promise<Transcript | undefined> {
    return bookStorage.getTranscript(bookId)
  }

  /**
   * Check whether a transcript is already cached locally.
   */
  async hasTranscript(bookId: string): Promise<boolean> {
    const cached = await this.getTranscript(bookId)
    return Boolean(cached && cached.segments && cached.segments.length > 0)
  }

  /**
   * Save a transcript to local IndexedDB storage.
   */
  async saveTranscript(transcript: Transcript): Promise<Transcript> {
    return bookStorage.saveTranscript(transcript)
  }

  /**
   * Generate or retrieve cached timestamped transcript for an audiobook.
   */
  async generateTranscript(book: Book): Promise<Transcript> {
    // 1. Check local cache first — never regenerate if already exists
    const existing = await this.getTranscript(book.id)
    if (existing && existing.segments.length > 0) {
      console.log(`[TranscriptService] Loaded cached transcript for book "${book.title}" (${existing.segments.length} segments)`)
      return existing
    }

    console.log(`[TranscriptService] Generating new transcript for "${book.title}"…`)

    // 2. Determine target audio processing limit based on Development Mode
    const defaultFullDuration = 1800 // 30 mins fallback estimate
    const maxAllowedSeconds = AppConfig.developmentProcessing
      ? AppConfig.maxAudioMinutes * 60
      : defaultFullDuration

    const effectiveDuration = Math.min(defaultFullDuration, maxAllowedSeconds)

    // 3. Build timestamped segments and word-level timing from page text
    const segments: TranscriptSegment[] = []
    let currentTime = 0
    const sentencesPool: string[] = []

    if (book.pages && book.pages.length > 0) {
      for (const p of book.pages) {
        const sentences = p.text
          .split(/(?<=[.!?])\s+|\n+/)
          .map((s) => s.trim())
          .filter(Boolean)
        sentencesPool.push(...sentences)
      }
    } else {
      sentencesPool.push('Welcome to EchoRead audio player.', 'Audiobook playback ready.')
    }

    let segmentIndex = 0
    for (const text of sentencesPool) {
      if (currentTime >= effectiveDuration) break

      const wordsRaw = text.split(/\s+/).filter(Boolean)
      if (wordsRaw.length === 0) continue

      const segmentDuration = Math.max(2, Math.round(wordsRaw.length * 0.4))
      const segStart = currentTime
      const segEnd = Math.min(effectiveDuration, segStart + segmentDuration)

      const timePerWord = (segEnd - segStart) / wordsRaw.length
      const words: TranscriptWord[] = wordsRaw.map((word, idx) => ({
        word,
        start: Number((segStart + idx * timePerWord).toFixed(2)),
        end: Number((segStart + (idx + 1) * timePerWord).toFixed(2)),
      }))

      segments.push({
        id: `seg-${book.id}-${segmentIndex += 1}`,
        start: segStart,
        end: segEnd,
        text,
        words,
      })

      currentTime = segEnd
    }

    const transcript: Transcript = {
      bookId: book.id,
      duration: effectiveDuration,
      language: 'en',
      segments,
      generatedAt: new Date().toISOString(),
    }

    // 4. Save to IndexedDB cache
    await this.saveTranscript(transcript)
    console.log(`[TranscriptService] Generated & cached transcript with ${segments.length} segments`)

    return transcript
  }
}

export const transcriptService = new TranscriptService()
