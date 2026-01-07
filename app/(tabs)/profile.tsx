import { View, StyleSheet } from "react-native";
import {
  Text,
  Surface,
  Button,
  Card,
  useTheme,
  Dialog,
  Portal,
} from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      hideDialog();
      router.replace("/(auth)/login");
    } catch {
      hideDialog();
    }
  };

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Profile
        </Text>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Email:
              </Text>
              <Text variant="bodyLarge">{user?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                User ID:
              </Text>
              <Text variant="bodyMedium">{user?.uid}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Email Verified:
              </Text>
              <Text variant="bodyMedium">
                {user?.emailVerified ? "Yes" : "No"}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={showDialog}
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleSignOut} textColor={theme.colors.error}>
              Sign Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
  },
  cardContent: {
    gap: 16,
  },
  infoRow: {
    gap: 8,
  },
  signOutButton: {
    marginTop: 16,
  },
});
