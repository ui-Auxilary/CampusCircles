import UserProvider from "@/hooks/userContext";
import { Stack } from "expo-router/stack";
import Header from "../components/Header";
import React from "react";

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            header: () => <Header title='Home' />,
          }}
        />
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
            header: () => <Header title='Create Profile' />,
          }}
        />
        <Stack.Screen
          name='edit'
          options={({ route }) => ({
            header: () => <Header title={`Edit ${route.params?.type}`} />,
          })}
        />
        <Stack.Screen
          name='edit-profile'
          options={{
            header: () => <Header title='Edit Profile' />,
          }}
        />
        <Stack.Screen
          name='settings'
          options={{
            header: () => <Header title='Settings' />,
          }}
        />
        <Stack.Screen
          name='setting-route'
          options={({ route }) => ({
            header: () => {
              const title = route.params?.page
                ? `${route.params.page
                    .charAt(0)
                    .toUpperCase()}${route.params.page.slice(1)}`
                : "Settings";
              return <Header title={title} />;
            },
          })}
        />
        <Stack.Screen
          name='event-details'
          options={{
            header: () => <Header title='Event Details' />,
          }}
        />
        <Stack.Screen
          name='wizard'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='event-invite'
          options={{
            header: () => <Header title='Invite Friends' />,
          }}
        />
        <Stack.Screen
          name='event-edit'
          options={{
            header: () => <Header title='Edit Event' />,
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

