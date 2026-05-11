import React, { ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../src/i18n';

const LANGUAGES = [
  { code: 'hi' as const, label: 'हिन्दी', name: 'Hindi' },
  { code: 'en' as const, label: 'English', name: 'English' },
];

export default function ProfileScreen(): ReactElement {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLanguageChange = async (langCode: 'hi' | 'en'): Promise<void> => {
    try {
      await updateUser({ language: langCode });
      i18n.locale = langCode;
      await AsyncStorage.setItem('language', langCode);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleLogout = (): void => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 15 : 15 }]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.phone}>+91 {user?.phone}</Text>
            <Text style={styles.location}>📍 {user?.village}, {user?.pincode}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('familyMembers')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/family')}>
            <Text style={styles.menuIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.menuText}>Manage Family Members</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/hospitals')}>
            <Text style={styles.menuIcon}>🏥</Text>
            <Text style={styles.menuText}>{i18n.t('nearbyPhc')}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('settings')}</Text>
          <View style={styles.languageSection}>
            <Text style={styles.languageTitle}>{i18n.t('language')}</Text>
            <View style={styles.languageOptions}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.languageOption, (user?.language || 'hi') === lang.code && styles.languageOptionActive]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={[styles.languageLabel, (user?.language || 'hi') === lang.code && styles.languageLabelActive]}>{lang.label}</Text>
                  <Text style={[styles.languageName, (user?.language || 'hi') === lang.code && styles.languageNameActive]}>{lang.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪  {i18n.t('logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>GramSehat v1.0.0</Text>
          <Text style={styles.footerText}>❤️ Made for Rural India</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4CAF50', paddingBottom: 20, paddingHorizontal: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50' },
  profileInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 2 },
  phone: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 2 },
  location: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  content: { flex: 1 },
  section: { backgroundColor: 'white', marginTop: 16, paddingHorizontal: 16, paddingVertical: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuIcon: { fontSize: 24, marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  languageSection: { paddingVertical: 8 },
  languageTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  languageOptions: { flexDirection: 'row', gap: 12 },
  languageOption: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#eee', alignItems: 'center' },
  languageOptionActive: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  languageLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  languageLabelActive: { color: '#4CAF50' },
  languageName: { fontSize: 12, color: '#666', marginTop: 4 },
  languageNameActive: { color: '#4CAF50' },
  logoutBtn: { backgroundColor: 'white', marginTop: 16, marginHorizontal: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { fontSize: 16, color: '#ff4444', fontWeight: '600' },
  footer: { padding: 32, alignItems: 'center' },
  version: { fontSize: 12, color: '#999', marginBottom: 4 },
  footerText: { fontSize: 12, color: '#999' },
});