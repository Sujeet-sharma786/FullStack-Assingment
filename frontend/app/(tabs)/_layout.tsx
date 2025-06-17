import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Back',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-back" size={size} color={color} />
          ),
          // Hide the header for this tab
          headerShown: false,
          // Hide the tab label if you want only the icon
          // tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to login page
            router.replace('/');
          },
        }}
      />
    </Tabs>
  );
}