import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EventsProvider } from '../context/EventsContext';
import AppStateBanner from '../components/AppStateBanner';

export default function RootLayout() {
  return (
    <EventsProvider>
      <StatusBar style="dark" />
      <AppStateBanner />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#0F172A',
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        {/* Main Tab Navigator */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {/* Nested Stack Screen: Event Details */}
        <Stack.Screen
          name="event/[id]"
          options={{
            title: 'Event Details',
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />

        {/* 404 Not Found fallback */}
        <Stack.Screen
          name="+not-found"
          options={{
            title: 'Page Not Found',
          }}
        />
      </Stack>
    </EventsProvider>
  );
}
