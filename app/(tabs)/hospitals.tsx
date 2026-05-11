import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { phcApi } from '../src/api/phc';
import type { PhcCenter } from '../src/types/index';

export default function HospitalsScreen(): ReactElement {
  const [centers, setCenters] = useState<PhcCenter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async (): Promise<void> => {
    try {
      const result = await phcApi.getByPincode('224201');
      setCenters(result.centers || []);
    } catch (error) {
      console.error('Error loading centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCenter = ({ item }: { item: PhcCenter }): ReactElement => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeIcon}>{item.type === 'hospital' ? '🏥' : item.type === 'CHC' ? '🏨' : '🏠'}</Text>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.timing}>{item.timings}</Text>
        {item.isGovt && <Text style={styles.govtBadge}>Government</Text>}
      </View>
      <View style={styles.servicesRow}>
        {item.services?.slice(0, 4).map((service, idx) => (
          <View key={idx} style={styles.serviceBadge}>
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.callBtn}>
          <Text>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionsBtn}>
          <Text>🗺️ Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Health Centers</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={centers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCenter}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏥</Text>
              <Text style={styles.emptyText}>No health centers found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  typeIcon: { fontSize: 40, marginRight: 12 },
  cardHeaderInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  type: { fontSize: 12, color: '#4CAF50', textTransform: 'uppercase', fontWeight: '600' },
  address: { fontSize: 14, color: '#666', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  timing: { fontSize: 14, color: '#4CAF50', fontWeight: '600', flex: 1 },
  govtBadge: { backgroundColor: '#e3f2fd', color: '#1976d2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600' },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  serviceBadge: { backgroundColor: '#f5f5f5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  serviceText: { fontSize: 12, color: '#666' },
  actions: { flexDirection: 'row', gap: 12 },
  callBtn: { flex: 1, backgroundColor: '#e8f5e9', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  directionsBtn: { flex: 1, backgroundColor: '#fff3e0', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#666' },
});