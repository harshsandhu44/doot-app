import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  Surface,
  useTheme,
  ActivityIndicator,
  Text,
  TextInput,
  IconButton,
  Avatar,
} from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { ChatBubble } from "../../components/chat-bubble";
import {
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead,
  Message,
} from "../../services/messages";
import { getMatchById } from "../../services/matches";
import { UserProfile } from "../../models/user";

export default function ChatScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!matchId || !user?.uid) return;

    loadMatchData();

    // Subscribe to real-time messages
    const unsubscribe = subscribeToMessages(matchId, (newMessages) => {
      setMessages(newMessages);
      // Mark messages as read
      markMessagesAsRead(matchId, user.uid);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, user?.uid]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMatchData = async () => {
    if (!matchId || !user?.uid) return;

    try {
      setLoading(true);
      const match = await getMatchById(matchId, user.uid);
      if (match?.otherUser) {
        setOtherUser(match.otherUser);
      }
    } catch (err) {
      console.error("Error loading match data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !user?.uid || !matchId || !otherUser) return;

    const textToSend = messageText.trim();
    setMessageText("");

    try {
      setSending(true);
      await sendMessage(matchId, user.uid, otherUser.uid, textToSend);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessageText(textToSend);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleProfilePress = () => {
    if (otherUser) {
      router.push(`/profile/${otherUser.uid}` as any);
    }
  };

  if (loading) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
        </View>
      </Surface>
    );
  }

  if (!otherUser) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <Text variant="headlineSmall">Match not found</Text>
        </View>
      </Surface>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: otherUser.profile.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleProfilePress}>
              {otherUser.profile.photos &&
              otherUser.profile.photos.length > 0 ? (
                <Avatar.Image
                  size={36}
                  source={{ uri: otherUser.profile.photos[0] }}
                />
              ) : (
                <Avatar.Icon
                  size={36}
                  icon="account"
                  style={{
                    backgroundColor: theme.colors.surfaceVariant,
                  }}
                />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text
                variant="headlineSmall"
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                Say hi to {otherUser.profile.name}!
              </Text>
              <Text
                variant="bodyLarge"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: "center",
                }}
              >
                Start the conversation
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatBubble
                  message={item.text}
                  timestamp={formatTimestamp(item.timestamp)}
                  isSent={item.senderId === user?.uid}
                  isRead={item.read}
                />
              )}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
          )}

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                mode="outlined"
                placeholder="Message..."
                value={messageText}
                onChangeText={setMessageText}
                style={styles.input}
                multiline
                maxLength={500}
                onSubmitEditing={handleSend}
                disabled={sending}
                outlineStyle={styles.inputOutline}
              />
              <IconButton
                icon="send"
                size={24}
                mode="contained"
                containerColor={
                  messageText.trim() && !sending
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant
                }
                iconColor={
                  messageText.trim() && !sending
                    ? theme.colors.onPrimary
                    : theme.colors.onSurfaceVariant
                }
                onPress={handleSend}
                disabled={!messageText.trim() || sending}
                style={styles.sendButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  messagesList: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "transparent",
  },
  inputOutline: {
    borderRadius: 24,
  },
  sendButton: {
    margin: 0,
  },
});
