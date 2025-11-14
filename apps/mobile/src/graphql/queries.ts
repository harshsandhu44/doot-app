/**
 * GraphQL Queries
 * Query definitions for fetching data from AppSync
 * TODO: Define actual queries once backend schema is finalized
 */

export const GET_USER_PROFILE = `
  query GetUserProfile($userId: ID!) {
    # TODO: Define query structure based on AppSync schema
  }
`;

export const GET_MATCHES = `
  query GetMatches($userId: ID!) {
    # TODO: Define query structure based on AppSync schema
  }
`;

export const GET_MESSAGES = `
  query GetMessages($matchId: ID!) {
    # TODO: Define query structure based on AppSync schema
  }
`;

export const GET_DISCOVERY_PROFILES = `
  query GetDiscoveryProfiles($filters: DiscoveryFilters) {
    # TODO: Define query structure based on AppSync schema
  }
`;
