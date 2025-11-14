/**
 * Match domain model
 */
export interface Match {
  /** Unique match identifier */
  id: string;

  /** First user in the match */
  userId1: string;

  /** Second user in the match */
  userId2: string;

  /** Timestamp when the match was created */
  matchedAt: Date;

  /** Whether the match is still active */
  isActive: boolean;
}
