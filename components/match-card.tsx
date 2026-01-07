import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Card, Text, Avatar, useTheme } from "react-native-paper";
import { UserProfile } from "../models/user";

interface MatchCardProps {
  user: UserProfile;
  matchTime: string;
  onPress: () => void;
}

export function MatchCard({ user, matchTime, onPress }: MatchCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          {user.profile.photos && user.profile.photos.length > 0 ? (
            <Avatar.Image
              size={120}
              source={{ uri: user.profile.photos[0] }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Icon
              size={120}
              icon="account"
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />
          )}
        </View>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
            {user.profile.name}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
            numberOfLines={1}
          >
            {user.profile.age} • {matchTime}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
  avatar: {
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
});
