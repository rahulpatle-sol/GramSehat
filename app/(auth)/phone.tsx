import React, { useState, ReactElement } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/store/AuthContext';
import i18n from '../../src/i18n';

export default function PhoneScreen(): ReactElement {
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { sendOtp } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSendOtp = async (): Promise<void> => {
    if (!phone || phone.length < 10) {
      Alert.alert(i18n.t('error'), 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await sendOtp(phone);
      if (result?.otp) {
        Alert.alert('🔔 OTP', `Your OTP is: ${result.otp}`, [
          {
            text: 'Continue',
            onPress: () => router.push({ pathname: '/(auth)/otp', params: { phone } }),
          },
        ]);
      } else {
        router.push({ pathname: '/(auth)/otp', params: { phone } });
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
          <Text style={styles.label}>{i18n.t('phoneNumber')}</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder={i18n.t('enterPhone')}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
              autoComplete="tel"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{i18n.t('sendOtp')}</Text>
            )}
          </TouchableOpacity>
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
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginBottom: 24, overflow: 'hidden' },
  countryCode: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#f5f5f5', fontSize: 16, color: '#333', borderRightWidth: 1, borderRightColor: '#ddd' },
  phoneInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#4CAF50', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});