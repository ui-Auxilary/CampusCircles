import UserProvider from "@/hooks/userContext";
import { Stack } from "expo-router/stack";

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
          name='edit-profile'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='settings'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='setting-route'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='event-details'
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
