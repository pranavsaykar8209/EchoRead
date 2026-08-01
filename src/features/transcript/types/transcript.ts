export interface TranscriptWord {
  word: string
  start: number // start timestamp in seconds
  end: number // end timestamp in seconds
}

export interface TranscriptSegment {
  id: string
  start: number // start timestamp in seconds
  end: number // end timestamp in seconds
  text: string
  words: TranscriptWord[]
}

export interface Transcript {
  bookId: string
  duration: number // total audio duration in seconds
  language: string
  segments: TranscriptSegment[]
  generatedAt: string
}
