import { Tabs } from 'expo-router';

/**
 * Tab navigator layout
 * Provides bottom tab navigation for main app screens
 */
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
