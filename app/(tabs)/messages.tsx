import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  Surface,
  useTheme,
  ActivityIndicator,
  Searchbar,
  Divider,
} from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { MessagePreview } from "../../components/message-preview";
import { getMatches, Match } from "../../services/matches";
import { getConversations, Conversation } from "../../services/messages";

interface ConversationWithMatch extends Conversation {
  match: Match;
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationWithMatch[]>(
    [],
  );
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationWithMatch[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conv) =>
        conv.match.otherUser?.profile.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);

      // Get all matches
      const matches = await getMatches(user.uid);
      const matchIds = matches.map((m) => m.id);

      // Get conversation data for each match
      const conversationData = await getConversations(user.uid, matchIds);

      // Combine match data with conversation data
      const combined: ConversationWithMatch[] = conversationData.map((conv) => {
        const match = matches.find((m) => m.id === conv.matchId)!;
        return {
          ...conv,
          match,
        };
      });

      setConversations(combined);
      setFilteredConversations(combined);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text
            variant="bodyLarge"
            style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}
          >
            Loading conversations...
          </Text>
        </View>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.error, marginBottom: 16 }}
          >
            {error}
          </Text>
        </View>
      </Surface>
    );
  }

  if (conversations.length === 0) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <Text
            variant="headlineSmall"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            No conversations yet
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            Start chatting with your matches!
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search conversations"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
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
              onPress={() => handleConversationPress(item.matchId)}
            />
          );
        }}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContent}
      />
    </Surface>
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
  searchContainer: {
    padding: 12,
  },
  searchBar: {
    elevation: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
});
