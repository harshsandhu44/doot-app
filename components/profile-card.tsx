import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Text, IconButton, useTheme } from "react-native-paper";
import { PhotoCarousel } from "./photo-carousel";
import { InterestTag } from "./interest-tag";
import { UserProfile } from "../models/user";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ProfileCardProps {
  profile: UserProfile & { distance: number };
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
}

export function ProfileCard({
  profile,
  onLike,
  onPass,
  onSuperLike,
}: ProfileCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <PhotoCarousel
        photos={profile.profile.photos}
        height={SCREEN_HEIGHT * 0.6}
      />

      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.name}>
            {profile.profile.name}, {profile.profile.age}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {Math.round(profile.distance)} km away
          </Text>
        </View>

        {profile.profile.bio && (
          <Text variant="bodyMedium" style={styles.bio} numberOfLines={3}>
            {profile.profile.bio}
          </Text>
        )}

        {profile.profile.interests && profile.profile.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            {profile.profile.interests.slice(0, 6).map((interest, index) => (
              <InterestTag key={index} interest={interest} />
            ))}
          </View>
        )}
      </Card.Content>

      <View style={styles.actionsContainer}>
        <IconButton
          icon="close"
          mode="contained"
          size={32}
          iconColor={theme.colors.error}
          containerColor={theme.colors.surface}
          onPress={onPass}
          style={styles.actionButton}
        />
        <IconButton
          icon="star"
          mode="contained"
          size={28}
          iconColor={theme.colors.tertiary}
          containerColor={theme.colors.surface}
          onPress={onSuperLike}
          style={styles.actionButton}
        />
        <IconButton
          icon="heart"
          mode="contained"
          size={32}
          iconColor={theme.colors.primary}
          containerColor={theme.colors.surface}
          onPress={onLike}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontWeight: "600",
    marginBottom: 4,
  },
  bio: {
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 24,
  },
  actionButton: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
