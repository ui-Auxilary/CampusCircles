import UserProvider from '@/hooks/userContext';
import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name='index' />
        <Stack.Screen
          name='login'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='register'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='create-profile'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='edit'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
}
