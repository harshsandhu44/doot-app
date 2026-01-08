import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl, TextInput, Dimensions } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { ExternalPathString, useRouter } from "expo-router";
import { MatchCard } from "../../components/match-card";
import { EmptyState } from "../../components/empty-state";
import { getMatches, getRecentMatches, Match } from "../../services/matches";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MatchesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMatches = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      const [recent, all] = await Promise.all([
        getRecentMatches(user.uid),
        getMatches(user.uid),
      ]);

      setRecentMatches(recent);
      const recentIds = new Set(recent.map((m) => m.id));
      const filteredAll = all.filter((m) => !recentIds.has(m.id));
      setAllMatches(filteredAll);
      setFilteredMatches([...recent, ...filteredAll]);
    } catch (err) {
      console.error("Error loading matches:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    const combined = [...recentMatches, ...allMatches];
    if (searchQuery.trim() === "") {
      setFilteredMatches(combined);
    } else {
      const filtered = combined.filter((m) => 
        m.otherUser?.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMatches(filtered);
    }
  }, [searchQuery, recentMatches, allMatches]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const formatMatchTime = (timestamp: any): string => {
    if (!timestamp) return "Recently";
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

  if (loading && !refreshing) {
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
            placeholder="Search matches"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      <FlatList
        data={filteredMatches}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isFirstOfAllMatches = index === recentMatches.length;
          const showNewHeader = index === 0 && recentMatches.length > 0 && searchQuery === "";
          const showAllHeader = isFirstOfAllMatches && allMatches.length > 0 && searchQuery === "";

          return (
            <View style={styles.matchWrapper}>
              {showNewHeader && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>New Matches ({recentMatches.length})</Text>
                </View>
              )}
              {showAllHeader && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>All Matches</Text>
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
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="heart-dislike-outline"
              title={searchQuery ? "No matches found" : "No matches yet"}
              description={searchQuery ? "Try searching for someone else" : "Keep swiping to find your match!"}
            />
          ) : null
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  matchWrapper: {
    flex: 1/2,
    alignItems: "center",
  },
  sectionHeader: {
    width: SCREEN_WIDTH - SPACING.md * 2,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "bold",
  },
});
