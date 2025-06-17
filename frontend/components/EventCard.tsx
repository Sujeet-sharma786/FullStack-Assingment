import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type Event = {
  id: string;
  name: string;
  location: string;
  startTime: string;
};

export default function EventCard({
  event,
  onPress,
}: {
  event: Event;
  onPress: () => void;
}) {
  console.log('startTime:', event.startTime); // In EventCard

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#e0e7ff',
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '500' }}>{event.name}</Text>
      <Text style={{ color: '#555', marginTop: 4 }}>{event.location}</Text>
      <Text style={{ color: '#888', marginTop: 2 }}>
        {new Date(event.startTime).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}