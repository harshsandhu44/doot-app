import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ActivityIndicator, Text } from "react-native-paper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
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
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";

export default function ChatScreen() {
  const { user } = useAuth();
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

    const unsubscribe = subscribeToMessages(matchId, (newMessages) => {
      setMessages(newMessages);
      markMessagesAsRead(matchId, user.uid);
    });

    return () => unsubscribe();
  }, [matchId, user?.uid]);

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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderDateSeparator = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (isToday) label = "Today";
    if (isYesterday) label = "Yesterday";

    return (
      <View style={styles.dateSeparator}>
        <Text style={styles.dateSeparatorText}>{label}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!otherUser) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <TouchableOpacity 
                style={styles.headerProfile}
                onPress={() => router.push(`/profile/${otherUser.uid}` as any)}
              >
                <Image
                  source={{ uri: otherUser.profile.photos?.[0] || 'https://via.placeholder.com/150' }}
                  style={styles.headerAvatar}
                />
                <Text style={styles.headerName}>{otherUser.profile.name}</Text>
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerMenu}>
              <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const showDateSeparator = index === 0 || 
              (messages[index-1].timestamp?.toDate().toDateString() !== item.timestamp?.toDate().toDateString());
            
            return (
              <View>
                {showDateSeparator && item.timestamp && renderDateSeparator(item.timestamp.toDate())}
                <ChatBubble
                  message={item.text}
                  timestamp={formatTimestamp(item.timestamp)}
                  isSent={item.senderId === user?.uid}
                  isRead={item.read}
                />
              </View>
            );
          }}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.plusButton}>
            <Ionicons name="add" size={28} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            style={styles.input}
            multiline
            placeholderTextColor={COLORS.textSecondary}
          />

          <TouchableOpacity 
            onPress={handleSend}
            disabled={!messageText.trim() || sending}
            style={[
              styles.sendButton,
              { backgroundColor: messageText.trim() ? COLORS.primary : COLORS.border }
            ]}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={messageText.trim() ? COLORS.white : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerName: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
  },
  headerMenu: {
    marginRight: SPACING.sm,
  },
  messagesList: {
    paddingVertical: SPACING.md,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dateSeparatorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.small,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  plusButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    maxHeight: 100,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});