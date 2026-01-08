import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, TextInput } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { MessagePreview } from "../../components/message-preview";
import { EmptyState } from "../../components/empty-state";
import { getMatches, Match } from "../../services/matches";
import { getConversations, Conversation } from "../../services/messages";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface ConversationWithMatch extends Conversation {
  match: Match;
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationWithMatch[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadConversations = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      const matches = await getMatches(user.uid);
      const matchIds = matches.map((m) => m.id);
      const conversationData = await getConversations(user.uid, matchIds);

      const combined: ConversationWithMatch[] = conversationData.map((conv) => {
        const match = matches.find((m) => m.id === conv.matchId)!;
        return { ...conv, match };
      });

      setConversations(combined);
      setFilteredConversations(combined);
    } catch (err) {
      console.error("Error loading conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conv) =>
        conv.match.otherUser?.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "";
    const now = new Date();
    const messageDate = timestamp.toDate();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? "Now" : `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const handleConversationPress = (matchId: string) => {
    router.push(`/chat/${matchId}` as any);
  };

  if (loading && conversations.length === 0) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search messages"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.matchId}
        renderItem={({ item }) => {
          if (!item.match.otherUser) return null;
          return (
            <MessagePreview
              user={item.match.otherUser}
              lastMessage={item.lastMessage?.text}
              timestamp={formatTimestamp(item.lastMessage?.timestamp)}
              unreadCount={item.unreadCount}
              isSentByMe={item.lastMessage?.senderId === user?.uid}
              onPress={() => handleConversationPress(item.matchId)}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-outline"
            title={searchQuery ? "No messages found" : "No conversations yet"}
            description={searchQuery ? "Try searching for someone else" : "Start chatting with your matches!"}
          />
        }
      />
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
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
    opacity: 0.5,
  },
});
