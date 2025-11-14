import { useState, useEffect } from 'react';
import type { Message } from '@doot-app/shared';

/**
 * Chat hook
 * Manages chat messages and real-time subscriptions
 * TODO: Connect to AppSync subscriptions for real-time messaging
 */
export const useChat = (matchId: string) => {
  const [messages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    // TODO: Fetch existing messages and update with setMessages
    loadMessages();

    // TODO: Subscribe to new messages
    const subscription = subscribeToMessages();

    return () => {
      // TODO: Unsubscribe on cleanup
      subscription?.unsubscribe();
    };
  }, [matchId]);

  const loadMessages = async () => {
    setLoading(true);
    // TODO: Implement AppSync query to fetch messages
    console.log('Loading messages for match:', matchId);
    setLoading(false);
  };

  const sendMessage = async (content: string) => {
    // TODO: Implement AppSync mutation to send message
    console.log('Sending message:', content);
  };

  const subscribeToMessages = () => {
    // TODO: Implement AppSync subscription for real-time messages
    console.log('Subscribing to messages for match:', matchId);
    return {
      unsubscribe: () => console.log('Unsubscribed from messages'),
    };
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};
