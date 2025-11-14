import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { UserProfile } from '@doot-app/shared';

/**
 * Discover screen
 * Shows potential matches for the user to browse
 *
 * This screen demonstrates importing shared types from @doot-app/shared
 */
export default function DiscoverScreen() {
  // Example user data using the shared UserProfile type
  const exampleUser: UserProfile = {
    id: '123',
    displayName: 'Alex',
    age: 28,
    gender: 'non-binary',
    bio: 'Love hiking and photography!',
    photos: ['https://example.com/photo1.jpg'],
    createdAt: new Date(),
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Find your next match</Text>

        {/* Example card using shared UserProfile type */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{exampleUser.displayName}, {exampleUser.age}</Text>
          {exampleUser.bio && <Text style={styles.cardBio}>{exampleUser.bio}</Text>}
          {exampleUser.gender && <Text style={styles.cardDetail}>Gender: {exampleUser.gender}</Text>}
          <Text style={styles.cardDetail}>Photos: {exampleUser.photos.length}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBio: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
