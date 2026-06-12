import React, { useState, ReactElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import i18n from '../../src/i18n';
import { useAuth } from '../../src/store/AuthContext';

const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_IOS_CLIENT_ID = Constants.expoConfig?.extra?.googleIosClientId || 'YOUR_IOS_CLIENT_ID';

export default function LoginScreen(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  const handleGoogleSignIn = async (): Promise<void> => {
    if (!request) {
      Alert.alert(i18n.t('error'), 'Google Sign-In not available');
      return;
    }
    setLoading(true);
    try {
      const result = await promptAsync();
      if (result?.type === 'success' && result.params?.id_token) {
        await login(result.params.id_token);
        router.replace('/(tabs)');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert(i18n.t('error'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>GS</Text>
          </View>
          <Text style={styles.title}>GramSehat</Text>
          <Text style={styles.subtitle}>{i18n.t('tagline')}</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4CAF50' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50' },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  form: { backgroundColor: 'white', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 12, paddingVertical: 16, borderWidth: 1, borderColor: '#ddd', gap: 12 },
  buttonDisabled: { opacity: 0.7 },
  googleIcon: { fontSize: 20, fontWeight: 'bold', color: '#4285F4' },
  googleButtonText: { fontSize: 18, fontWeight: '600', color: '#333' },
  disclaimer: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 16 },
});
