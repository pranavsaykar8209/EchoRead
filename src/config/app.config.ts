export interface ApplicationConfig {
  /** true = process only a small sample of the book; false = process complete book */
  developmentProcessing: boolean
  /** Maximum number of pages to process while developing */
  maxPages: number
  /** Maximum audio duration (in minutes) to process while developing */
  maxAudioMinutes: number
}

const isDevMode = import.meta.env.VITE_DEV_PROCESSING_MODE === 'true'
const parsedMaxPages = Number(import.meta.env.VITE_DEV_MAX_PAGES)
const parsedMaxAudioMinutes = Number(import.meta.env.VITE_DEV_MAX_AUDIO_MINUTES)

export const AppConfig: ApplicationConfig = {
  developmentProcessing: isDevMode,
  maxPages: !isNaN(parsedMaxPages) && parsedMaxPages > 0 ? parsedMaxPages : 10,
  maxAudioMinutes: !isNaN(parsedMaxAudioMinutes) && parsedMaxAudioMinutes > 0 ? parsedMaxAudioMinutes : 10,
}

// Diagnostics: Log configuration when Development Mode is enabled
if (AppConfig.developmentProcessing) {
  console.log(
    `%c🚀 Development Processing Mode Enabled\n%c📄 Max Pages: ${AppConfig.maxPages}\n%c🎧 Max Audio Minutes: ${AppConfig.maxAudioMinutes}`,
    'color: #3b82f6; font-weight: bold; font-size: 13px;',
    'color: #10b981; font-weight: medium;',
    'color: #8b5cf6; font-weight: medium;'
  )
}
