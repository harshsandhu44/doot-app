import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { UserProfile } from '../models/user';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { Badge } from './badge';

interface MessagePreviewProps {
  user: UserProfile;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isSentByMe?: boolean;
  onPress: () => void;
}

export function MessagePreview({
  user,
  lastMessage = "Say hi!",
  timestamp = "",
  unreadCount = 0,
  isSentByMe = false,
  onPress,
}: MessagePreviewProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.badgeContainer}>
            {unreadCount > 0 && <Badge dot style={styles.dot} />}
          </View>
          <Image
            source={{ uri: user.profile.photos?.[0] || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.name} numberOfLines={1}>
            {user.profile.name}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {isSentByMe ? "You: " : ""}{lastMessage}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.timestamp}>
            {timestamp}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  badgeContainer: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: COLORS.error,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  lastMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: '100%',
  },
  timestamp: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
});