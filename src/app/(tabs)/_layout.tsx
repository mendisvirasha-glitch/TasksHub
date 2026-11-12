import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={24}
              color={typeof color === 'string' ? color : '#64748b'}
            />
          ),
        }}
      />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={typeof color === 'string' ? color : '#64748b'}
            />
          ),
        }}
      />
    </Tabs>
  );
}