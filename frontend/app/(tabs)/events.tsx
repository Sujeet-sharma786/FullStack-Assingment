import EventListScreen from '../events/index';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function EventsTab() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/')}>
              <Ionicons name="arrow-back" size={28} color="#22223b" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          ),
          headerTitle: 'Upcoming Events',
        }}
      />
      <EventListScreen />
    </>
  );
}