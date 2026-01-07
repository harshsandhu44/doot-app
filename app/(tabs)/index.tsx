import { View, StyleSheet } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>Welcome!</Text>
        <Text variant="bodyLarge" style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
          You are now signed in
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
          {user?.email}
        </Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
  },
});
