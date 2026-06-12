import React, { ReactElement, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Animated as RNAnimated, Dimensions, ScrollView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../src/store/AuthContext';
import i18n from '../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../constants/theme';
import { LogoutModal } from './LogoutModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MenuItem {
  icon: ReactElement;
  labelKey: string;
  route?: string;
  onPress?: () => void;
  color?: string;
}

interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileSheet({ visible, onClose }: ProfileSheetProps): ReactElement {
  const { user, isGuest, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new RNAnimated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new RNAnimated.Value(0)).current;
  const [showLogout, setShowLogout] = React.useState(false);

  useEffect(() => {
    if (visible) {
      RNAnimated.parallel([
        RNAnimated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          stiffness: 200,
          damping: 24,
        }),
        RNAnimated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      RNAnimated.parallel([
        RNAnimated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        RNAnimated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigation = (route?: string) => {
    onClose();
    if (route) {
      setTimeout(() => router.push(route as any), 300);
    }
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => setShowLogout(true), 300);
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogout(false);
    router.replace('/(auth)/phone');
  };

  const menuItems: MenuItem[] = [
    { icon: <Ionicons name="person-outline" size={22} color={Colors.primary} />, labelKey: 'myProfile', route: '/(tabs)/profile' },
    { icon: <Ionicons name="people-outline" size={22} color="#7c3aed" />, labelKey: 'familyMembers', route: '/(tabs)/records' },
    { icon: <Ionicons name="clipboard-outline" size={22} color="#d97706" />, labelKey: 'healthRecords', route: '/(tabs)/records' },
    { icon: <Ionicons name="notifications-outline" size={22} color="#0284c7" />, labelKey: 'notifications', route: '/(tabs)/notifications' },
    { icon: <Ionicons name="settings-outline" size={22} color="#64748b" />, labelKey: 'settings', onPress: () => {} },
    { icon: <Ionicons name="language-outline" size={22} color={Colors.primary} />, labelKey: 'language', onPress: () => {} },
    { icon: <Ionicons name="help-circle-outline" size={22} color="#059669" />, labelKey: 'helpSupport', onPress: () => {} },
    { icon: <Ionicons name="log-out-outline" size={22} color={Colors.danger} />, labelKey: 'logout', onPress: handleLogout, color: Colors.danger },
  ];

  return (
    <>
      <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <RNAnimated.View
            style={[styles.overlayBg, { opacity: overlayOpacity }]}
          >
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
          </RNAnimated.View>

          <RNAnimated.View
            style={[
              styles.sheet,
              { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.handle} />

            {/* User info */}
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                {user?.avatar ? (
                  <Text style={styles.avatarText}>{user.name?.charAt(0) || 'U'}</Text>
                ) : (
                  <Ionicons name="person" size={28} color={Colors.primaryDark} />
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {isGuest ? i18n.t('guest') : user?.name || 'User'}
                </Text>
                <Text style={styles.userDetail}>
                  {isGuest ? i18n.t('guest') : user?.village || user?.pincode || ''}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Menu items */}
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.labelKey}
                  style={styles.menuItem}
                  activeOpacity={0.6}
                  onPress={() => item.onPress ? item.onPress() : handleNavigation(item.route)}
                >
                  <View style={[styles.menuIcon, item.labelKey === 'logout' && styles.menuIconDanger]}>
                    {item.icon}
                  </View>
                  <Text style={[
                    styles.menuLabel,
                    item.labelKey === 'logout' && { color: Colors.danger },
                  ]}>
                    {i18n.t(item.labelKey)}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={item.labelKey === 'logout' ? Colors.danger : '#cbd5e1'}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RNAnimated.View>
        </View>
      </Modal>

      <LogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: SCREEN_HEIGHT * 0.75,
    ...Shadow.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h3,
    color: Colors.text,
  },
  userDetail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuIconDanger: {
    backgroundColor: '#fef2f2',
  },
  menuLabel: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
  },
});
