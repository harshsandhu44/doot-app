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
                backgroundColor: theme.colors.primaryContainer,
                alignSelf: "flex-end",
              }
            : {
                backgroundColor: theme.colors.surfaceVariant,
                alignSelf: "flex-start",
              },
        ]}
        elevation={0}
      >
        <Text
          variant="bodyMedium"
          style={[
            styles.messageText,
            {
              color: isSent
                ? theme.colors.onPrimaryContainer
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
                  ? theme.colors.onPrimaryContainer
                  : theme.colors.onSurfaceVariant,
                opacity: 0.7,
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
                { color: theme.colors.onPrimaryContainer, opacity: 0.7 },
              ]}
            >
              {isRead ? "Read" : "Sent"}
            </Text>
          )}
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    maxWidth: "75%",
    alignSelf: "flex-start",
  },
  sentContainer: {
    alignSelf: "flex-end",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    lineHeight: 20,
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  readIndicator: {
    fontSize: 11,
    marginLeft: 8,
  },
});
