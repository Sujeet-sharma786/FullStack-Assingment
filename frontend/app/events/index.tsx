import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../../api/graphql';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EventListScreen() {
  const { data, isLoading, error } = useQuery({ queryKey: ['events'], queryFn: getEvents });
  const router = useRouter();

  if (isLoading) return (
    <View style={styles.centered}>
      <Text style={styles.loadingText}>Loading events...</Text>
    </View>
  );
  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Error loading events.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={data || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>
                {new Date(item.startTime).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.attendeeCount}>
              {item.attendees.length} Attendee{item.attendees.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f8fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backIcon: {
    marginRight: 8,
    padding: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#22223b',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3a5a40',
  },
  eventDate: {
    fontSize: 14,
    color: '#4a4e69',
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 16,
    color: '#22223b',
    marginBottom: 6,
  },
  attendeeCount: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#4a4e69',
  },
  errorText: {
    fontSize: 18,
    color: '#c1121f',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#adb5bd',
    fontSize: 16,
  },
});