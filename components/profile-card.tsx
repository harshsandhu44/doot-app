import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PhotoCarousel } from './photo-carousel';
import { InterestChip } from './interest-chip';
import { UserProfile } from '../models/user';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

interface ProfileCardProps {
  profile: UserProfile & { distance: number };
  onViewFull?: () => void;
}

export function ProfileCard({ profile, onViewFull }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <PhotoCarousel
        photos={profile.profile.photos}
        height={CARD_HEIGHT}
        width={SCREEN_WIDTH - SPACING.md * 2}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>
              {profile.profile.name}, {profile.profile.age}
            </Text>
            <View style={styles.distanceContainer}>
              <Ionicons name="location-sharp" size={16} color={COLORS.white} />
              <Text style={styles.distance}>
                {Math.round(profile.distance)} km away
              </Text>
            </View>
          </View>

          {profile.profile.interests && (
            <View style={styles.interestsContainer}>
              {profile.profile.interests.slice(0, 3).map((interest, index) => (
                <InterestChip
                  key={index}
                  label={interest}
                  selected
                  style={styles.chip}
                />
              ))}
            </View>
          )}

          {profile.profile.bio && (
            <View>
              <Text style={styles.bio} numberOfLines={2}>
                {profile.profile.bio}
              </Text>
              <TouchableOpacity onPress={onViewFull}>
                <Text style={styles.viewFull}>View Full</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - SPACING.md * 2,
    height: CARD_HEIGHT,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  infoContainer: {
    gap: SPACING.sm,
  },
  header: {
    gap: SPACING.xs,
  },
  name: {
    ...TYPOGRAPHY.title,
    color: COLORS.white,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  chip: {
    marginBottom: 0,
    marginRight: 0,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  bio: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  viewFull: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});