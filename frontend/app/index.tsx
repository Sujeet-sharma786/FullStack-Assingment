import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const login = useAuthStore(state => state.login);
  const router = useRouter();

  const handleLogin = () => {
    if (email && name) {
      login({ email, name });
      router.replace('/(tabs)/events');
    } else {
      Alert.alert('Please enter both name and email');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>Login</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 6, backgroundColor: '#fff' }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 24, padding: 8, borderRadius: 6, backgroundColor: '#fff' }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}