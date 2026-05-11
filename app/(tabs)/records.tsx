import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { recordApi, familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { HealthRecord, FamilyMember } from '../../src/types';

const RECORD_TYPE_ICONS: Record<string, string> = {
  checkup: '🩺', prescription: '📄', test: '🧪', vaccination: '💉',
};

export default function HealthRecordsScreen(): ReactElement {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const [recordsRes, familyRes] = await Promise.all([
        recordApi.getAll(selectedMember ?? undefined),
        familyApi.getAll(),
      ]);
      setRecords(recordsRes.records || []);
      setFamilyMembers(familyRes.members || []);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMember]);

  const handleDelete = async (id: number): Promise<void> => {
    Alert.alert('🗑️ Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await recordApi.delete(id);
          loadData();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Something went wrong';
          Alert.alert('❌ Error', message);
        }
      }},
    ]);
  };

  const renderRecord = ({ item }: { item: HealthRecord }): ReactElement => (
    <View style={styles.recordCard}>
      <View style={styles.recordIcon}>
        <Text style={styles.recordIconText}>{RECORD_TYPE_ICONS[item.type] || '📋'}</Text>
      </View>
      <View style={styles.recordInfo}>
        <Text style={styles.recordTitle}>{item.title}</Text>
        <Text style={styles.recordType}>{item.type}</Text>
        {item.doctorName && <Text style={styles.recordDoctor}>Dr. {item.doctorName}</Text>}
        <Text style={styles.recordDate}>{new Date(item.date || item.createdAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
        <Text>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 15 }]}>
        <Text style={styles.headerTitle}>{i18n.t('healthRecords')}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/add-record')}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <TouchableOpacity style={[styles.filterBtn, !selectedMember && styles.filterBtnActive]} onPress={() => setSelectedMember(null)}>
          <Text style={styles.filterEmoji}>🙋</Text>
        </TouchableOpacity>
        {familyMembers.map((member) => (
          <TouchableOpacity key={member.id} style={[styles.filterBtn, selectedMember === member.id && styles.filterBtnActive]} onPress={() => setSelectedMember(member.id)}>
            <Text style={styles.filterEmoji}>{member.gender === 'female' ? '👩' : '👨'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#4CAF50" /></View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecord}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>{i18n.t('noData')}</Text>
              <TouchableOpacity style={styles.addRecordBtn} onPress={() => router.push('/(tabs)/add-record')}>
                <Text style={styles.addRecordBtnText}>+ Add First Record</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  addBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: 'white', fontWeight: '600' },
  filterSection: { padding: 16, backgroundColor: '#fff', flexDirection: 'row', gap: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#e8f5e9', borderWidth: 2, borderColor: '#4CAF50' },
  filterEmoji: { fontSize: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  recordCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  recordIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  recordIconText: { fontSize: 24 },
  recordInfo: { flex: 1 },
  recordTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  recordType: { fontSize: 12, color: '#4CAF50', textTransform: 'capitalize', marginTop: 2 },
  recordDoctor: { fontSize: 12, color: '#666', marginTop: 4 },
  recordDate: { fontSize: 12, color: '#999', marginTop: 4 },
  deleteBtn: { padding: 8 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 20 },
  addRecordBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  addRecordBtnText: { color: 'white', fontWeight: '600' },
});