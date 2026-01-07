import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { List, Avatar, Badge, Text, useTheme } from "react-native-paper";
import { UserProfile } from "../models/user";

interface MessagePreviewProps {
  user: UserProfile;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  onPress: () => void;
}

export function MessagePreview({
  user,
  lastMessage = "Say hi!",
  timestamp = "",
  unreadCount = 0,
  onPress,
}: MessagePreviewProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <List.Item
        title={user.profile.name}
        description={lastMessage}
        titleStyle={styles.title}
        descriptionStyle={styles.description}
        descriptionNumberOfLines={1}
        left={(props) =>
          user.profile.photos && user.profile.photos.length > 0 ? (
            <Avatar.Image
              {...props}
              size={56}
              source={{ uri: user.profile.photos[0] }}
            />
          ) : (
            <Avatar.Icon
              {...props}
              size={56}
              icon="account"
              style={{ backgroundColor: theme.colors.surfaceVariant }}
            />
          )
        }
        right={(props) => (
          <View style={styles.rightContainer}>
            {timestamp && (
              <Text
                variant="bodySmall"
                style={[
                  styles.timestamp,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {timestamp}
              </Text>
            )}
            {unreadCount > 0 && (
              <Badge
                size={20}
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                {unreadCount}
              </Badge>
            )}
          </View>
        )}
        style={styles.item}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  rightContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 4,
  },
  badge: {
    fontWeight: "600",
  },
});
