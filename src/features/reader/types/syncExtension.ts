/**
 * Reserved Extension Points for Future Synchronization Engine.
 * Note: Do NOT implement synchronization logic in this phase.
 */
export type AnchorStatus = 'none' | 'generating' | 'ready' | 'error'

export interface SyncExtensionPoints {
  /** Reserved for future word-level synchronization */
  currentWord?: string
  /** Reserved for future sentence-level synchronization */
  currentSentence?: string
  /** Reserved for lightweight navigation anchor status */
  anchorStatus?: AnchorStatus
  /** Reserved for background synchronization progress percentage (0 - 100) */
  syncProgress?: number
}
