import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card, FAB } from "react-native-paper";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome to Doot! 🎉
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              This app is set up with Expo Router for navigation and React
              Native Paper for Material Design 3 UI components.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.subtitle}>
              Features Enabled
            </Text>
            <Text variant="bodyMedium" style={styles.feature}>
              ✓ File-based routing with Expo Router
            </Text>
            <Text variant="bodyMedium" style={styles.feature}>
              ✓ Material Design 3 (MD3) theme
            </Text>
            <Text variant="bodyMedium" style={styles.feature}>
              ✓ TypeScript typed routes
            </Text>
            <Text variant="bodyMedium" style={styles.feature}>
              ✓ Safe area context
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.subtitle}>
              Try Navigation
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Click the button below to navigate to the details screen and see
              Expo Router in action.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => router.push("/details")}
              style={styles.button}
            >
              Go to Details
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log("FAB pressed")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  description: {
    marginBottom: 8,
    lineHeight: 20,
  },
  feature: {
    marginVertical: 4,
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
