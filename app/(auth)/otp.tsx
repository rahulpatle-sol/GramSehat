import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/store/AuthContext';
import i18n from '../../src/i18n';

export default function OtpScreen(): ReactElement {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number): void => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number): void => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpValue: string): Promise<void> => {
    if (otpValue.length !== 6 || !phone) return;
    setLoading(true);
    try {
      await login(phone, otpValue);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert(i18n.t('error'), message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
          <Text style={styles.title}>{i18n.t('verifyOtp')}</Text>
          <Text style={styles.subtitle}>{i18n.t('weSentOtp')}</Text>
          <Text style={styles.phoneDisplay}>📱 +91 {phone}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}

          <TouchableOpacity
            style={[styles.verifyButton, (loading || otp.join('').length !== 6) && styles.buttonDisabled]}
            onPress={() => verifyOtp(otp.join(''))}
            disabled={loading || otp.join('').length !== 6}
          >
            <Text style={styles.verifyButtonText}>{i18n.t('verifyOtp')}</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>{i18n.t('didNotReceive')} </Text>
            {resendTimer > 0 ? (
              <Text style={styles.timerText}>00:{resendTimer.toString().padStart(2, '0')}</Text>
            ) : (
              <TouchableOpacity onPress={() => setResendTimer(30)}>
                <Text style={styles.resendLink}>{i18n.t('resend')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  header: { marginBottom: 24 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 28, color: '#333', fontWeight: '300' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 8 },
  phoneDisplay: { fontSize: 16, color: '#333', fontWeight: '600', marginBottom: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 },
  otpInput: { width: 48, height: 56, borderWidth: 2, borderColor: '#4CAF50', borderRadius: 12, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333', backgroundColor: '#f8f8f8' },
  loader: { marginBottom: 16 },
  verifyButton: { backgroundColor: '#4CAF50', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 48, alignItems: 'center', marginBottom: 24 },
  buttonDisabled: { opacity: 0.7 },
  verifyButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  resendContainer: { flexDirection: 'row', alignItems: 'center' },
  resendText: { fontSize: 14, color: '#666' },
  timerText: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  resendLink: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
});