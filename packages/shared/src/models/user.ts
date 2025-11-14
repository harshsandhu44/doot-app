/**
 * User Profile domain model
 */
export interface UserProfile {
  /** Unique user identifier */
  id: string;

  /** Display name shown to other users */
  displayName: string;

  /** User's age */
  age: number;

  /** User's gender (optional) */
  gender?: string;

  /** User's bio/description (optional) */
  bio?: string;

  /** Array of photo URLs */
  photos: string[];

  /** Account creation timestamp */
  createdAt: Date;
}
