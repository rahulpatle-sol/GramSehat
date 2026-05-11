import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/store/AuthContext';
import { outbreakApi, phcApi, symptomApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { OutbreakAlert, PhcCenter, SymptomReport } from '../../src/types';

const SYMPTOM_ICONS: Record<string, string> = {
  fever: '🤒', cough: '😷', vomiting: '🤢', headache: '🤕',
  diarrhea: '💩', rash: '🔴', fatigue: '😴', chestPain: '💔',
};

export default function HomeScreen(): ReactElement {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>([]);
  const [phcCenters, setPhcCenters] = useState<PhcCenter[]>([]);
  const [recentReports, setRecentReports] = useState<SymptomReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.pincode) {
      loadData();
    }
  }, [user?.pincode]);

  const loadData = async (): Promise<void> => {
    try {
      const [outbreakData, phcData, symptomData] = await Promise.all([
        outbreakApi.getNearby(user!.pincode!),
        phcApi.getByPincode(user!.pincode!),
        symptomApi.getHistory(),
      ]);
      setOutbreaks(outbreakData.outbreaks || []);
      setPhcCenters(phcData.centers || []);
      setRecentReports(symptomData.reports?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: number): string => {
    switch (severity) {
      case 3: return '#ff4444';
      case 2: return '#ffaa00';
      default: return '#44aa44';
    }
  };

  const getSeverityText = (severity: number): string => {
    switch (severity) {
      case 3: return 'High';
      case 2: return 'Medium';
      default: return 'Low';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 15 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
            <Text style={styles.location}>📍 {user?.village || 'Your Village'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Text style={styles.notificationIcon}>🔔</Text>
            {outbreaks.length > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 90 }}
      >
        {outbreaks.length > 0 && (
          <TouchableOpacity style={styles.alertBanner}>
            <View style={styles.alertContent}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{i18n.t('outbreakAlert')}</Text>
                <Text style={styles.alertSubtitle}>{outbreaks.length} {i18n.t('activeOutbreaks')}</Text>
              </View>
            </View>
            <Text style={styles.alertArrow}>→</Text>
          </TouchableOpacity>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/symptoms')}>
            <Text style={styles.quickActionIcon}>🩺</Text>
            <Text style={styles.quickActionText}>{i18n.t('checkSymptoms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/medicine')}>
            <Text style={styles.quickActionIcon}>💊</Text>
            <Text style={styles.quickActionText}>{i18n.t('scanMedicine')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/records')}>
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>{i18n.t('healthRecords')}</Text>
          </TouchableOpacity>
        </View>

        {phcCenters.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{i18n.t('nearbyPhc')}</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/hospitals')}>
                <Text style={styles.viewAll}>{i18n.t('viewAll')}</Text>
              </TouchableOpacity>
            </View>
            {phcCenters.slice(0, 3).map((center) => (
              <TouchableOpacity key={center.id} style={styles.phcCard}>
                <View style={styles.phcIcon}>
                  <Text style={styles.phcEmoji}>{center.type === 'hospital' ? '🏥' : center.type === 'CHC' ? '🏨' : '🏠'}</Text>
                </View>
                <View style={styles.phcInfo}>
                  <Text style={styles.phcName}>{center.name}</Text>
                  <Text style={styles.phcAddress}>{center.address}</Text>
                  <Text style={styles.phcTiming}>🕐 {center.timings}</Text>
                </View>
                <TouchableOpacity style={styles.callBtn}>
                  <Text>📞</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {recentReports.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Symptom Reports</Text>
            {recentReports.map((report) => (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportSymptoms}>
                  {report.symptoms.slice(0, 3).map((symptom) => (
                    <Text key={symptom} style={styles.symptomBadge}>
                      {SYMPTOM_ICONS[symptom] || '🤒'} {symptom}
                    </Text>
                  ))}
                </View>
                <View style={styles.reportMeta}>
                  <Text style={styles.reportDate}>{new Date(report.createdAt).toLocaleDateString()}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
                    <Text style={styles.severityText}>{getSeverityText(report.severity)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4CAF50', paddingBottom: 20, paddingHorizontal: 16 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  location: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  notificationBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  notificationIcon: { fontSize: 24 },
  badge: { position: 'absolute', top: 8, right: 8, width: 12, height: 12, borderRadius: 6, backgroundColor: '#ff4444' },
  scrollView: { flex: 1 },
  alertBanner: { backgroundColor: '#fff3cd', margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 4, borderLeftColor: '#ffc107' },
  alertContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  alertIcon: { fontSize: 32, marginRight: 12 },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#856404' },
  alertSubtitle: { fontSize: 14, color: '#856404', marginTop: 2 },
  alertArrow: { fontSize: 24, color: '#856404' },
  quickActions: { flexDirection: 'row', padding: 16, gap: 12 },
  quickAction: { flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  quickActionIcon: { fontSize: 32, marginBottom: 8 },
  quickActionText: { fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  viewAll: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  phcCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  phcIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  phcEmoji: { fontSize: 24 },
  phcInfo: { flex: 1 },
  phcName: { fontSize: 16, fontWeight: '600', color: '#333' },
  phcAddress: { fontSize: 12, color: '#666', marginTop: 2 },
  phcTiming: { fontSize: 12, color: '#4CAF50', marginTop: 4, fontWeight: '500' },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center' },
  reportCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  reportSymptoms: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  symptomBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, fontSize: 12, color: '#333' },
  reportMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportDate: { fontSize: 12, color: '#666' },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  severityText: { fontSize: 12, color: 'white', fontWeight: '600' },
  loadingContainer: { padding: 32, alignItems: 'center' },
});