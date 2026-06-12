import React, { useState, useEffect, ReactElement, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, BounceIn, ZoomIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useAuth } from '../../src/store/AuthContext';
import { symptomApi, familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { FamilyMember, SymptomOption, SeverityLevel } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import {
  AnimatedPressable, StaggerItem, FadeInSection, SlideInSection,
  BounceSection,
} from '../../components/animated';

const SYMPTOM_ICONS: Record<string, { family: 'ionicons' | 'material'; name: string }> = {
  fever: { family: 'material', name: 'thermometer' },
  cough: { family: 'material', name: 'virus-outline' },
  vomiting: { family: 'material', name: 'emoticon-sick-outline' },
  headache: { family: 'material', name: 'head-snowflake-outline' },
  diarrhea: { family: 'material', name: 'water-alert-outline' },
  rash: { family: 'material', name: 'dots-hexagon' },
  fatigue: { family: 'ionicons', name: 'moon-outline' },
  chestPain: { family: 'ionicons', name: 'heart-dislike-outline' },
};

const SYMPTOMS: SymptomOption[] = [
  { id: 'fever', labelKey: 'symptomFever', icon: 'thermometer' },
  { id: 'cough', labelKey: 'symptomCough', icon: 'virus-outline' },
  { id: 'vomiting', labelKey: 'symptomVomiting', icon: 'emoticon-sick-outline' },
  { id: 'headache', labelKey: 'symptomHeadache', icon: 'head-snowflake-outline' },
  { id: 'diarrhea', labelKey: 'symptomDiarrhea', icon: 'water-alert-outline' },
  { id: 'rash', labelKey: 'symptomRash', icon: 'dots-hexagon' },
  { id: 'fatigue', labelKey: 'symptomFatigue', icon: 'moon-outline' },
  { id: 'chestPain', labelKey: 'symptomChestPain', icon: 'heart-dislike-outline' },
];

const SEVERITY_LEVELS: SeverityLevel[] = [
  { value: 1, labelKey: 'severityMild', emoji: 'happy-outline', description: 'Can manage at home' },
  { value: 2, labelKey: 'severityModerate', emoji: 'remove-outline', description: 'Need some medication' },
  { value: 3, labelKey: 'severitySevere', emoji: 'sad-outline', description: 'Need doctor visit' },
];

const STEP_TITLES = [i18n.t('selectMember'), i18n.t('selectSymptoms'), i18n.t('severity')];

const renderSymptomIcon = (id: string, size: number, color?: string) => {
  const icon = SYMPTOM_ICONS[id];
  if (!icon) return null;
  const c = color || Colors.textSecondary;
  if (icon.family === 'ionicons') {
    return <Ionicons name={icon.name as any} size={size} color={c} />;
  }
  return <MaterialCommunityIcons name={icon.name as any} size={size} color={c} />;
};

export default function SymptomCheckerScreen(): ReactElement {
  const { user, isGuest } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<number>(1);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => { loadFamilyMembers(); }, []);

  const loadFamilyMembers = async () => {
    try { const { members } = await familyApi.getAll(); setFamilyMembers(members); }
    catch (e) { console.error('Error loading family:', e); }
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((s) => s !== symptomId) : [...prev, symptomId]
    );
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) { Alert.alert('Error', 'Please select at least one symptom'); return; }
    if (isGuest) {
      Alert.alert('Sign in Required', 'Please sign in with Google to submit health reports', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/phone') },
      ]);
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
      Alert.alert('Success', i18n.t('submitSuccess'), [
        { text: 'OK', onPress: () => router.push('/(tabs)') },
      ]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', msg);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <FadeInSection>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 6 : 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{i18n.t('reportSymptoms')}</Text>
          <View style={{ width: 40 }} />
        </View>
      </FadeInSection>

      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepRow}>
            <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
              <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>{s}</Text>
            </View>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView ref={scrollRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <FadeInSection>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{i18n.t('selectMember')}</Text>
              <Text style={styles.stepSub}>Who is experiencing symptoms?</Text>

              <AnimatedPressable
                style={[styles.memberCard, !selectedMember && styles.memberCardSelected]}
                onPress={() => setSelectedMember(null)}
              >
                <View style={[styles.memberAvatar, { backgroundColor: !selectedMember ? Colors.primaryLight : '#f1f5f9' }]}>
                  <BounceSection>
                    <Ionicons name="person-outline" size={24} color={!selectedMember ? Colors.primary : Colors.textSecondary} />
                  </BounceSection>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{i18n.t('yourself')}</Text>
                  <Text style={styles.memberDetail}>You</Text>
                </View>
                {!selectedMember && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.textInverse} />
                  </View>
                )}
              </AnimatedPressable>

              {familyMembers.map((member, idx) => (
                <StaggerItem key={member.id} index={idx}>
                  <AnimatedPressable
                    style={[styles.memberCard, selectedMember === member.id && styles.memberCardSelected]}
                    onPress={() => setSelectedMember(member.id)}
                  >
                    <View style={[styles.memberAvatar, { backgroundColor: selectedMember === member.id ? Colors.primaryLight : '#f1f5f9' }]}>
                      <BounceSection>
                        {member.gender === 'female' ? (
                          <Ionicons name="woman-outline" size={24} color={selectedMember === member.id ? Colors.primary : Colors.textSecondary} />
                        ) : (
                          <Ionicons name="man-outline" size={24} color={selectedMember === member.id ? Colors.primary : Colors.textSecondary} />
                        )}
                      </BounceSection>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberDetail}>{member.relation || 'Family'}</Text>
                    </View>
                    {selectedMember === member.id && (
                      <View style={styles.checkCircle}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.textInverse} />
                      </View>
                    )}
                  </AnimatedPressable>
                </StaggerItem>
              ))}

              <AnimatedPressable style={styles.primaryBtn} onPress={() => goToStep(2)}>
                <Text style={styles.primaryBtnText}>{i18n.t('continueBtn')} →</Text>
              </AnimatedPressable>
            </View>
          </FadeInSection>
        )}

        {step === 2 && (
          <SlideInSection>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{i18n.t('selectSymptoms')}</Text>
              <Text style={styles.stepSub}>Select all symptoms you're experiencing</Text>

              <View style={styles.symptomGrid}>
                {SYMPTOMS.map((symptom, idx) => {
                  const selected = selectedSymptoms.includes(symptom.id);
                  return (
                    <StaggerItem key={symptom.id} index={idx} style={{ width: '47%' }}>
                      <AnimatedPressable
                        style={[styles.symptomCard, selected && styles.symptomCardSelected]}
                        onPress={() => toggleSymptom(symptom.id)}
                      >
                        <BounceSection>
                          {renderSymptomIcon(symptom.id, 32, selected ? Colors.primary : Colors.textSecondary)}
                        </BounceSection>
                        <Text style={[styles.symptomLabel, selected && styles.symptomLabelSelected]}>
                          {i18n.t(symptom.labelKey)}
                        </Text>
                        {selected && (
                          <View style={styles.symptomCheck}>
                            <Ionicons name="checkmark-circle" size={16} color={Colors.textInverse} />
                          </View>
                        )}
                      </AnimatedPressable>
                    </StaggerItem>
                  );
                })}
              </View>

              <View style={styles.btnRow}>
                <AnimatedPressable style={styles.secondaryBtn} onPress={() => goToStep(1)}>
                  <Text style={styles.secondaryBtnText}>← {i18n.t('retry')}</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  style={[styles.primaryBtn, { flex: 1 }, selectedSymptoms.length === 0 && styles.btnDisabled]}
                  onPress={() => goToStep(3)}
                  disabled={selectedSymptoms.length === 0}
                >
                  <Text style={styles.primaryBtnText}>{i18n.t('continueBtn')} →</Text>
                </AnimatedPressable>
              </View>
            </View>
          </SlideInSection>
        )}

        {step === 3 && (
          <SlideInSection>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{i18n.t('severity')}</Text>
              <Text style={styles.stepSub}>How severe are these symptoms?</Text>

              <View style={styles.severityOptions}>
                {SEVERITY_LEVELS.map((level, idx) => (
                  <StaggerItem key={level.value} index={idx}>
                    <AnimatedPressable
                      style={[styles.severityCard, severity === level.value && styles.severityCardSelected]}
                      onPress={() => setSeverity(level.value)}
                    >
                      <View style={styles.severityEmojiWrap}>
                        <BounceSection>
                          <Ionicons name={level.emoji as any} size={36} color={severity === level.value ? Colors.primary : Colors.textSecondary} />
                        </BounceSection>
                      </View>
                      <View style={styles.severityInfo}>
                        <Text style={[styles.severityLabel, severity === level.value && { color: Colors.primary }]}>
                          {i18n.t(level.labelKey)}
                        </Text>
                        <Text style={styles.severityDesc}>{level.description}</Text>
                      </View>
                      {severity === level.value && (
                        <View style={styles.severityRadio}><View style={styles.severityRadioInner} /></View>
                      )}
                    </AnimatedPressable>
                  </StaggerItem>
                ))}
              </View>

              <View style={styles.btnRow}>
                <AnimatedPressable style={styles.secondaryBtn} onPress={() => goToStep(2)}>
                  <Text style={styles.secondaryBtnText}>← {i18n.t('retry')}</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  style={[styles.primaryBtn, { flex: 1 }, loading && styles.btnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{i18n.t('submit')} →</Text>}
                </AnimatedPressable>
              </View>
            </View>
          </SlideInSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.surface },
  backBtn: { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 24, color: Colors.text },
  headerTitle: { ...Typography.h3, color: Colors.text },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.lg, backgroundColor: Colors.surface },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: Colors.primary },
  stepNum: { ...Typography.captionBold, color: Colors.textSecondary },
  stepNumActive: { color: Colors.textInverse },
  stepLine: { width: 40, height: 3, backgroundColor: '#e2e8f0', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.primary },
  content: { flex: 1 },
  stepContent: { padding: Spacing.xl },
  stepTitle: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.xs },
  stepSub: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.xl },
  memberCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: Colors.card, marginBottom: Spacing.md,
    borderWidth: 2, borderColor: Colors.border, ...Shadow.sm,
  },
  memberCardSelected: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  memberAvatar: { width: 48, height: 48, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  memberInfo: { flex: 1 },
  memberName: { ...Typography.bodyBold, color: Colors.text },
  memberDetail: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  symptomCard: {
    padding: Spacing.lg, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', backgroundColor: Colors.card,
    position: 'relative', ...Shadow.sm,
  },
  symptomCardSelected: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  symptomIcon: { fontSize: 32, marginBottom: Spacing.sm },
  symptomLabel: { ...Typography.caption, color: Colors.text },
  symptomLabelSelected: { color: Colors.primaryDark, fontWeight: '600' },
  symptomCheck: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  severityOptions: { gap: Spacing.md, marginBottom: Spacing.xl },
  severityCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.xl, borderRadius: Radius.lg,
    backgroundColor: Colors.card, borderWidth: 2,
    borderColor: Colors.border, ...Shadow.sm,
  },
  severityCardSelected: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  severityEmojiWrap: { width: 44, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.lg },
  severityInfo: { flex: 1 },
  severityLabel: { ...Typography.bodyBold, color: Colors.text },
  severityDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  severityRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  severityRadioInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.primary },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center', ...Shadow.md },
  primaryBtnText: { ...Typography.bodyBold, color: Colors.textInverse },
  secondaryBtn: { backgroundColor: Colors.surface, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  secondaryBtnText: { ...Typography.bodyBold, color: Colors.textSecondary },
  btnDisabled: { opacity: 0.5 },
});
