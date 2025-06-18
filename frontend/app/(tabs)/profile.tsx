import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);

  return (
    <View style={styles.container}>
      {/* Custom Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#22223b" />
        </TouchableOpacity>
        <Text style={styles.heading}>Profile</Text>
        <View style={{ width: 24 }} /> {/* To balance layout */}
      </View>

      {/* Profile Content */}
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f8fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 12,
    color: '#3a5a40',
  },
  value: {
    fontSize: 16,
    color: '#22223b',
  },
});
