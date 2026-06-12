import React, { useState, useEffect, ReactElement, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Platform, StatusBar, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, BounceIn, ZoomIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { recordApi, familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { HealthRecord, FamilyMember } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import {
  AnimatedPressable, StaggerItem, FadeInSection, SlideInSection,
  BounceSection,
} from '../../components/animated';

const RECORD_TYPE_ICONS: Record<string, { family: 'ionicons' | 'material'; name: string }> = {
  checkup: { family: 'material', name: 'stethoscope' },
  prescription: { family: 'ionicons', name: 'document-text-outline' },
  test: { family: 'material', name: 'test-tube' },
  vaccination: { family: 'material', name: 'needle' },
};

const RECORD_TYPE_COLORS: Record<string, string> = {
  checkup: '#059669', prescription: '#d97706', test: '#7c3aed', vaccination: '#0284c7',
};

const renderRecordIcon = (type: string, size: number, color: string) => {
  const icon = RECORD_TYPE_ICONS[type] || { family: 'ionicons', name: 'clipboard-outline' };
  if (icon.family === 'ionicons') {
    return <Ionicons name={icon.name as any} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={icon.name as any} size={size} color={color} />;
};

export default function HealthRecordsScreen(): ReactElement {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const loadData = useCallback(async () => {
    try {
      const [recordData, familyData] = await Promise.all([
        recordApi.getAll(selectedMember || undefined),
        familyApi.getAll(),
      ]);
      setRecords(recordData.records || []);
      setFamilyMembers(familyData.members || []);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMember]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = (id: number) => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await recordApi.delete(id); loadData(); }
        catch (e) { console.error('Delete error:', e); }
      }},
    ]);
  };

  const renderRecord = ({ item, index }: { item: HealthRecord; index: number }) => {
    const typeColor = RECORD_TYPE_COLORS[item.type] || Colors.primary;
    return (
      <StaggerItem index={index}>
        <AnimatedPressable style={styles.recordCard} onPress={() => {}} onLongPress={() => handleDelete(item.id)}>
          <View style={styles.recordTop}>
            <View style={[styles.recordIconWrap, { backgroundColor: typeColor + '15' }]}>
              <BounceSection>
                {renderRecordIcon(item.type, 22, typeColor)}
              </BounceSection>
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.recordTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.recordMeta}>
                <View style={[styles.recordTypeBadge, { backgroundColor: typeColor + '20' }]}>
                  <Text style={[styles.recordTypeText, { color: typeColor }]}>{item.type}</Text>
                </View>
                {item.memberName && (
                  <View style={styles.recordMemberRow}>
                    <Ionicons name="person-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.recordMember}>{item.memberName}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.recordDateWrap}>
              <Text style={styles.recordDate}>
                {item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
              </Text>
            </View>
          </View>
          {item.description && <Text style={styles.recordDesc} numberOfLines={2}>{item.description}</Text>}
          {(item.doctorName || item.hospitalName) && (
            <View style={styles.recordFooter}>
              {item.doctorName && (
                <View style={styles.recordFooterItem}>
                  <MaterialCommunityIcons name="doctor" size={14} color={Colors.textSecondary} />
                  <Text style={styles.recordFooterText}> {item.doctorName}</Text>
                </View>
              )}
              {item.hospitalName && (
                <View style={styles.recordFooterItem}>
                  <MaterialCommunityIcons name="hospital-building" size={14} color={Colors.textSecondary} />
                  <Text style={styles.recordFooterText}> {item.hospitalName}</Text>
                </View>
              )}
            </View>
          )}
        </AnimatedPressable>
      </StaggerItem>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <FadeInSection>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 6 : 10 }]}>
          <Text style={styles.headerTitle}>{i18n.t('healthRecords')}</Text>
          <AnimatedPressable style={styles.addBtn} onPress={() => router.push('/(tabs)/add-record')}>
            <Text style={styles.addBtnText}>+</Text>
          </AnimatedPressable>
        </View>
      </FadeInSection>

      <View style={styles.memberFilter}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: 'All', gender: null, relation: null, userId: 0, age: null, createdAt: '' } as FamilyMember, ...familyMembers]}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.memberFilterList}
          renderItem={({ item, index }) => (
            <StaggerItem index={index}>
              <TouchableOpacity
                style={[styles.memberChip, selectedMember === item.id && styles.memberChipActive]}
                onPress={() => setSelectedMember(item.id)}
              >
                <Text style={[styles.memberChipText, selectedMember === item.id && styles.memberChipTextActive]}>
                  {item.name || 'All'}
                </Text>
              </TouchableOpacity>
            </StaggerItem>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecord}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <FadeInSection>
              <View style={styles.emptyWrap}>
                <Ionicons name="clipboard-outline" size={72} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>No records found</Text>
                <Text style={styles.emptySub}>Tap + to add your first health record</Text>
                <AnimatedPressable style={styles.emptyBtn} onPress={() => router.push('/(tabs)/add-record')}>
                  <Text style={styles.emptyBtnText}>Add Record</Text>
                </AnimatedPressable>
              </View>
            </FadeInSection>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface, paddingTop: Spacing.sm,
  },
  headerTitle: { ...Typography.h2, color: Colors.text },
  addBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { fontSize: 24, color: Colors.textInverse, fontWeight: '300' },
  memberFilter: { marginBottom: Spacing.sm, backgroundColor: Colors.surface, paddingBottom: Spacing.md },
  memberFilterList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  memberChip: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, backgroundColor: '#f1f5f9',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  memberChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  memberChipText: { ...Typography.caption, color: Colors.text },
  memberChipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: Spacing.lg, paddingBottom: 100 },
  recordCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.sm,
  },
  recordTop: { flexDirection: 'row', alignItems: 'center' },
  recordIconWrap: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  recordInfo: { flex: 1 },
  recordTitle: { ...Typography.bodyBold, color: Colors.text },
  recordMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  recordTypeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
  recordTypeText: { fontSize: 11, fontWeight: '600' },
  recordMemberRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  recordMember: { ...Typography.small, color: Colors.textSecondary },
  recordDateWrap: { marginLeft: Spacing.sm },
  recordDate: { ...Typography.smallBold, color: Colors.textTertiary },
  recordDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 20 },
  recordFooter: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  recordFooterItem: { flexDirection: 'row', alignItems: 'center' },
  recordFooterText: { ...Typography.small, color: Colors.textSecondary },
  emptyWrap: { alignItems: 'center', padding: Spacing.xxxl * 2, paddingTop: 80 },
  emptyText: { ...Typography.h3, color: Colors.text },
  emptySub: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, marginTop: Spacing.xl },
  emptyBtnText: { ...Typography.captionBold, color: Colors.textInverse },
});
