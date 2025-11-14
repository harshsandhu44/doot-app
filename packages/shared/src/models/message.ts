/**
 * Message domain model
 */
export interface Message {
  /** Unique message identifier */
  id: string;

  /** Match ID this message belongs to */
  matchId: string;

  /** ID of the user who sent the message */
  senderId: string;

  /** ID of the user who receives the message */
  receiverId: string;

  /** Message content */
  content: string;

  /** Timestamp when the message was sent */
  sentAt: Date;

  /** Whether the message has been read */
  isRead: boolean;
}
