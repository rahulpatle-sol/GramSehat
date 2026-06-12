import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Platform, StatusBar, RefreshControl, Linking,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, BounceIn, Layout, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/store/AuthContext';
import { outbreakApi, phcApi, symptomApi, familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { OutbreakAlert, PhcCenter } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import {
  AnimatedPressable, FadeInSection, SlideInSection, BounceSection,
  StaggerItem,
} from '../../components/animated';
import { ProfileSheet } from '../../components/ProfileSheet';

const QUICK_ACTIONS = [
  { icon: <MaterialCommunityIcons name="stethoscope" size={26} />, labelKey: 'checkSymptoms', route: '/(tabs)/symptoms', color: '#059669', bgColor: '#ecfdf5' },
  { icon: <MaterialCommunityIcons name="pill" size={26} />, labelKey: 'scanMedicine', route: '/(tabs)/medicine', color: '#7c3aed', bgColor: '#f5f3ff' },
  { icon: <Ionicons name="business-outline" size={26} />, labelKey: 'nearbyHospitals', route: '/(tabs)/hospitals', color: '#0284c7', bgColor: '#e0f2fe' },
  { icon: <Ionicons name="clipboard-outline" size={26} />, labelKey: 'healthRecords', route: '/(tabs)/records', color: '#d97706', bgColor: '#fef3c7' },
  { icon: <Ionicons name="people-outline" size={26} />, labelKey: 'familyMembers', route: '/(tabs)/records', color: '#0891b2', bgColor: '#cffafe' },
  { icon: <MaterialCommunityIcons name="alert-rhombus-outline" size={26} />, labelKey: 'reportSymptoms', route: '/(tabs)/symptoms', color: '#dc2626', bgColor: '#fef2f2' },
  { icon: <MaterialCommunityIcons name="medical-bag" size={26} />, labelKey: 'contactAshaWorker', route: '', color: '#65a30d', bgColor: '#ecfccb' },
  { icon: <Ionicons name="information-circle-outline" size={26} />, labelKey: 'healthInfo', route: '', color: '#6366f1', bgColor: '#eef2ff' },
];

export default function HomeScreen() {
  const { user, isGuest } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>([]);
  const [phcCenters, setPhcCenters] = useState<PhcCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const pincode = user?.pincode || '224201';
      const [outbreakData, phcData] = await Promise.all([
        outbreakApi.getNearby(pincode).catch(() => ({ outbreaks: [] })),
        phcApi.getByPincode(pincode).catch(() => ({ centers: [] })),
      ]);
      setOutbreaks(outbreakData.outbreaks || []);
      setPhcCenters(phcData.centers?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.pincode]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleCall = (phone: string | null | undefined) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <FadeInSection>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 6 : 8 }]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.delay(100)} style={styles.headerGreeting}>
                <Text style={styles.greeting}>{i18n.t('welcome')},</Text>
                <Text style={styles.userName}> {user?.name || i18n.t('guest')}</Text>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(200)} style={styles.headerLocation}>
                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.locationText}>
                  {user?.village || user?.district || user?.state || i18n.t('guest')}
                </Text>
              </Animated.View>
            </View>
            <View style={styles.headerActions}>
              <AnimatedPressable
                style={styles.headerBtn}
                onPress={() => router.push('/(tabs)/notifications')}
              >
                <Ionicons name="notifications-outline" size={22} color={Colors.textInverse} />
                {outbreaks.length > 0 && <View style={styles.notifBadge} />}
              </AnimatedPressable>
              <TouchableOpacity
                style={styles.avatarBtn}
                activeOpacity={0.7}
                onPress={() => setShowProfile(true)}
              >
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarLetter}>
                    {(user?.name || 'G').charAt(0).toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </FadeInSection>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
        }
      >
        {/* Emergency Card */}
        <BounceSection>
          <AnimatedPressable
            style={styles.emergencyCard}
            onPress={() => router.push('/(tabs)/hospitals')}
          >
            <RNAnimated.View style={[styles.emergencyInner, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.emergencyIconWrap}>
                <Ionicons name="medkit" size={28} color={Colors.textInverse} />
              </View>
              <View style={styles.emergencyTextWrap}>
                <Text style={styles.emergencyTitle}>{i18n.t('emergency')}</Text>
                <Text style={styles.emergencySub}>{i18n.t('emergencySubtitle')}</Text>
              </View>
              <View style={styles.emergencyArrow}>
                <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.8)" />
              </View>
            </RNAnimated.View>
          </AnimatedPressable>
        </BounceSection>

        {/* Outbreak Alert Banner */}
        {outbreaks.length > 0 && (
          <BounceSection>
            <AnimatedPressable style={styles.alertCard} onPress={() => {}}>
              <View style={styles.alertLeft}>
                <View style={styles.alertIconWrap}>
                  <Ionicons name="warning" size={22} color="#92400e" />
                </View>
              </View>
              <View style={styles.alertCenter}>
                <Text style={styles.alertTitle}>{i18n.t('outbreakDetected')}</Text>
                <Text style={styles.alertDesc}>
                  {outbreaks.length} {i18n.t('activeOutbreaks')}
                </Text>
              </View>
              <View style={styles.alertRight}>
                <Text style={styles.alertAction}>{i18n.t('viewDetails')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#92400e" />
              </View>
            </AnimatedPressable>
          </BounceSection>
        )}

        {/* Quick Actions Grid */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </Animated.View>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <StaggerItem key={action.labelKey} index={index} style={styles.qaCardWrapper}>
              <AnimatedPressable
                style={[styles.qaCard, { backgroundColor: action.bgColor }]}
                onPress={() => {
                  if (action.route) router.push(action.route as any);
                }}
              >
                <View style={[styles.qaIconWrap, { backgroundColor: action.color + '20' }]}>
                  {action.icon}
                </View>
                <Text style={[styles.qaLabel, { color: action.color }]}>
                  {i18n.t(action.labelKey)}
                </Text>
              </AnimatedPressable>
            </StaggerItem>
          ))}
        </View>

        {/* Nearby Hospitals */}
        <SlideInSection>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('nearbyHospitals')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/hospitals')}>
              <Text style={styles.viewAllBtn}>{i18n.t('viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {phcCenters.length > 0 ? (
            phcCenters.map((center, idx) => (
              <StaggerItem key={center.id} index={idx + 8}>
                <View style={styles.hospitalCard}>
                  <View style={[styles.hospitalIconWrap, {
                    backgroundColor: center.type === 'hospital' ? '#ede9fe' :
                      center.type === 'CHC' ? '#e0f2fe' : '#ecfdf5',
                  }]}>
                    {center.type === 'hospital' ? (
                      <MaterialCommunityIcons name="hospital-building" size={24} color="#7c3aed" />
                    ) : center.type === 'CHC' ? (
                      <Ionicons name="business-outline" size={24} color="#0284c7" />
                    ) : (
                      <MaterialCommunityIcons name="medical-bag" size={24} color="#059669" />
                    )}
                  </View>
                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName} numberOfLines={1}>{center.name}</Text>
                    <View style={styles.hospitalMeta}>
                      {center.distance && (
                        <View style={styles.distanceChip}>
                          <Ionicons name="location-outline" size={12} color={Colors.primary} />
                          <Text style={styles.distanceText}>
                            {center.distance < 1
                              ? `${Math.round(center.distance * 1000)}m`
                              : `${center.distance.toFixed(1)}km`}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.hospitalType}>{center.type}</Text>
                    </View>
                    {center.address && (
                      <Text style={styles.hospitalAddress} numberOfLines={1}>{center.address}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => handleCall(center.phone)}
                  >
                    <Ionicons name="call" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </StaggerItem>
            ))
          ) : !loading ? (
            <View style={styles.emptyHospitals}>
              <MaterialCommunityIcons name="hospital-marker" size={40} color={Colors.textTertiary} />
              <Text style={styles.emptyHospitalsText}>{i18n.t('noData')}</Text>
            </View>
          ) : null}
        </SlideInSection>

        {/* Family Health Summary */}
        {user && (
          <SlideInSection>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{i18n.t('familyHealthSummary')}</Text>
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIcon, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="people-outline" size={22} color="#0284c7" />
                </View>
                <Text style={styles.summaryValue}>{user?.name ? '1' : '0'}</Text>
                <Text style={styles.summaryLabel}>{i18n.t('familyMembers')}</Text>
              </View>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="clipboard-outline" size={22} color="#059669" />
                </View>
                <Text style={styles.summaryValue}>0</Text>
                <Text style={styles.summaryLabel}>{i18n.t('recentRecords')}</Text>
              </View>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIcon, { backgroundColor: '#fef3c7' }]}>
                  <MaterialCommunityIcons name="needle" size={22} color="#d97706" />
                </View>
                <Text style={styles.summaryValue}>0</Text>
                <Text style={styles.summaryLabel}>{i18n.t('pendingVaccinations')}</Text>
              </View>
            </View>
          </SlideInSection>
        )}

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && !outbreaks.length && !phcCenters.length && (
          <FadeInSection>
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="leaf-outline" size={48} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>{i18n.t('welcome')}!</Text>
              <Text style={styles.emptyDesc}>{i18n.t('tagline')}</Text>
            </View>
          </FadeInSection>
        )}
      </ScrollView>

      {/* Profile Bottom Sheet */}
      <ProfileSheet visible={showProfile} onClose={() => setShowProfile(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerGreeting: { flexDirection: 'row', alignItems: 'baseline' },
  greeting: { ...Typography.h3, color: 'rgba(255,255,255,0.85)' },
  userName: { ...Typography.h2, color: Colors.textInverse },
  headerLocation: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { ...Typography.small, color: 'rgba(255,255,255,0.8)', marginLeft: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerBtn: {
    width: 42, height: 42, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: Colors.danger, borderWidth: 1.5, borderColor: Colors.primary,
  },
  avatarBtn: {
    width: 42, height: 42, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarInner: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarLetter: { fontSize: 16, fontWeight: '700', color: Colors.textInverse },

  scrollView: { flex: 1 },

  // Emergency
  emergencyCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    borderRadius: Radius.lg, overflow: 'hidden',
    ...Shadow.lg,
  },
  emergencyInner: {
    backgroundColor: Colors.danger,
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.lg,
  },
  emergencyIconWrap: {
    width: 48, height: 48, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  emergencyTextWrap: { flex: 1 },
  emergencyTitle: { ...Typography.bodyBold, color: Colors.textInverse, fontSize: 18 },
  emergencySub: { ...Typography.small, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  emergencyArrow: { marginLeft: Spacing.sm },

  // Alert
  alertCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    backgroundColor: '#fef3c7', borderRadius: Radius.lg,
    padding: Spacing.lg, flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4, borderLeftColor: Colors.accent,
    ...Shadow.sm,
  },
  alertLeft: { marginRight: Spacing.md },
  alertIconWrap: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: '#fde68a', justifyContent: 'center', alignItems: 'center',
  },
  alertCenter: { flex: 1 },
  alertTitle: { ...Typography.bodyBold, color: '#92400e' },
  alertDesc: { ...Typography.small, color: '#92400e', marginTop: 2 },
  alertRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  alertAction: { ...Typography.smallBold, color: '#92400e' },

  // Section headers
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl, marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.h3, color: Colors.text },
  viewAllBtn: { ...Typography.captionBold, color: Colors.primary, letterSpacing: 0.3 },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: 10,
  },
  qaCardWrapper: { width: '47%' as any },
  qaCard: {
    borderRadius: Radius.lg, padding: Spacing.lg,
    minHeight: 96, justifyContent: 'center',
    ...Shadow.sm,
  },
  qaIconWrap: {
    width: 44, height: 44, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  qaLabel: { ...Typography.smallBold, fontSize: 13 },

  // Hospitals
  hospitalCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.lg, marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center',
    ...Shadow.sm,
  },
  hospitalIconWrap: {
    width: 48, height: 48, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  hospitalInfo: { flex: 1 },
  hospitalName: { ...Typography.bodyBold, color: Colors.text },
  hospitalMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  distanceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.full,
  },
  distanceText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  hospitalType: { ...Typography.small, color: Colors.textSecondary },
  hospitalAddress: { ...Typography.small, color: Colors.textTertiary, marginTop: 2 },
  callBtn: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center', alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  emptyHospitals: {
    alignItems: 'center', paddingVertical: Spacing.xxl,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.card, borderRadius: Radius.lg,
  },
  emptyHospitalsText: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },

  // Family Health Summary
  summaryGrid: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.lg, alignItems: 'center',
    ...Shadow.sm,
  },
  summaryIcon: {
    width: 40, height: 40, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryValue: { ...Typography.h2, color: Colors.text },
  summaryLabel: { ...Typography.small, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },

  // Loading
  loadingWrap: { padding: Spacing.xxxl * 2, alignItems: 'center' },
  loadingText: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.md },

  // Empty
  emptyWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: Spacing.xxl },
  emptyIconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: { ...Typography.h2, color: Colors.text, textAlign: 'center' },
  emptyDesc: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
});
