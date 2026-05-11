import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/store/AuthContext';
import { symptomApi, familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { FamilyMember, SymptomOption, SeverityLevel } from '../../src/types';

const SYMPTOM_ICONS: Record<string, string> = {
  fever: '🤒', cough: '😷', vomiting: '🤢', headache: '🤕',
  diarrhea: '💩', rash: '🔴', fatigue: '😴', chestPain: '💔',
};

const SYMPTOMS: SymptomOption[] = [
  { id: 'fever', labelKey: 'symptomFever', icon: '🤒' },
  { id: 'cough', labelKey: 'symptomCough', icon: '😷' },
  { id: 'vomiting', labelKey: 'symptomVomiting', icon: '🤢' },
  { id: 'headache', labelKey: 'symptomHeadache', icon: '🤕' },
  { id: 'diarrhea', labelKey: 'symptomDiarrhea', icon: '💩' },
  { id: 'rash', labelKey: 'symptomRash', icon: '🔴' },
  { id: 'fatigue', labelKey: 'symptomFatigue', icon: '😴' },
  { id: 'chestPain', labelKey: 'symptomChestPain', icon: '💔' },
];

const SEVERITY_LEVELS: SeverityLevel[] = [
  { value: 1, labelKey: 'severityMild', emoji: '😊', description: 'Can manage at home' },
  { value: 2, labelKey: 'severityModerate', emoji: '😐', description: 'Need some medication' },
  { value: 3, labelKey: 'severitySevere', emoji: '😰', description: 'Need doctor visit' },
];

export default function SymptomCheckerScreen(): ReactElement {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<number>(1);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async (): Promise<void> => {
    try {
      const { members } = await familyApi.getAll();
      setFamilyMembers(members);
    } catch (error) {
      console.error('Error loading family:', error);
    }
  };

  const toggleSymptom = (symptomId: string): void => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((s) => s !== symptomId) : [...prev, symptomId]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Error', 'Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      await symptomApi.report({
        symptoms: selectedSymptoms,
        primarySymptom: selectedSymptoms[0],
        severity,
        pincode: user!.pincode!,
        memberId: selectedMember,
      });
      Alert.alert('✅ Success', i18n.t('submitSuccess'), [
        { text: 'OK', onPress: () => router.push('/(tabs)') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('❌ Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 15 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('reportSymptoms')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{i18n.t('selectMember')}</Text>
            <TouchableOpacity style={[styles.memberCard, !selectedMember && styles.memberCardSelected]} onPress={() => setSelectedMember(null)}>
              <Text style={styles.memberEmoji}>🙋</Text>
              <Text style={styles.memberName}>{i18n.t('yourself')}</Text>
            </TouchableOpacity>
            {familyMembers.map((member) => (
              <TouchableOpacity key={member.id} style={[styles.memberCard, selectedMember === member.id && styles.memberCardSelected]} onPress={() => setSelectedMember(member.id)}>
                <Text style={styles.memberEmoji}>{member.gender === 'female' ? '👩' : '👨'}</Text>
                <View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRelation}>{member.relation}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
              <Text style={styles.nextBtnText}>{i18n.t('continueBtn')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{i18n.t('selectSymptoms')}</Text>
            <View style={styles.symptomGrid}>
              {SYMPTOMS.map((symptom) => (
                <TouchableOpacity key={symptom.id} style={[styles.symptomCard, selectedSymptoms.includes(symptom.id) && styles.symptomCardSelected]} onPress={() => toggleSymptom(symptom.id)}>
                  <Text style={styles.symptomIcon}>{SYMPTOM_ICONS[symptom.id]}</Text>
                  <Text style={styles.symptomLabel}>{i18n.t(symptom.labelKey)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtnSmall} onPress={() => setStep(1)}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, selectedSymptoms.length === 0 && styles.btnDisabled]} onPress={() => setStep(3)} disabled={selectedSymptoms.length === 0}>
                <Text style={styles.nextBtnText}>{i18n.t('continueBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{i18n.t('severity')}</Text>
            <Text style={styles.severitySubtitle}>How severe are the symptoms?</Text>
            <View style={styles.severityOptions}>
              {SEVERITY_LEVELS.map((level) => (
                <TouchableOpacity key={level.value} style={[styles.severityOption, severity === level.value && styles.severityOptionSelected]} onPress={() => setSeverity(level.value)}>
                  <Text style={styles.severityEmoji}>{level.emoji}</Text>
                  <View>
                    <Text style={styles.severityLabel}>{i18n.t(level.labelKey)}</Text>
                    <Text style={styles.severityDesc}>{level.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtnSmall} onPress={() => setStep(2)}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, loading && styles.btnDisabled]} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.nextBtnText}>{i18n.t('submit')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },
  stepDotActive: { backgroundColor: '#4CAF50' },
  content: { flex: 1 },
  stepContent: { padding: 20 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  memberCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#eee', marginBottom: 12 },
  memberCardSelected: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  memberEmoji: { fontSize: 32, marginRight: 16 },
  memberName: { fontSize: 16, fontWeight: '600', color: '#333' },
  memberRelation: { fontSize: 12, color: '#666' },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  symptomCard: { width: '47%', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#eee', alignItems: 'center', backgroundColor: '#fafafa' },
  symptomCardSelected: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  symptomIcon: { fontSize: 32, marginBottom: 8 },
  symptomLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
  severitySubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  severityOptions: { gap: 12 },
  severityOption: { padding: 20, borderRadius: 12, borderWidth: 2, borderColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  severityOptionSelected: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  severityEmoji: { fontSize: 40, marginRight: 16 },
  severityLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  severityDesc: { fontSize: 12, color: '#666' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  nextBtn: { flex: 1, backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  nextBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  backBtnSmall: { flex: 1, backgroundColor: '#f5f5f5', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  backBtnText: { color: '#666', fontSize: 16, fontWeight: '600' },
  btnDisabled: { opacity: 0.5 },
});