import React, { useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, BounceIn, FadeIn } from 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Radius, Shadow } from '../constants/theme';

function SplashScreen(): ReactElement {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../assets/images/splash-background.png')}
        style={styles.splashBg}
        resizeMode="cover"
      />
      <View style={styles.splashOverlay}>
        <Animated.View entering={BounceIn.duration(1000).springify()} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>GS</Text>
          </View>
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text style={styles.appName}>GramSehat</Text>
            <Text style={styles.tagline}>Swasth Gaon, Swasth Desh</Text>
          </Animated.View>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(800)}>
          <ActivityIndicator size="large" color="white" style={styles.loader} />
        </Animated.View>
      </View>
    </View>
  );
}

function RootNavigator(): ReactElement {
  const { user, loading, isGuest } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = React.useState<boolean | null>(null);

  useEffect(() => { checkOnboarding(); }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboardingComplete');
      setOnboardingComplete(completed === 'true');
    } catch { setOnboardingComplete(true); }
  };

  if (loading || onboardingComplete === null) return <SplashScreen />;

  if (isGuest || user) {
    return (
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/phone" options={{ presentation: 'modal' }} />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)/phone" />
      <Stack.Screen name="(auth)/profile-setup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout(): ReactElement {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1 },
  splashBg: { position: 'absolute', width: '100%', height: '100%' },
  splashOverlay: {
    flex: 1, backgroundColor: 'rgba(46,125,50,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  logoContainer: { alignItems: 'center' },
  logoCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, ...Shadow.xl,
  },
  logoText: { fontSize: 48, fontWeight: 'bold', color: Colors.primary },
  appName: { fontSize: 36, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  loader: { marginTop: 60 },
});
