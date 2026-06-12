import React, { ReactElement } from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout(): ReactElement {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="phone" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
