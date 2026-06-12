import React, { useState, ReactElement } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Animated, { FadeInDown, FadeInUp, BounceIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/store/AuthContext';
import i18n from '../../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInScreen(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const { googleSignIn, continueAsGuest } = useAuth();
  const router = useRouter();

  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      scopes: ['profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ scheme: 'gramsehat' }),
    },
    discovery
  );

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;
        if (id_token) {
          const authResponse = await googleSignIn(id_token);
          if (authResponse.user.isProfileComplete) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/profile-setup');
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google Sign-In failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = async (): Promise<void> => {
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.content}>
        <Animated.View entering={BounceIn.duration(800).springify()} style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>GS</Text>
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
          GramSehat
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.subtitle}>
          {i18n.t('tagline')}
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.cardDesc}>Sign in to save your health data or continue as guest</Text>

          <TouchableOpacity
            style={[styles.googleBtn, loading && styles.disabled]}
            onPress={handleGoogleSignIn}
            disabled={loading || !request}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text} />
            ) : (
              <>
                <Ionicons name="logo-google" size={22} color="#DB4437" />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuestMode}>
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xxl },
  logoWrap: { marginBottom: Spacing.lg },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    ...Shadow.lg,
  },
  logoText: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: Spacing.sm },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 48 },
  card: {
    backgroundColor: '#fff', borderRadius: Radius.xl,
    padding: Spacing.xxl, width: '100%', alignItems: 'center',
    ...Shadow.xl,
  },
  cardTitle: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.sm },
  cardDesc: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxl },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.md, width: '100%',
    paddingVertical: Spacing.lg, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  disabled: { opacity: 0.7 },
  googleBtnText: { ...Typography.bodyBold, color: Colors.text, fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: Spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: Spacing.md, color: Colors.textTertiary, fontSize: 14 },
  guestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, width: '100%',
    paddingVertical: Spacing.md,
  },
  guestBtnText: { ...Typography.captionBold, color: Colors.textSecondary, fontSize: 15 },
  disclaimer: { fontSize: 12, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.xl },
});
