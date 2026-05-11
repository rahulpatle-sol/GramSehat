import React, { useEffect, useState, ReactElement } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { familyApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { FamilyMember } from '../../src/types';

export default function FamilyMembersScreen(): ReactElement {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newMember, setNewMember] = useState<{ name: string; age: string; gender: 'male' | 'female'; relation: string }>({ name: '', age: '', gender: 'male', relation: '' });

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async (): Promise<void> => {
    try {
      const { members: data } = await familyApi.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Error loading family:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (): Promise<void> => {
    if (!newMember.name.trim()) {
      Alert.alert('Error', 'Please enter name');
      return;
    }
    try {
      await familyApi.add({
        name: newMember.name,
        age: newMember.age ? parseInt(newMember.age) : undefined,
        gender: newMember.gender,
        relation: newMember.relation || undefined,
      });
      setShowAdd(false);
      setNewMember({ name: '', age: '', gender: 'male', relation: '' });
      loadMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', message);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await familyApi.delete(id);
      loadMembers();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const renderMember = ({ item }: { item: FamilyMember }): ReactElement => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberEmoji}>{item.gender === 'female' ? '👩' : '👨'}</Text>
        <View>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberDetails}>{item.relation || ''} • {item.age || ''} years</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{i18n.t('familyMembers')}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
          <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addForm}>
          <TextInput style={styles.input} placeholder="Name" value={newMember.name} onChangeText={(text) => setNewMember({ ...newMember, name: text })} />
          <TextInput style={styles.input} placeholder="Age" keyboardType="number-pad" value={newMember.age} onChangeText={(text) => setNewMember({ ...newMember, age: text })} />
          <TextInput style={styles.input} placeholder="Relation (e.g., Wife, Son)" value={newMember.relation} onChangeText={(text) => setNewMember({ ...newMember, relation: text })} />
          <View style={styles.genderRow}>
            <TouchableOpacity style={[styles.genderBtn, newMember.gender === 'male' && styles.genderBtnActive]} onPress={() => setNewMember({ ...newMember, gender: 'male' })}>
              <Text>👨 Male</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.genderBtn, newMember.gender === 'female' && styles.genderBtnActive]} onPress={() => setNewMember({ ...newMember, gender: 'female' })}>
              <Text>👩 Female</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
            <Text style={styles.saveBtnText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.emptyText}>No family members added</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  addBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: 'white', fontWeight: '600' },
  addForm: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 12 },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  genderBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center' },
  genderBtnActive: { backgroundColor: '#e8f5e9', borderWidth: 2, borderColor: '#4CAF50' },
  saveBtn: { backgroundColor: '#4CAF50', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  memberCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  memberInfo: { flexDirection: 'row', alignItems: 'center' },
  memberEmoji: { fontSize: 40, marginRight: 16 },
  memberName: { fontSize: 16, fontWeight: '600', color: '#333' },
  memberDetails: { fontSize: 14, color: '#666', marginTop: 4 },
  deleteBtn: { fontSize: 20, padding: 8 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#666' },
});