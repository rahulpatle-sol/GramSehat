import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Platform, StatusBar, Modal, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { medicineApi } from '../../src/api';
import i18n from '../../src/i18n';
import type { Medicine, MedicineScanResult } from '../../src/types';

export default function MedicineSearchScreen(): ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState<string>('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanned, setScanned] = useState<MedicineScanResult | null>(null);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  const handleSearch = async (): Promise<void> => {
    if (query.length < 2) return;
    setLoading(true);
    setScanned(null);
    try {
      const result = await medicineApi.search(query);
      setMedicines(result.medicines || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setCameraVisible(false);
      return;
    }
    setCameraVisible(true);
  };

  const takePhoto = async (): Promise<void> => {
    if (!cameraRef) return;
    try {
      const photo = await cameraRef.takePictureAsync({ quality: 0.8 });
      if (photo) {
        setCameraVisible(false);
        setLoading(true);
        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'medicine.jpg',
        } as any);
        const result = await medicineApi.scan(formData);
        setScanned(result);
      }
    } catch (error) {
      console.error('Camera error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'medicine.jpg',
        } as any);
        const scanResult = await medicineApi.scan(formData);
        setScanned(scanResult);
      } catch (error) {
        console.error('Image picker error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderMedicineCard = ({ item }: { item: Medicine }): ReactElement => (
    <TouchableOpacity style={styles.medicineCard}>
      <View style={styles.medicineIcon}><Text style={styles.medicineEmoji}>💊</Text></View>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineGeneric}>{item.genericName || 'Generic not specified'}</Text>
        <View style={styles.medicineMeta}>
          <Text style={styles.manufacturer}>{item.manufacturer}</Text>
          {item.isVerified && <Text style={styles.verified}>✓ Verified</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderScannedResult = (): ReactElement | null => {
    if (!scanned) return null;

    if (!scanned.found) {
      return (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>❌</Text>
          <Text style={styles.notFoundTitle}>{i18n.t('notInDatabase')}</Text>
          <Text style={styles.notFoundSubtitle}>This medicine is not in our verification database</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => setScanned(null)}>
            <Text style={styles.retryBtnText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.resultCard, scanned.isVerified ? styles.verifiedCard : styles.warningCard]}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultIcon}>{scanned.isVerified ? '✅' : '⚠️'}</Text>
          <Text style={styles.resultTitle}>{scanned.isVerified ? i18n.t('verifiedMedicine') : i18n.t('fakeMedicine')}</Text>
        </View>
        <View style={styles.medicineDetails}>
          <Text style={styles.detailName}>{scanned.medicine?.name}</Text>
          <Text style={styles.detailGeneric}>{scanned.medicine?.genericName}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Manufacturer:</Text>
            <Text style={styles.detailValue}>{scanned.medicine?.manufacturer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dosage:</Text>
            <Text style={styles.detailValue}>{scanned.medicine?.dosage}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Uses:</Text>
            <Text style={styles.detailValue}>{scanned.medicine?.uses}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>When to Take:</Text>
            <Text style={styles.detailValue}>{scanned.medicine?.whenToTake}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.retryBtn} onPress={() => setScanned(null)}>
          <Text style={styles.retryBtnText}>Scan Another</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 15 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('scanMedicine')}</Text>
        <TouchableOpacity onPress={openCamera}>
          <Text style={styles.cameraBtn}>📷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter medicine name or barcode"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scanButtons}>
        <TouchableOpacity style={styles.scanBtn} onPress={openCamera}>
          <Text style={styles.scanBtnIcon}>📷</Text>
          <Text style={styles.scanBtnText}>Scan Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanBtn} onPress={pickImage}>
          <Text style={styles.scanBtnIcon}>🖼️</Text>
          <Text style={styles.scanBtnText}>Pick Image</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#4CAF50" /></View>
      ) : scanned ? (
        renderScannedResult()
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMedicineCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💊</Text>
              <Text style={styles.emptyText}>{query ? 'No medicines found' : 'Search for medicines'}</Text>
            </View>
          }
        />
      )}

      <Modal visible={cameraVisible} animationType="slide">
        <SafeAreaView style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraFrame} />
            </View>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.cameraCancelBtn} onPress={() => setCameraVisible(false)}>
                <Text style={styles.cameraCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraPickBtn} onPress={pickImage}>
                <Text style={styles.cameraPickText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cameraBtn: { fontSize: 24 },
  searchSection: { padding: 16, backgroundColor: '#fff', flexDirection: 'row', gap: 12 },
  inputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 12 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  searchBtn: { backgroundColor: '#4CAF50', width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  searchBtnText: { fontSize: 20 },
  scanButtons: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 12, backgroundColor: '#fff' },
  scanBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f5e9', borderRadius: 12, paddingVertical: 12, gap: 8 },
  scanBtnIcon: { fontSize: 20 },
  scanBtnText: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  medicineCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  medicineIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  medicineEmoji: { fontSize: 24 },
  medicineInfo: { flex: 1 },
  medicineName: { fontSize: 16, fontWeight: '600', color: '#333' },
  medicineGeneric: { fontSize: 12, color: '#666', marginTop: 2 },
  medicineMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  manufacturer: { fontSize: 12, color: '#4CAF50' },
  verified: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#666' },
  notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  notFoundIcon: { fontSize: 64, marginBottom: 16 },
  notFoundTitle: { fontSize: 20, fontWeight: 'bold', color: '#666' },
  notFoundSubtitle: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 },
  retryBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, marginTop: 20 },
  retryBtnText: { color: 'white', fontWeight: '600' },
  resultCard: { margin: 16, borderRadius: 16, overflow: 'hidden' },
  verifiedCard: { backgroundColor: '#e8f5e9', borderWidth: 2, borderColor: '#4CAF50' },
  warningCard: { backgroundColor: '#fff3cd', borderWidth: 2, borderColor: '#ffc107' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  resultIcon: { fontSize: 32, marginRight: 12 },
  resultTitle: { fontSize: 20, fontWeight: 'bold' },
  medicineDetails: { backgroundColor: 'white', padding: 16 },
  detailName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  detailGeneric: { fontSize: 14, color: '#666', marginBottom: 16 },
  detailRow: { flexDirection: 'row', marginBottom: 8 },
  detailLabel: { fontSize: 14, fontWeight: '600', color: '#666', width: 100 },
  detailValue: { flex: 1, fontSize: 14, color: '#333' },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraFrame: { width: 280, height: 280, borderWidth: 2, borderColor: '#4CAF50', borderRadius: 16, backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  cameraControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 40, backgroundColor: 'rgba(0,0,0,0.8)' },
  cameraCancelBtn: { padding: 16 },
  cameraCancelText: { color: 'white', fontSize: 16 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4CAF50' },
  cameraPickBtn: { padding: 16 },
  cameraPickText: { color: 'white', fontSize: 16 },
});
