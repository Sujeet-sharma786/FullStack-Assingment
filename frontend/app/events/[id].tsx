import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventById, joinEvent } from '../../api/graphql';
import { useSocket } from '../../api/socket';
import { useAuthStore } from '../../store/auth';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: () => joinEvent(id, user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event', id] }),
  });

  useSocket(id, () => {
    queryClient.invalidateQueries({ queryKey: ['event', id] });
  });

  if (isLoading) return (
    <View style={styles.centered}>
      <Text style={styles.loadingText}>Loading event...</Text>
    </View>
  );
  if (!data) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Event not found.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{data.name}</Text>
      <Text style={styles.eventLocation}>{data.location}</Text>
      <Text style={styles.eventDate}>
        {new Date(data.startTime).toLocaleString()}
      </Text>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => mutation.mutate()}
        activeOpacity={0.85}
      >
        <Text style={styles.joinButtonText}>Join Event</Text>
      </TouchableOpacity>
      <Text style={styles.attendeesHeader}>
        Attendees ({data.attendees.length})
      </Text>
      <FlatList
        data={data.attendees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name ? item.name[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.attendeeName}>{item.name}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No attendees yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f8fa',
    marginTop: 40, // <-- Add this line to push content down
  },
  eventName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 6,
    textAlign: 'center',
  },
  eventLocation: {
    fontSize: 18,
    color: '#3a5a40',
    marginBottom: 2,
    textAlign: 'center',
  },
  eventDate: {
    fontSize: 15,
    color: '#4a4e69',
    marginBottom: 18,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#3a5a40',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 22,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    elevation: 2,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  attendeesHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
    color: '#22223b',
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#22223b',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#b7e4c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#22223b',
    fontWeight: 'bold',
    fontSize: 18,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#22223b',
  },
  attendeeEmail: {
    fontSize: 13,
    color: '#4a4e69',
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