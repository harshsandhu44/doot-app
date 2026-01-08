import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

export function ChatBubble({
  message,
  timestamp,
  isSent,
  isRead = false,
}: ChatBubbleProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, isSent && styles.sentContainer]}>
      <Surface
        style={[
          styles.bubble,
          isSent
            ? {
                backgroundColor: theme.colors.primary,
                alignSelf: "flex-end",
              }
            : {
                backgroundColor: theme.colors.surfaceVariant,
                alignSelf: "flex-start",
              },
        ]}
        elevation={1}
      >
        <Text
          variant="bodyMedium"
          style={[
            styles.messageText,
            {
              color: isSent
                ? theme.colors.onPrimary
                : theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {message}
        </Text>
        <View style={styles.timestampContainer}>
          <Text
            variant="bodySmall"
            style={[
              styles.timestamp,
              {
                color: isSent
                  ? theme.colors.onPrimary
                  : theme.colors.onSurfaceVariant,
                opacity: 0.8,
              },
            ]}
          >
            {timestamp}
          </Text>
          {isSent && (
            <Text
              variant="bodySmall"
              style={[
                styles.readIndicator,
                { color: theme.colors.onPrimary, opacity: 0.8 },
              ]}
            >
              {isRead ? "✓✓" : "✓"}
            </Text>
          )}
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
    marginHorizontal: 16,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  sentContainer: {
    alignSelf: "flex-end",
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    lineHeight: 22,
    fontSize: 15,
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  readIndicator: {
    fontSize: 12,
  },
});
