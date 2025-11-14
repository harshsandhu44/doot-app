/**
 * GraphQL Subscriptions
 * Real-time subscription definitions for AppSync
 * TODO: Define actual subscriptions once backend schema is finalized
 */

export const ON_MESSAGE_RECEIVED = `
  subscription OnMessageReceived($matchId: ID!) {
    # TODO: Define subscription structure based on AppSync schema
    # This will enable real-time message delivery
  }
`;

export const ON_NEW_MATCH = `
  subscription OnNewMatch($userId: ID!) {
    # TODO: Define subscription structure based on AppSync schema
    # This will notify users of new matches in real-time
  }
`;

export const ON_MATCH_STATUS_CHANGED = `
  subscription OnMatchStatusChanged($matchId: ID!) {
    # TODO: Define subscription structure based on AppSync schema
  }
`;
