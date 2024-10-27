import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
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
    </Stack>
  );
}
