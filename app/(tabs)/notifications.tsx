import React, { useState, ReactElement, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Platform, StatusBar, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '../../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import { AnimatedPressable, StaggerItem } from '../../components/animated';

interface NotificationItem {
  id: string;
  type: 'outbreak' | 'health' | 'medicine' | 'vaccination' | 'system' | 'asha';
  titleKey: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1', type: 'outbreak', titleKey: 'outbreakNotification',
    description: 'Fever outbreak detected in your area. Take precautions and report symptoms immediately.',
    time: '2m ago', read: false,
  },
  {
    id: '2', type: 'vaccination', titleKey: 'vaccinationReminder',
    description: 'Your child\'s polio vaccination is due next week. Visit your nearest PHC center.',
    time: '1h ago', read: false,
  },
  {
    id: '3', type: 'health', titleKey: 'healthUpdateNotification',
    description: 'New health camp scheduled at Jalalpur CHC this Saturday. Free checkup available.',
    time: '3h ago', read: false,
  },
  {
    id: '4', type: 'asha', titleKey: 'ashaMessage',
    description: 'ASHA worker Sunita Devi will visit your village tomorrow at 10 AM for routine checkup.',
    time: '5h ago', read: true,
  },
  {
    id: '5', type: 'medicine', titleKey: 'medicineReminder',
    description: 'Time to take your prescribed medicines. Don\'t forget to follow the dosage.',
    time: 'Yesterday', read: true,
  },
  {
    id: '6', type: 'system', titleKey: 'systemNotification',
    description: 'GramSehat app updated to version 1.2. New features added for better health tracking.',
    time: '2 days ago', read: true,
  },
  {
    id: '7', type: 'outbreak', titleKey: 'outbreakNotification',
    description: 'Seasonal flu cases rising in nearby villages. Wash hands regularly and wear masks.',
    time: '3 days ago', read: true,
  },
];

function getNotificationIcon(type: string, color: string): ReactElement {
  switch (type) {
    case 'outbreak':
      return <Ionicons name="warning-outline" size={22} color={color} />;
    case 'health':
      return <Ionicons name="heart-outline" size={22} color={color} />;
    case 'medicine':
      return <MaterialCommunityIcons name="pill" size={22} color={color} />;
    case 'vaccination':
      return <MaterialCommunityIcons name="needle" size={22} color={color} />;
    case 'asha':
      return <MaterialCommunityIcons name="medical-bag" size={22} color={color} />;
    default:
      return <Ionicons name="notifications-outline" size={22} color={color} />;
  }
}

function getNotificationColor(type: string): string {
  switch (type) {
    case 'outbreak': return '#dc2626';
    case 'health': return '#059669';
    case 'medicine': return '#7c3aed';
    case 'vaccination': return '#0284c7';
    case 'asha': return '#d97706';
    default: return '#64748b';
  }
}

function getTimeAgo(dateStr: string): string {
  return dateStr;
}

export default function NotificationsScreen(): ReactElement {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    Alert.alert(
      'Clear All',
      'Remove all notifications?',
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('clearAll'),
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  const renderNotification = ({ item, index }: { item: NotificationItem; index: number }) => {
    const color = getNotificationColor(item.type);
    return (
      <StaggerItem index={index}>
        <AnimatedPressable
          style={[styles.notifCard, !item.read && styles.notifCardUnread]}
          onPress={() => toggleRead(item.id)}
        >
          <View style={[styles.notifIconWrap, { backgroundColor: color + '15' }]}>
            {getNotificationIcon(item.type, color)}
          </View>
          <View style={styles.notifContent}>
            <View style={styles.notifHeader}>
              <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                {i18n.t(item.titleKey)}
              </Text>
              {!item.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
            </View>
            <Text style={styles.notifDesc} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.notifTime}>{item.time}</Text>
          </View>
        </AnimatedPressable>
      </StaggerItem>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{i18n.t('notifications')}</Text>
          {unreadCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} style={styles.headerAction}>
          <Text style={styles.headerActionText}>{i18n.t('markAllRead')}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <Animated.View entering={FadeInUp.duration(500)} style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textTertiary} />
            </View>
            <Text style={styles.emptyText}>{i18n.t('noNotifications')}</Text>
            <Text style={styles.emptySub}>{i18n.t('noNotificationsDesc')}</Text>
          </Animated.View>
        }
        ListHeaderComponent={
          notifications.length > 0 ? (
            <View style={styles.listHeader}>
              <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
                <Ionicons name="trash-outline" size={14} color={Colors.danger} />
                <Text style={styles.clearText}>{i18n.t('clearAll')}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  headerTitle: { ...Typography.h2, color: Colors.text },
  countBadge: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: Spacing.sm,
  },
  countText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  headerAction: { paddingHorizontal: Spacing.sm },
  headerActionText: { ...Typography.smallBold, color: Colors.primary },
  listContent: { paddingBottom: 100 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: '#fef2f2',
  },
  clearText: { fontSize: 12, fontWeight: '600', color: Colors.danger },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadow.sm,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: { ...Typography.bodyBold, color: Colors.text, flex: 1 },
  notifTitleUnread: { color: Colors.text },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  notifDesc: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 20 },
  notifTime: { ...Typography.small, color: Colors.textTertiary, marginTop: 6 },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyText: { ...Typography.h3, color: Colors.text, textAlign: 'center' },
  emptySub: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
});
