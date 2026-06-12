import React, { useState, useEffect, ReactElement, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,
  ActivityIndicator, Platform, StatusBar, Modal, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp, BounceIn, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { medicineApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { Medicine, MedicineScanResult } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import {
  AnimatedPressable, StaggerItem, FadeInSection, SlideInSection,
} from '../../components/animated';

const SEARCH_HISTORY_KEY = '@medicine_search_history';
const MAX_HISTORY = 10;

const QUICK_MEDICINES = [
  'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Cetirizine',
  'Omeprazole', 'Azithromycin', 'Metformin', 'Dolo 650',
];

export default function MedicineSearchScreen(): ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState<string>('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanned, setScanned] = useState<MedicineScanResult | null>(null);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) setSearchHistory(JSON.parse(stored));
    } catch {}
  };

  const saveToHistory = async (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, MAX_HISTORY);
    setSearchHistory(updated);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = async () => {
    setSearchHistory([]);
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const handleSearch = useCallback(async (searchTerm?: string) => {
    const term = (searchTerm || query).trim();
    if (term.length < 2) return;
    setLoading(true);
    setScanned(null);
    setShowHistory(false);
    try {
      const result = await medicineApi.search(term);
      setMedicines(result.medicines || []);
      await saveToHistory(term);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Camera permission is required to scan medicines'); return; }
    setCameraVisible(true);
  };

  const takePhoto = async () => {
    if (!cameraRef) return;
    try {
      const photo = await cameraRef.takePictureAsync({ quality: 0.8 });
      if (photo) {
        setCameraVisible(false);
        setLoading(true);
        const formData = new FormData();
        formData.append('image', { uri: photo.uri, type: 'image/jpeg', name: 'medicine.jpg' } as any);
        const result = await medicineApi.scan(formData);
        setScanned(result);
      }
    } catch (error) {
      console.error('Camera error:', error);
    } finally { setLoading(false); }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('image', { uri: result.assets[0].uri, type: 'image/jpeg', name: 'medicine.jpg' } as any);
        const scanResult = await medicineApi.scan(formData);
        setScanned(scanResult);
      } catch (error) { console.error('Image error:', error); }
      finally { setLoading(false); }
    }
  };

  const renderMedicineCard = ({ item, index }: { item: Medicine; index: number }) => (
    <StaggerItem index={index}>
      <AnimatedPressable style={styles.medicineCard} onPress={() => {}}>
        <View style={styles.medIconWrap}>
          <MaterialCommunityIcons name="pill" size={26} color={Colors.primary} />
        </View>
        <View style={styles.medInfo}>
          <View style={styles.medNameRow}>
            <Text style={styles.medName} numberOfLines={1}>{item.name}</Text>
            {item.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color={Colors.textInverse} />
              </View>
            )}
          </View>
          <Text style={styles.medGeneric}>{item.genericName || 'Generic'}</Text>
          <View style={styles.medMeta}>
            <Text style={styles.medManufacturer} numberOfLines={1}>{item.manufacturer}</Text>
            {item.dosage && <Text style={styles.medDosage}>{item.dosage}</Text>}
          </View>
        </View>
      </AnimatedPressable>
    </StaggerItem>
  );

  const renderScannedResult = (): ReactElement | null => {
    if (!scanned) return null;
    if (!scanned.found) {
      return (
        <FadeInSection>
          <View style={styles.notFoundWrap}>
            <View style={styles.notFoundIconWrap}>
              <Ionicons name="search-outline" size={40} color={Colors.textTertiary} />
            </View>
            <Text style={styles.notFoundTitle}>{i18n.t('notInDatabase')}</Text>
            <Text style={styles.notFoundSub}>This medicine is not in our verification database</Text>
            <AnimatedPressable style={styles.actionBtn} onPress={() => setScanned(null)}>
              <Text style={styles.actionBtnText}>Scan Again</Text>
            </AnimatedPressable>
          </View>
        </FadeInSection>
      );
    }
    return (
      <SlideInSection>
        <View style={[styles.resultCard, scanned.isVerified ? styles.verifiedResult : styles.warningResult]}>
          <View style={styles.resultHeaderWrap}>
            <View style={[styles.resultIconWrap, { backgroundColor: scanned.isVerified ? '#d1fae5' : '#fef3c7' }]}>
              <Ionicons
                name={scanned.isVerified ? 'checkmark-circle' : 'warning-outline'}
                size={24}
                color={scanned.isVerified ? Colors.primaryDark : '#92400e'}
              />
            </View>
            <Text style={[styles.resultTitle, { color: scanned.isVerified ? Colors.primaryDark : '#92400e' }]}>
              {scanned.isVerified ? i18n.t('verifiedMedicine') : i18n.t('fakeMedicine')}
            </Text>
          </View>
          <View style={styles.resultDetails}>
            <Text style={styles.detailName}>{scanned.medicine?.name}</Text>
            <Text style={styles.detailGeneric}>{scanned.medicine?.genericName}</Text>
            <View style={styles.detailDivider} />
            {renderDetail('Manufacturer', scanned.medicine?.manufacturer)}
            {renderDetail('Dosage', scanned.medicine?.dosage)}
            {scanned.medicine?.uses?.length ? renderDetail('Uses', scanned.medicine.uses.join(', ')) : null}
          </View>
          <AnimatedPressable style={styles.actionBtn} onPress={() => setScanned(null)}>
            <Text style={styles.actionBtnText}>Scan Another</Text>
          </AnimatedPressable>
        </View>
      </SlideInSection>
    );
  };

  const renderDetail = (label: string, value?: string | null) => (
    value ? (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ) : null
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <FadeInSection>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 6 : 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{i18n.t('scanMedicine')}</Text>
          <View style={{ width: 40 }} />
        </View>
      </FadeInSection>

      <View style={styles.searchWrap}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color={Colors.textTertiary} style={{ marginRight: Spacing.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines by name or barcode..."
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={(t) => { setQuery(t); setShowHistory(true); }}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setMedicines([]); }} style={styles.clearBtn}>
              <Ionicons name="close-outline" size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <AnimatedPressable style={styles.searchBtn} onPress={() => handleSearch()}>
          <Ionicons name="search-outline" size={16} color={Colors.textInverse} />
          <Text style={styles.searchBtnIcon}> Search</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.actionRow}>
        <AnimatedPressable style={styles.actionCard} onPress={openCamera}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="camera-outline" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Scan</Text>
        </AnimatedPressable>
        <AnimatedPressable style={styles.actionCard} onPress={pickImage}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="images-outline" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Gallery</Text>
        </AnimatedPressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Searching medicines...</Text>
        </View>
      ) : scanned ? (
        renderScannedResult()
      ) : showHistory && query.length < 2 && searchHistory.length > 0 ? (
        <SlideInSection>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearHistory}><Text style={styles.historyClear}>Clear</Text></TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <StaggerItem index={index}>
                <TouchableOpacity style={styles.historyItem} onPress={() => { setQuery(item); handleSearch(item); }}>
                  <Ionicons name="time-outline" size={16} color={Colors.textTertiary} />
                  <Text style={styles.historyText}>{item}</Text>
                </TouchableOpacity>
              </StaggerItem>
            )}
            contentContainerStyle={styles.historyList}
          />
        </SlideInSection>
      ) : showHistory && query.length < 2 && searchHistory.length === 0 ? (
        <SlideInSection>
          <View style={styles.quickWrap}>
            <Text style={styles.quickTitle}>Quick Search</Text>
            <View style={styles.quickGrid}>
              {QUICK_MEDICINES.map((name, idx) => (
                <StaggerItem key={name} index={idx}>
                  <TouchableOpacity
                    style={styles.quickChip}
                    onPress={() => { setQuery(name); handleSearch(name); }}
                  >
                    <Text style={styles.quickChipText}>{name}</Text>
                  </TouchableOpacity>
                </StaggerItem>
              ))}
            </View>
          </View>
        </SlideInSection>
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMedicineCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            query.length >= 2 ? (
              <FadeInSection>
                <View style={styles.emptyWrap}>
                  <MaterialCommunityIcons name="pill" size={64} color={Colors.textTertiary} style={{ marginBottom: Spacing.lg }} />
                  <Text style={styles.emptyText}>No medicines found for "{query}"</Text>
                  <Text style={styles.emptySub}>Try a different name or scan the barcode</Text>
                </View>
              </FadeInSection>
            ) : null
          }
        />
      )}

      <Modal visible={cameraVisible} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)}>
            <View style={styles.camOverlay}>
              <View style={styles.camFrame} />
            </View>
            <View style={styles.camControls}>
              <TouchableOpacity style={styles.camBtn} onPress={() => setCameraVisible(false)}>
                <Text style={styles.camBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.camBtn} onPress={pickImage}>
                <Text style={styles.camBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  backBtn: { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h3, color: Colors.text },
  searchWrap: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.md },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, ...Shadow.sm,
  },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: Colors.text },
  clearBtn: { width: 28, height: 28, borderRadius: Radius.full, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  searchBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg, justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row', gap: Spacing.xs,
  },
  searchBtnIcon: { color: Colors.textInverse, fontWeight: '600', fontSize: 14 },
  actionRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  actionCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingVertical: 14, gap: Spacing.sm, ...Shadow.sm,
  },
  actionIconWrap: { width: 28, height: 28, borderRadius: Radius.sm, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { ...Typography.captionBold, color: Colors.primary },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.md },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  medicineCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.lg, marginBottom: Spacing.sm,
    flexDirection: 'row', ...Shadow.sm,
  },
  medIconWrap: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  medInfo: { flex: 1 },
  medNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  medName: { ...Typography.bodyBold, color: Colors.text, flex: 1 },
  verifiedBadge: {
    width: 20, height: 20, borderRadius: Radius.full,
    backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center',
  },
  medGeneric: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  medMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: Spacing.sm },
  medManufacturer: { ...Typography.small, color: Colors.textTertiary, flex: 1 },
  medDosage: { ...Typography.smallBold, color: Colors.primary },
  historyHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  historyTitle: { ...Typography.captionBold, color: Colors.textSecondary },
  historyClear: { ...Typography.small, color: Colors.danger },
  historyList: { paddingHorizontal: Spacing.lg },
  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1,
    borderBottomColor: Colors.border, gap: Spacing.md,
  },
  historyText: { ...Typography.body, color: Colors.text, flex: 1 },
  quickWrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  quickTitle: { ...Typography.captionBold, color: Colors.textSecondary, marginBottom: Spacing.md },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickChip: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  quickChipText: { ...Typography.caption, color: Colors.text },
  notFoundWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxxl },
  notFoundIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  notFoundTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.sm },
  notFoundSub: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  actionBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    marginTop: Spacing.xl, alignSelf: 'center',
  },
  actionBtnText: { ...Typography.captionBold, color: Colors.textInverse },
  resultCard: {
    margin: Spacing.lg, borderRadius: Radius.xl, overflow: 'hidden',
    ...Shadow.lg,
  },
  verifiedResult: { backgroundColor: '#f0fdf4' },
  warningResult: { backgroundColor: '#fffbeb' },
  resultHeaderWrap: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  resultIconWrap: { width: 48, height: 48, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  resultTitle: { ...Typography.h3, flex: 1 },
  resultDetails: { backgroundColor: Colors.surface, padding: Spacing.lg, margin: Spacing.sm, borderRadius: Radius.lg },
  detailName: { ...Typography.h2, color: Colors.text, marginBottom: 4 },
  detailGeneric: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.md },
  detailDivider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  detailLabel: { ...Typography.captionBold, color: Colors.textSecondary, width: 100 },
  detailValue: { ...Typography.caption, color: Colors.text, flex: 1 },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  camOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camFrame: {
    width: 280, height: 280, borderWidth: 2, borderColor: Colors.primary,
    borderRadius: Radius.lg, backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  camControls: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 40, backgroundColor: 'rgba(0,0,0,0.8)',
  },
  camBtn: { padding: Spacing.lg },
  camBtnText: { color: '#fff', fontSize: 16 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary },
  emptyWrap: { alignItems: 'center', padding: Spacing.xxxl * 2 },
  emptyText: { ...Typography.h3, color: Colors.text, textAlign: 'center' },
  emptySub: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
});
