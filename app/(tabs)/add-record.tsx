import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, SlideInRight, BounceIn, ZoomIn } from 'react-native-reanimated';
import { familyApi } from '../../src/api/family';
import { recordApi } from '../../src/api/records';
import i18n from '../../src/i18n';
import type { FamilyMember, RecordType } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import { AnimatedPressable, StaggerItem, FadeInSection } from '../../components/animated';

const RECORD_TYPES = [
  { id: 'checkup' as const, labelKey: 'checkup', icon: (active: boolean) => <MaterialCommunityIcons name="stethoscope" size={32} color={active ? Colors.primary : Colors.textSecondary} /> },
  { id: 'prescription' as const, labelKey: 'prescription', icon: (active: boolean) => <Ionicons name="document-text-outline" size={32} color={active ? Colors.primary : Colors.textSecondary} /> },
  { id: 'test' as const, labelKey: 'test', icon: (active: boolean) => <MaterialCommunityIcons name="test-tube" size={32} color={active ? Colors.primary : Colors.textSecondary} /> },
  { id: 'vaccination' as const, labelKey: 'vaccination', icon: (active: boolean) => <MaterialCommunityIcons name="needle" size={32} color={active ? Colors.primary : Colors.textSecondary} /> },
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

  useEffect(() => { loadFamily(); }, []);

  const loadFamily = async (): Promise<void> => {
    try { const { members } = await familyApi.getAll(); setFamilyMembers(members); }
    catch (error) { console.error('Error loading family:', error); }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!form.title.trim()) { Alert.alert('Error', 'Please enter a title'); return; }
    setLoading(true);
    try {
      await recordApi.add({
        type: form.type, title: form.title,
        description: form.description || undefined,
        doctorName: form.doctorName || undefined,
        hospitalName: form.hospitalName || undefined,
        date: form.date || undefined, memberId: form.memberId,
      });
      Alert.alert('Success', 'Record added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', message);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('addRecord')}</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInSection>
          <View style={styles.section}>
            <Text style={styles.label}>{i18n.t('selectMember')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.memberChip, !form.memberId && styles.memberChipActive]}
                onPress={() => setForm({ ...form, memberId: null })}
              >
                <View style={styles.memberEmoji}>
                  <Ionicons name="person-outline" size={20} color={Colors.text} />
                </View>
                <Text style={styles.memberText}>{i18n.t('yourself')}</Text>
              </TouchableOpacity>
              {familyMembers.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.memberChip, form.memberId === member.id && styles.memberChipActive]}
                  onPress={() => setForm({ ...form, memberId: member.id })}
                >
                  <View style={styles.memberEmoji}>
                    {member.gender === 'female'
                      ? <Ionicons name="woman-outline" size={20} color={Colors.text} />
                      : <Ionicons name="man-outline" size={20} color={Colors.text} />
                    }
                  </View>
                  <Text style={styles.memberText}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </FadeInSection>

        <StaggerItem index={1}>
          <View style={styles.section}>
            <Text style={styles.label}>{i18n.t('recordType')}</Text>
            <View style={styles.typeGrid}>
              {RECORD_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.typeCard, form.type === type.id && styles.typeCardActive]}
                  onPress={() => setForm({ ...form, type: type.id })}
                >
                  <View style={styles.typeIcon}>
                    {type.icon(form.type === type.id)}
                  </View>
                  <Text style={[styles.typeLabel, form.type === type.id && styles.typeLabelActive]}>
                    {i18n.t(type.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </StaggerItem>

        <StaggerItem index={2}>
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} placeholder="e.g., Annual Checkup" placeholderTextColor={Colors.textTertiary} value={form.title} onChangeText={(text) => setForm({ ...form, title: text })} />
          </View>
        </StaggerItem>

        <StaggerItem index={3}>
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Enter description" placeholderTextColor={Colors.textTertiary} value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} multiline numberOfLines={3} />
          </View>
        </StaggerItem>

        <StaggerItem index={4}>
          <View style={styles.section}>
            <Text style={styles.label}>{i18n.t('doctorName')}</Text>
            <TextInput style={styles.input} placeholder="Dr. Name" placeholderTextColor={Colors.textTertiary} value={form.doctorName} onChangeText={(text) => setForm({ ...form, doctorName: text })} />
          </View>
        </StaggerItem>

        <StaggerItem index={5}>
          <View style={styles.section}>
            <Text style={styles.label}>{i18n.t('hospitalName')}</Text>
            <TextInput style={styles.input} placeholder="Hospital/Clinic name" placeholderTextColor={Colors.textTertiary} value={form.hospitalName} onChangeText={(text) => setForm({ ...form, hospitalName: text })} />
          </View>
        </StaggerItem>

        <StaggerItem index={6}>
          <View style={styles.section}>
            <Text style={styles.label}>{i18n.t('date')}</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textTertiary} value={form.date} onChangeText={(text) => setForm({ ...form, date: text })} />
          </View>
        </StaggerItem>

        <AnimatedPressable style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.textInverse} /> : <Text style={styles.submitBtnText}>{i18n.t('save')}</Text>}
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, backgroundColor: Colors.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  headerSpacer: { width: 40 },
  content: { flex: 1, padding: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  label: { ...Typography.captionBold, color: Colors.text, marginBottom: Spacing.sm },
  memberChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, paddingHorizontal: Spacing.lg, paddingVertical: 10, borderRadius: Radius.full, marginRight: Spacing.sm, borderWidth: 2, borderColor: Colors.border },
  memberChipActive: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  memberEmoji: { marginRight: 6 },
  memberText: { fontSize: 14, color: Colors.text },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: { width: '48%', backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center', borderWidth: 2, borderColor: Colors.border },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  typeIcon: { marginBottom: 8, alignItems: 'center' },
  typeLabel: { ...Typography.caption, color: Colors.textSecondary },
  typeLabelActive: { color: Colors.primary, fontWeight: '600' },
  input: { backgroundColor: Colors.card, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, paddingVertical: 14, fontSize: 16, borderWidth: 1.5, borderColor: Colors.border, color: Colors.text },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: 20, marginBottom: 40, ...Shadow.md },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: Colors.textInverse, fontSize: 16, fontWeight: '600' },
});
