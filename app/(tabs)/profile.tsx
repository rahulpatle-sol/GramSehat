import React, { ReactElement, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Alert, Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown, FadeInUp, SlideInRight, BounceIn, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '../../src/store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import {
  AnimatedPressable, FadeInSection, SlideInSection, StaggerItem,
} from '../../components/animated';
import { LogoutModal } from '../../components/LogoutModal';

const LANGUAGES = [
  { code: 'hi' as const, label: '\u0939\u093f\u0928\u094d\u0926\u0940', name: 'Hindi' },
  { code: 'en' as const, label: 'English', name: 'English' },
];

const MENU_ITEMS = [
  { icon: (color: string) => <Ionicons name="people-outline" size={24} color={color} />, labelKey: 'familyMembers', route: '/(tabs)/records', color: '#2E7D32' },
  { icon: (color: string) => <MaterialCommunityIcons name="hospital-building" size={24} color={color} />, labelKey: 'nearbyHospitals', route: '/(tabs)/hospitals', color: '#7c3aed' },
  { icon: (color: string) => <Ionicons name="clipboard-outline" size={24} color={color} />, labelKey: 'healthRecords', route: '/(tabs)/records', color: '#d97706' },
  { icon: (color: string) => <Ionicons name="language-outline" size={24} color={color} />, labelKey: 'language', route: null, color: '#0284c7' },
  { icon: (color: string) => <Ionicons name="swap-horizontal-outline" size={24} color={color} />, labelKey: 'switchAccount', route: 'switch', color: '#7c3aed' },
];

export default function ProfileScreen(): ReactElement {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null);
  const [showLogout, setShowLogout] = useState(false);

  const handlePickImage = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take a photo');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Gallery permission is required to choose a photo');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLanguageChange = async (langCode: 'hi' | 'en') => {
    try {
      await updateUser({ language: langCode });
      i18n.locale = langCode;
      await AsyncStorage.setItem('language', langCode);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleSwitchAccount = async () => {
    Alert.alert('Switch Account', 'Choose an option', [
      {
        text: 'Add New Account',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/phone');
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
    setShowLogout(false);
    router.replace('/(auth)/phone');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <FadeInSection>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 16 : 20 }]}>
          <View style={styles.avatarWrap}>
            <Animated.View entering={ZoomIn.duration(500).springify()}>
              <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
                {profileImage ? (
                  <View>
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                    <View style={styles.cameraOverlay}>
                      <Ionicons name="camera-outline" size={18} color={Colors.textInverse} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person-outline" size={48} color="rgba(255,255,255,0.6)" />
                    <View style={styles.cameraOverlay}>
                      <Ionicons name="camera-outline" size={18} color={Colors.textInverse} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            {user?.email && (
              <View style={styles.userPhoneRow}>
                <Ionicons name="mail-outline" size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.userPhone}> {user.email}</Text>
              </View>
            )}
            <View style={styles.userMeta}>
              {user?.village && (
                <View style={styles.userMetaRow}>
                  <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.75)" />
                  <Text style={styles.userMetaText}> {user.village}</Text>
                </View>
              )}
              {user?.pincode && (
                <View style={styles.userMetaRow}>
                  <Ionicons name="mail-outline" size={14} color="rgba(255,255,255,0.75)" />
                  <Text style={styles.userMetaText}> {user.pincode}</Text>
                </View>
              )}
            </View>
            <View style={styles.badgesRow}>
              {user?.verifiedResident && (
                <View style={styles.badge}>
                  <Ionicons name="checkmark-circle" size={14} color="#66BB6A" />
                  <Text style={styles.badgeText}>Verified Resident</Text>
                </View>
              )}
              {user?.trustScore !== undefined && (
                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark-outline" size={14} color="#F9A825" />
                  <Text style={styles.badgeText}>Trust: {user.trustScore}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </FadeInSection>

      <SlideInSection>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          {MENU_ITEMS.map((item, idx) => (
            <StaggerItem key={item.labelKey} index={idx}>
              <AnimatedPressable
                style={styles.menuItem}
                onPress={() => {
                  if (item.route === 'switch') handleSwitchAccount();
                  else if (item.route) router.push(item.route as any);
                }}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                  {item.icon(item.color)}
                </View>
                <Text style={styles.menuLabel}>{i18n.t(item.labelKey)}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color={Colors.textTertiary} />
              </AnimatedPressable>
            </StaggerItem>
          ))}
        </View>
      </SlideInSection>

      <SlideInSection>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('language')}</Text>
          <View style={styles.languageRow}>
            {LANGUAGES.map((lang) => (
              <AnimatedPressable
                key={lang.code}
                style={[styles.langCard, user?.language === lang.code && styles.langCardActive]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[styles.langLabel, user?.language === lang.code && styles.langLabelActive]}>
                  {lang.label}
                </Text>
                <Text style={[styles.langName, user?.language === lang.code && styles.langNameActive]}>
                  {lang.name}
                </Text>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </SlideInSection>

      <SlideInSection>
        <AnimatedPressable style={styles.logoutBtn} onPress={() => setShowLogout(true)}>
          <Text style={styles.logoutBtnText}>{i18n.t('logout')}</Text>
        </AnimatedPressable>
      </SlideInSection>

      <LogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  avatarWrap: { alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.md },
  avatarImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  cameraOverlay: { position: 'absolute', bottom: 4, right: 4, backgroundColor: Colors.primary, borderRadius: 18, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.textInverse },
  userName: { ...Typography.h2, color: Colors.textInverse },
  userPhoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  userPhone: { ...Typography.caption, color: 'rgba(255,255,255,0.85)' },
  userMeta: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
  userMetaRow: { flexDirection: 'row', alignItems: 'center' },
  userMetaText: { ...Typography.small, color: 'rgba(255,255,255,0.75)' },
  badgesRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  badgeText: { fontSize: 12, color: Colors.textInverse, fontWeight: '500' },
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl },
  sectionTitle: { ...Typography.captionBold, color: Colors.textSecondary, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.lg, marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  menuIconWrap: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuLabel: { ...Typography.bodyBold, color: Colors.text, flex: 1 },
  languageRow: { flexDirection: 'row', gap: Spacing.md },
  langCard: {
    flex: 1, padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: Colors.card, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center',
    ...Shadow.sm,
  },
  langCardActive: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  langLabel: { ...Typography.h3, color: Colors.text, marginBottom: 4 },
  langName: { ...Typography.caption, color: Colors.textSecondary },
  langLabelActive: { color: Colors.primaryDark },
  langNameActive: { color: Colors.primary },
  logoutBtn: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.xxl,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    paddingVertical: Spacing.lg, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.danger,
  },
  logoutBtnText: { ...Typography.bodyBold, color: Colors.danger },
});
