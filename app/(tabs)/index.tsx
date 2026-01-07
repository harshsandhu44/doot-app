import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/auth-context";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.text}>You are now signed in</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  text: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  email: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
