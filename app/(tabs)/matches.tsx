import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Surface, useTheme, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { ExternalPathString, useRouter } from "expo-router";
import { MatchCard } from "../../components/match-card";
import { getMatches, getRecentMatches, Match } from "../../services/matches";

export default function MatchesScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMatches = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);

      const [recent, all] = await Promise.all([
        getRecentMatches(user.uid),
        getMatches(user.uid),
      ]);

      setRecentMatches(recent);
      // Filter out recent matches from all matches
      const recentIds = new Set(recent.map((m) => m.id));
      setAllMatches(all.filter((m) => !recentIds.has(m.id)));
    } catch (err) {
      console.error("Error loading matches:", err);
      setError("Failed to load matches. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const formatMatchTime = (timestamp: any): string => {
    const now = new Date();
    const matchDate = timestamp.toDate();
    const diffMs = now.getTime() - matchDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? "Just now" : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return matchDate.toLocaleDateString();
    }
  };

  const handleMatchPress = (matchId: string) => {
    router.push(`/chat/${matchId}` as ExternalPathString);
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
            Loading matches...
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

  if (recentMatches.length === 0 && allMatches.length === 0) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <Text
            variant="headlineSmall"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            No matches yet
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            Keep swiping to find your match!
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={[...recentMatches, ...allMatches]}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isFirstOfAllMatches = index === recentMatches.length;
          const showNewHeader = index === 0 && recentMatches.length > 0;
          const showAllHeader = isFirstOfAllMatches && allMatches.length > 0;

          return (
            <View style={{ flex: 1 / 2 }}>
              {showNewHeader && (
                <View style={styles.sectionHeader}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    New Matches
                  </Text>
                </View>
              )}
              {showAllHeader && (
                <View style={styles.sectionHeader}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    All Matches
                  </Text>
                </View>
              )}
              {item.otherUser && (
                <MatchCard
                  user={item.otherUser}
                  matchTime={formatMatchTime(item.createdAt)}
                  onPress={() => handleMatchPress(item.id)}
                />
              )}
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
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
  listContent: {
    paddingVertical: 8,
  },
  sectionHeader: {
    width: "200%",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontWeight: "600",
  },
});
