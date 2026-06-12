import React, { useEffect, useState, ReactElement } from 'react';
import {
  ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput,
  TouchableOpacity, View, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, BounceIn, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { FamilyMember } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import {
  AnimatedPressable, StaggerItem, FadeInSection, SlideInSection,
} from '../../components/animated';

export default function FamilyMembersScreen(): ReactElement {
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newMember, setNewMember] = useState<{ name: string; age: string; gender: 'male' | 'female'; relation: string }>(
    { name: '', age: '', gender: 'male', relation: '' }
  );

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try { const { members: data } = await familyApi.getAll(); setMembers(data); }
    catch (e) { console.error('Error loading family:', e); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newMember.name.trim()) { Alert.alert('Error', 'Please enter name'); return; }
    try {
      await familyApi.add({
        name: newMember.name, age: newMember.age ? parseInt(newMember.age) : undefined,
        gender: newMember.gender, relation: newMember.relation || undefined,
      });
      setShowAdd(false);
      setNewMember({ name: '', age: '', gender: 'male', relation: '' });
      loadMembers();
    } catch (e: any) { Alert.alert('Error', e.message || 'Failed to add member'); }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert('Remove Member', `Remove ${name} from family?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try { await familyApi.delete(id); loadMembers(); }
        catch (e: any) { Alert.alert('Error', e.message); }
      }},
    ]);
  };

  const renderMember = ({ item, index }: { item: FamilyMember; index: number }) => (
    <StaggerItem index={index}>
      <AnimatedPressable style={styles.memberCard} onLongPress={() => handleDelete(item.id, item.name)}>
        <View style={[styles.avatar, { backgroundColor: item.gender === 'female' ? '#fce7f3' : '#dbeafe' }]}>
          <Ionicons
            name={item.gender === 'female' ? 'woman-outline' : 'man-outline'}
            size={26}
            color={Colors.primary}
          />
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <View style={styles.memberMeta}>
            {item.relation && <Text style={styles.memberRelation}>{item.relation}</Text>}
            {item.age && <Text style={styles.memberAge}>{item.age} yrs</Text>}
          </View>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.name)}>
          <Ionicons name="close-outline" size={14} color={Colors.danger} />
        </TouchableOpacity>
      </AnimatedPressable>
    </StaggerItem>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <FadeInSection>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 6 : 10 }]}>
          <Text style={styles.headerTitle}>{i18n.t('familyMembers')}</Text>
          <AnimatedPressable style={styles.addBtn} onPress={() => setShowAdd(true)}>
            <Ionicons name="add" size={24} color={Colors.textInverse} />
          </AnimatedPressable>
        </View>
      </FadeInSection>

      {showAdd && (
        <SlideInSection>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{i18n.t('addMember')}</Text>
            <TextInput style={styles.input} placeholder="Name" value={newMember.name} onChangeText={(t) => setNewMember({ ...newMember, name: t })} />
            <TextInput style={styles.input} placeholder="Age" keyboardType="number-pad" value={newMember.age} onChangeText={(t) => setNewMember({ ...newMember, age: t })} />
            <View style={styles.genderRow}>
              <TouchableOpacity style={[styles.genderBtn, newMember.gender === 'male' && styles.genderBtnActive]} onPress={() => setNewMember({ ...newMember, gender: 'male' })}>
                <Ionicons name="man-outline" size={20} color={newMember.gender === 'male' ? Colors.primary : Colors.text} />
                <Text style={[styles.genderLabel, newMember.gender === 'male' && styles.genderLabelActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.genderBtn, newMember.gender === 'female' && styles.genderBtnActive]} onPress={() => setNewMember({ ...newMember, gender: 'female' })}>
                <Ionicons name="woman-outline" size={20} color={newMember.gender === 'female' ? Colors.primary : Colors.text} />
                <Text style={[styles.genderLabel, newMember.gender === 'female' && styles.genderLabelActive]}>Female</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Relation (e.g. wife, son, mother)" value={newMember.relation} onChangeText={(t) => setNewMember({ ...newMember, relation: t })} />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <AnimatedPressable style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>{i18n.t('save')}</Text>
              </AnimatedPressable>
            </View>
          </View>
        </SlideInSection>
      )}

      {loading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <FadeInSection>
              <View style={styles.emptyWrap}>
                <Ionicons name="people-outline" size={72} color={Colors.textTertiary} style={{ marginBottom: Spacing.lg }} />
                <Text style={styles.emptyText}>No family members yet</Text>
                <Text style={styles.emptySub}>Add your family to track their health records</Text>
                <AnimatedPressable style={styles.emptyBtn} onPress={() => setShowAdd(true)}>
                  <Ionicons name="add" size={18} color={Colors.textInverse} />
                  <Text style={styles.emptyBtnText}>  Add Member</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.surface, paddingTop: Spacing.sm },
  headerTitle: { ...Typography.h2, color: Colors.text },
  addBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  formCard: { margin: Spacing.lg, padding: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.lg, ...Shadow.md },
  formTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.lg },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md, fontSize: 15, color: Colors.text, backgroundColor: Colors.background },
  genderRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background },
  genderBtnActive: { borderColor: Colors.primary, backgroundColor: '#f0fdf4' },
  genderLabel: { ...Typography.caption, color: Colors.text },
  genderLabelActive: { color: Colors.primary, fontWeight: '600' },
  formActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  cancelBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.md, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  cancelText: { ...Typography.captionBold, color: Colors.textSecondary },
  saveBtn: { flex: 1, backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: Radius.md, alignItems: 'center' },
  saveText: { ...Typography.captionBold, color: Colors.textInverse },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: Spacing.lg, paddingBottom: 100 },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.sm },
  avatar: { width: 52, height: 52, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  memberInfo: { flex: 1 },
  memberName: { ...Typography.bodyBold, color: Colors.text },
  memberMeta: { flexDirection: 'row', gap: Spacing.md, marginTop: 4 },
  memberRelation: { ...Typography.caption, color: Colors.textSecondary },
  memberAge: { ...Typography.caption, color: Colors.textTertiary },
  deleteBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center' },
  emptyWrap: { alignItems: 'center', padding: Spacing.xxxl * 2, paddingTop: 80 },
  emptyText: { ...Typography.h3, color: Colors.text },
  emptySub: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, marginTop: Spacing.xl, flexDirection: 'row', alignItems: 'center' },
  emptyBtnText: { ...Typography.captionBold, color: Colors.textInverse },
});
