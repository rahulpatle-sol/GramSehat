import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {familyApi } from '../src/api/family';
import { recordApi } from '../src/api/records';
import i18n from '../src/i18n';
import type { FamilyMember, RecordType } from '../src/types';

const RECORD_TYPES: RecordType[] = [
  { id: 'checkup', labelKey: 'checkup', icon: '🩺' },
  { id: 'prescription', labelKey: 'prescription', icon: '📄' },
  { id: 'test', labelKey: 'test', icon: '🧪' },
  { id: 'vaccination', labelKey: 'vaccination', icon: '💉' },
];

export default function AddRecordScreen(): ReactElement {
  const router = useRouter();
  const [form, setForm] = useState<{
    type: 'checkup' | 'prescription' | 'test' | 'vaccination';
    title: string;
    description: string;
    doctorName: string;
    hospitalName: string;
    date: string;
    memberId: number | null;
  }>({
    type: 'checkup',
    title: '',
    description: '',
    doctorName: '',
    hospitalName: '',
    date: new Date().toISOString().split('T')[0],
    memberId: null,
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async (): Promise<void> => {
    try {
      const { members } = await familyApi.getAll();
      setFamilyMembers(members);
    } catch (error) {
      console.error('Error loading family:', error);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setLoading(true);
    try {
      await recordApi.add({
        type: form.type,
        title: form.title,
        description: form.description || undefined,
        doctorName: form.doctorName || undefined,
        hospitalName: form.hospitalName || undefined,
        date: form.date || undefined,
        memberId: form.memberId,
      });
      Alert.alert('Success', 'Record added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('addRecord')}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('selectMember')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.memberChip, !form.memberId && styles.memberChipActive]} onPress={() => setForm({ ...form, memberId: null })}>
              <Text style={styles.memberEmoji}>🙋</Text>
              <Text style={styles.memberText}>{i18n.t('yourself')}</Text>
            </TouchableOpacity>
            {familyMembers.map((member) => (
              <TouchableOpacity key={member.id} style={[styles.memberChip, form.memberId === member.id && styles.memberChipActive]} onPress={() => setForm({ ...form, memberId: member.id })}>
                <Text style={styles.memberEmoji}>{member.gender === 'female' ? '👩' : '👨'}</Text>
                <Text style={styles.memberText}>{member.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('recordType')}</Text>
          <View style={styles.typeGrid}>
            {RECORD_TYPES.map((type) => (
              <TouchableOpacity key={type.id} style={[styles.typeCard, form.type === type.id && styles.typeCardActive]} onPress={() => setForm({ ...form, type: type.id })}>
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[styles.typeLabel, form.type === type.id && styles.typeLabelActive]}>{i18n.t(type.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput style={styles.input} placeholder="e.g., Annual Checkup" value={form.title} onChangeText={(text) => setForm({ ...form, title: text })} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Enter description" value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} multiline numberOfLines={3} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('doctorName')}</Text>
          <TextInput style={styles.input} placeholder="Dr. Name" value={form.doctorName} onChangeText={(text) => setForm({ ...form, doctorName: text })} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('hospitalName')}</Text>
          <TextInput style={styles.input} placeholder="Hospital/Clinic name" value={form.hospitalName} onChangeText={(text) => setForm({ ...form, hospitalName: text })} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('date')}</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.date} onChangeText={(text) => setForm({ ...form, date: text })} />
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>{i18n.t('save')}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { fontSize: 28, color: '#333', fontWeight: '300' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  memberChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 2, borderColor: '#eee' },
  memberChipActive: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  memberEmoji: { fontSize: 20, marginRight: 6 },
  memberText: { fontSize: 14, color: '#333' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: { width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: '#eee' },
  typeCardActive: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  typeIcon: { fontSize: 32, marginBottom: 8 },
  typeLabel: { fontSize: 14, color: '#666' },
  typeLabelActive: { color: '#4CAF50', fontWeight: '600' },
  input: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#4CAF50', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});