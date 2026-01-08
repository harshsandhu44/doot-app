import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

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
  return (
    <View style={[styles.container, isSent ? styles.sentContainer : styles.receivedContainer]}>
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isSent ? COLORS.white : COLORS.text },
          ]}
        >
          {message}
        </Text>
      </View>
      <View style={[styles.timestampContainer, isSent ? styles.sentTimestamp : styles.receivedTimestamp]}>
        <Text style={styles.timestamp}>
          {timestamp}
        </Text>
        {isSent && (
          <Text style={[styles.readIndicator, { color: isRead ? COLORS.secondary : COLORS.textSecondary }]}>
            {isRead ? "Read" : "Sent"}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.md,
    maxWidth: '80%',
  },
  sentContainer: {
    alignSelf: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
  },
  sentBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  timestampContainer: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 4,
  },
  sentTimestamp: {
    justifyContent: 'flex-end',
  },
  receivedTimestamp: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  readIndicator: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
  },
});