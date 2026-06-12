import React, { useState, ReactElement } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView, StatusBar, Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, BounceIn, SlideInRight } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { locationApi } from '../../src/api/location';
import { useAuth } from '../../src/store/AuthContext';
import i18n from '../../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';

export default function ProfileSetupScreen(): ReactElement {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState<string>(user?.name || '');
  const [pincode, setPincode] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(user?.avatar || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [detectingLocation, setDetectingLocation] = useState<boolean>(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const detectLocation = async (): Promise<void> => {
    try {
      setDetectingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required to auto-detect your village');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const result = await locationApi.reverseGeocode(
        loc.coords.latitude,
        loc.coords.longitude
      );
      if (result) {
        if (result.pincode) setPincode(result.pincode);
        if (result.village) setVillage(result.village);
        if (result.district) setDistrict(result.district);
        if (result.state) setState(result.state);
      }
    } catch (error) {
      console.error('Location detection error:', error);
      Alert.alert('Error', 'Could not detect your location. Please enter details manually.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const pickImage = (): void => {
    Alert.alert('Profile Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Gallery permission is required');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

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
      await updateUser({ name, pincode, village, district, state });
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert(i18n.t('error'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Animated.View entering={BounceIn.duration(600).springify()}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarCircle}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person-outline" size={36} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </Animated.View>
            <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>{i18n.t('profileSetup')}</Animated.Text>
            <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.subtitle}>Setup your profile to get started</Animated.Text>
          </View>

          <Animated.View entering={SlideInRight.delay(400).springify()} style={styles.form}>
            <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.inputGroup}>
              <Text style={styles.label}>Your Name *</Text>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('enterName')}
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(360).springify()}>
              <TouchableOpacity
                style={[styles.detectBtn, detectingLocation && styles.disabled]}
                onPress={detectLocation}
                disabled={detectingLocation}
              >
                {detectingLocation ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Ionicons name="location-outline" size={20} color={Colors.primary} />
                )}
                <Text style={styles.detectBtnText}>
                  {detectingLocation ? 'Detecting...' : 'Auto-detect my location'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('enterPincode')} *</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                value={pincode}
                onChangeText={setPincode}
                maxLength={6}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('enterVillage')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('enterVillage')}
                placeholderTextColor={Colors.textTertiary}
                value={village}
                onChangeText={setVillage}
                autoCapitalize="words"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600).springify()}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textInverse} />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{i18n.t('save')}</Text>
                    <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, padding: Spacing.xxl },
  headerSection: { alignItems: 'center', marginTop: 20, marginBottom: 32 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.lg, ...Shadow.md, borderWidth: 2, borderColor: Colors.border,
    overflow: 'hidden',
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { ...Typography.captionBold, color: Colors.text },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, paddingVertical: 14, fontSize: 16, color: Colors.text, backgroundColor: Colors.background },
  button: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: 24, ...Shadow.md },
  buttonDisabled: { opacity: 0.7 },
  detectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.primary,
    borderRadius: Radius.lg, borderStyle: 'dashed',
    backgroundColor: Colors.primaryLight + '20',
  },
  detectBtnText: { ...Typography.captionBold, color: Colors.primary },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  buttonText: { color: Colors.textInverse, fontSize: 18, fontWeight: '600' },
});
