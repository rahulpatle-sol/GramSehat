import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, BounceIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/store/AuthContext';
import i18n from '../../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';

export default function OtpScreen(): ReactElement {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const verifying = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number): void => {
    if (verifying.current || loading) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    const code = otp.join('');
    if (code.length === 6 && !verifying.current && !loading) {
      const delay = setTimeout(() => verifyOtp(code), 300);
      return () => clearTimeout(delay);
    }
  }, [otp]);

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number): void => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpValue: string): Promise<void> => {
    if (loading || verifying.current) return;
    verifying.current = true;
    setLoading(true);
    try {
      await login(phone, otpValue);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert(i18n.t('error'), message);
      setOtp(['', '', '', '', '', '']);
      verifying.current = false;
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
      verifying.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Animated.Text entering={BounceIn.delay(100).springify()} style={styles.title}>{i18n.t('verifyOtp')}</Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.subtitle}>{i18n.t('weSentOtp')}</Animated.Text>
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.phoneDisplay}>
          <Ionicons name="phone-portrait-outline" size={18} color={Colors.text} />
          <Text style={styles.phoneText}> +91 {phone}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </Animated.View>

        {loading && <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />}

        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.verifyWrap}>
          <TouchableOpacity
            style={[styles.verifyButton, (loading || otp.join('').length !== 6) && styles.buttonDisabled]}
            onPress={() => verifyOtp(otp.join(''))}
            disabled={loading || otp.join('').length !== 6}
          >
            <View style={styles.verifyButtonContent}>
              <Text style={styles.verifyButtonText}>{i18n.t('verifyOtp')}</Text>
              <Ionicons name="checkmark-circle" size={20} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.resendContainer}>
          <Text style={styles.resendText}>{i18n.t('didNotReceive')} </Text>
          {resendTimer > 0 ? (
            <Text style={styles.timerText}>00:{resendTimer.toString().padStart(2, '0')}</Text>
          ) : (
            <TouchableOpacity onPress={() => { setResendTimer(30); setOtp(['', '', '', '', '', '']); }}>
              <Text style={styles.resendLink}>{i18n.t('resend')}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface, paddingHorizontal: Spacing.xxl },
  header: { paddingTop: 16, marginBottom: Spacing.xxl },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.md },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.sm },
  phoneDisplay: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xxxl },
  phoneText: { fontSize: 16, color: Colors.text, fontWeight: '600' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: Spacing.xxxl },
  otpInput: { width: 48, height: 56, borderWidth: 2, borderColor: Colors.border, borderRadius: Radius.md, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: Colors.text, backgroundColor: Colors.background },
  otpInputFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  loader: { marginBottom: Spacing.lg },
  verifyWrap: { width: '100%', marginBottom: Spacing.xxl },
  verifyButton: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: Spacing.lg, paddingHorizontal: 48, alignItems: 'center', width: '100%', ...Shadow.md },
  buttonDisabled: { opacity: 0.7 },
  verifyButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  verifyButtonText: { color: Colors.textInverse, fontSize: 18, fontWeight: '600' },
  resendContainer: { flexDirection: 'row', alignItems: 'center' },
  resendText: { fontSize: 14, color: Colors.textSecondary },
  timerText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  resendLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});
