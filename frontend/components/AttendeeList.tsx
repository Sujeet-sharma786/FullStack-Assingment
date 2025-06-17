import React from 'react';
import { View, Text } from 'react-native';

export default function AttendeeList({ attendees }) {
  return (
    <View>
      {attendees.map(a => (
        <Text key={a.id} style={{ padding: 6 }}>
          {a.name} ({a.email})
        </Text>
      ))}
    </View>
  );
}