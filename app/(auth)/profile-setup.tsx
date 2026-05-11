import React, { useState, ReactElement } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/store/AuthContext';
import i18n from '../../src/i18n';

export default function ProfileSetupScreen(): ReactElement {
  const [name, setName] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { updateUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) {
      Alert.alert(i18n.t('error'), 'Please enter your name');
      return;
    }
    if (!pincode || pincode.length !== 6) {
      Alert.alert(i18n.t('error'), 'Please enter a valid 6-digit pincode');
      return;
    }
    if (!village.trim()) {
      Alert.alert(i18n.t('error'), 'Please enter your village name');
      return;
    }

    setLoading(true);
    try {
      await updateUser({ name, pincode, village });
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert(i18n.t('error'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('profileSetup')}</Text>
            <Text style={styles.subtitle}>Tell us about yourself</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('enterName')}
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('enterPincode')}</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={pincode}
                onChangeText={setPincode}
                maxLength={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('enterVillage')}</Text>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('enterVillage')}
                placeholderTextColor="#999"
                value={village}
                onChangeText={setVillage}
                autoCapitalize="words"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{i18n.t('save')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  header: { marginTop: 40, marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#333', backgroundColor: '#fafafa' },
  button: { backgroundColor: '#4CAF50', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});