/**
 * Mutation.sendMessage Lambda Resolver
 * Handles message sending with validation, storage, and notifications
 * Uses Lambda for complex business logic and integrations
 *
 * This demonstrates importing shared types from @doot-app/shared
 */

import type { Message } from '@doot-app/shared';

interface AppSyncEvent {
  arguments: {
    input: {
      matchId: string;
      receiverId: string;
      content: string;
    };
  };
  identity: {
    sub: string;
    username: string;
  };
}

interface AppSyncResponse {
  message?: Message;
  error?: string;
}

/**
 * Lambda handler for sendMessage mutation
 * Creates a new message and triggers real-time subscriptions
 */
export const handler = async (event: AppSyncEvent): Promise<AppSyncResponse> => {
  const { matchId, receiverId, content } = event.arguments.input;
  const senderId = event.identity.sub;

  try {
    // TODO: Validate that the match exists and both users are part of it
    // TODO: Validate message content (length, profanity filter, etc.)
    // TODO: Check if match is still active

    // Create message object using shared Message type
    const message: Message = {
      id: generateMessageId(),
      matchId,
      senderId,
      receiverId,
      content,
      sentAt: new Date(),
      isRead: false,
    };

    // TODO: Store message in DynamoDB
    // await dynamoDB.put({ TableName: 'Messages', Item: message });

    // TODO: Update match's lastMessageAt timestamp
    // await dynamoDB.update({ ... });

    // TODO: Send push notification to receiver
    // await sns.publish({ ... });

    // TODO: Trigger AppSync subscription for real-time delivery
    // This happens automatically via AppSync subscription resolution

    console.log('Message sent:', message.id);
    return { message };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
};

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
