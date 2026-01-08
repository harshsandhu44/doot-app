import React from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '../models/user';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

interface MatchCardProps {
  user: UserProfile;
  matchTime: string;
  onPress: () => void;
}

export function MatchCard({ user, matchTime, onPress }: MatchCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: user.profile.photos?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
          contentFit="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {user.profile.name}, {user.profile.age}
            </Text>
            <Text style={styles.timestamp} numberOfLines={1}>
              {matchTime}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH, // Square aspect ratio
    marginBottom: SPACING.md,
  },
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: SPACING.sm,
  },
  content: {
    gap: 2,
  },
  name: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  timestamp: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
    opacity: 0.8,
  },
});