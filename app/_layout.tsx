import React, { useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SplashScreen(): ReactElement {
  return (
    <View style={styles.splashContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>GS</Text>
        </View>
        <Text style={styles.appName}>GramSehat</Text>
        <Text style={styles.tagline}>Swasth Gaon, Swasth Desh</Text>
      </View>
      <ActivityIndicator size="large" color="white" style={styles.loader} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function RootNavigator(): ReactElement {
  const { user, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = React.useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async (): Promise<void> => {
    try {
      const completed = await AsyncStorage.getItem('onboardingComplete');
      setOnboardingComplete(completed === 'true');
    } catch (error) {
      setOnboardingComplete(true);
    }
  };

  if (loading || onboardingComplete === null) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!onboardingComplete && <Stack.Screen name="onboarding" />}
      {!user?.name ? (
        <>
          <Stack.Screen name="(auth)/phone" />
          <Stack.Screen name="(auth)/otp" />
          <Stack.Screen name="(auth)/profile-setup" />
        </>
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout(): ReactElement {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  loader: {
    marginTop: 60,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    fontSize: 14,
  },
});