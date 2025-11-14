/**
 * Mutation.likeUser Resolver (AppSync JS Runtime)
 * Handles like action and checks for mutual match
 * Uses AppSync JavaScript runtime for moderate complexity logic
 */

import type { Context, DynamoDBPutItemRequest, AppSyncIdentityCognito } from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBPutItemRequest {
  const { userId } = ctx.arguments;

  // Get current user ID from Cognito identity
  const identity = ctx.identity as AppSyncIdentityCognito;
  const currentUserId = identity?.sub || 'unknown';

  // TODO: Check if the other user has already liked this user
  // If yes, create a match. If no, just record the like.

  return {
    operation: 'PutItem',
    key: {
      id: { S: `like_${currentUserId}_${userId}` },
    },
    attributeValues: {
      fromUserId: { S: currentUserId },
      toUserId: { S: userId },
      createdAt: { S: new Date().toISOString() },
    },
  };
}

export function response(ctx: Context) {
  if (ctx.error) {
    console.error('Error in likeUser:', ctx.error);
    return ctx.error;
  }

  // TODO: Implement match detection logic
  // Check if reciprocal like exists and create match if so

  return {
    isMatch: false, // Placeholder
    match: null,
  };
}
