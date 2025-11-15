import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card, Chip, List, Divider } from "react-native-paper";
import { router } from "expo-router";

export default function DetailsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Details Screen
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            This screen demonstrates navigation with Expo Router and showcases
            more React Native Paper components.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.subtitle}>
            Component Examples
          </Text>

          <View style={styles.chipContainer}>
            <Chip icon="star" style={styles.chip}>
              Featured
            </Chip>
            <Chip icon="check" style={styles.chip}>
              Active
            </Chip>
            <Chip icon="heart" style={styles.chip}>
              Favorite
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <List.Section>
            <List.Subheader>List Items</List.Subheader>
            <List.Item
              title="First Item"
              description="This is a list item with an icon"
              left={(props) => <List.Icon {...props} icon="folder" />}
            />
            <List.Item
              title="Second Item"
              description="Another list item example"
              left={(props) => <List.Icon {...props} icon="file" />}
            />
            <List.Item
              title="Third Item"
              description="One more for good measure"
              left={(props) => <List.Icon {...props} icon="cog" />}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.subtitle}>
            Navigation
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Use the button below or the back button in the header to return to
            the home screen.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={() => router.back()}>
            Go Back
          </Button>
          <Button mode="contained" onPress={() => router.push("/")}>
            Go Home
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
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
    marginBottom: 12,
    lineHeight: 20,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
});
