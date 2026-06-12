import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Platform, StatusBar, Linking, Alert,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import Animated, { FadeInDown, FadeInUp, BounceIn, Layout } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { phcApi } from '../../src/api';
import { locationApi } from '../../src/api/location';
import type { PhcCenter } from '../../src/types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../constants/theme';
import { AnimatedPressable, StaggerItem } from '../../components/animated';
import MapView from '../../components/map/MapView';
import { offlineCache } from '../../src/utils/offlineCache';

type FilterType = 'all' | 'PHC' | 'CHC' | 'hospital' | 'clinic' | 'pharmacy';
type SortType = 'distance' | 'name';

const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Ionicons name="location-outline" size={14} color="#fff" /> },
  { key: 'hospital', label: 'Hospitals', icon: <MaterialCommunityIcons name="hospital-building" size={14} color="#fff" /> },
  { key: 'PHC', label: 'PHC', icon: <MaterialCommunityIcons name="medical-bag" size={14} color="#fff" /> },
  { key: 'CHC', label: 'CHC', icon: <Ionicons name="business-outline" size={14} color="#fff" /> },
  { key: 'clinic', label: 'Clinics', icon: <MaterialCommunityIcons name="stethoscope" size={14} color="#fff" /> },
  { key: 'pharmacy', label: 'Pharmacy', icon: <MaterialCommunityIcons name="pill" size={14} color="#fff" /> },
];

function formatDistance(km: number): string {
  if (!km && km !== 0) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

function getLat(center: PhcCenter): number | null {
  return center.lat || center.location?.lat || null;
}

function getLng(center: PhcCenter): number | null {
  return center.lng || center.location?.lng || null;
}

export default function HospitalsScreen() {
  const [centers, setCenters] = useState<PhcCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('distance');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
  const [showMap, setShowMap] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routeLoading, setRouteLoading] = useState<string | null>(null);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => { getLocation(); }, []);

  const getLocation = async () => {
    try {
      setLocationStatus('loading');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationStatus('granted');
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const pos = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        setUserLocation(pos);
        await loadByLocation(pos.lat, pos.lng);
      } else {
        setLocationStatus('denied');
        setLoading(false);
      }
    } catch (err) {
      setLocationStatus('denied');
      setLoading(false);
    }
  };

  const loadByLocation = async (lat: number, lng: number) => {
    try {
      const result = await phcApi.getNearby(lat, lng, 20);
      const fetched = result.centers || [];
      setCenters(fetched);
      offlineCache.saveNearbyHospitals(lat, lng, fetched);
    } catch (err) {
      console.error('Location load error:', err);
      const cached = await offlineCache.getNearbyHospitals(lat, lng);
      if (cached && cached.centers.length > 0) {
        setCenters(cached.centers);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRouteInfo(null);
    if (userLocation) {
      await loadByLocation(userLocation.lat, userLocation.lng);
    } else {
      await getLocation();
    }
  }, [userLocation]);

  const handleCall = (phone: string | null | undefined) => {
    if (phone) Linking.openURL(`tel:${phone}`);
    else Alert.alert('Info', 'No phone number available');
  };

  const handleDirections = async (center: PhcCenter) => {
    const lat = getLat(center);
    const lng = getLng(center);
    if (!lat || !lng || !userLocation) {
      Alert.alert('Info', 'Location not available for directions');
      return;
    }

    const key = `${center.name}`;
    setRouteLoading(key);
    setRouteInfo(null);

    try {
      const route = await locationApi.getRoute(userLocation.lat, userLocation.lng, lat, lng);
      if (route.error || !route.summary) {
        Linking.openURL(`https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${lat},${lng}`);
      } else {
        setRouteInfo(route.summary);
        Linking.openURL(`https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${lat},${lng}`);
      }
    } catch {
      Linking.openURL(`https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${lat},${lng}`);
    } finally {
      setRouteLoading(null);
    }
  };

  const openInOSM = () => {
    if (!userLocation || centers.length === 0) return;
    const center = centers[0];
    const lat = getLat(center);
    const lng = getLng(center);
    if (lat && lng) {
      Linking.openURL(`https://www.openstreetmap.org/?mlat=${userLocation.lat}&mlon=${userLocation.lng}&zoom=14`);
    }
  };

  const filteredCenters = (() => {
    let result = activeFilter === 'all'
      ? [...centers]
      : centers.filter(c => c.type === activeFilter);

    switch (activeSort) {
      case 'distance':
        result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  })();

  const mapMarkers = userLocation ? [
    {
      id: 'user',
      lat: userLocation.lat,
      lng: userLocation.lng,
      title: 'You are here',
      type: 'user' as const,
    },
    ...filteredCenters.map((c, i) => ({
      id: `center-${i}`,
      lat: getLat(c) || 0,
      lng: getLng(c) || 0,
      title: c.name,
      subtitle: `${formatDistance(c.distance || 0)}`,
      type: (c.type === 'PHC' || c.type === 'CHC' || c.type === 'hospital' || c.type === 'clinic' || c.type === 'pharmacy' ? c.type : 'hospital') as any,
    })),
  ] : [];

  const renderCard = ({ item, index }: { item: PhcCenter; index: number }) => {
    const dist = item.distance;
    const isOsm = item.source === 'osm';

    return (
      <StaggerItem index={index}>
        <Animated.View entering={BounceIn.delay(index * 50)} layout={Layout.springify()}>
          <AnimatedPressable style={styles.card} onPress={() => {}}>
            <View style={styles.cardTop}>
              <View style={[styles.cardIconWrap, { backgroundColor: isOsm ? '#f0fdf4' : Colors.primaryLight }]}>
                <MaterialCommunityIcons
                  name={item.type === 'hospital' ? 'hospital-building' : item.type === 'pharmacy' ? 'pill' : item.type === 'clinic' ? 'stethoscope' : 'medical-bag'}
                  size={22}
                  color={isOsm ? '#059669' : Colors.primary}
                />
              </View>
              <View style={styles.cardInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                  {isOsm && (
                    <View style={styles.osmBadge}>
                      <Text style={styles.osmBadgeText}>OSM</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardTypeRow}>
                  <View style={[styles.typeBadge, { backgroundColor: isOsm ? '#f0fdf4' : '#e0f2fe' }]}>
                    <Text style={[styles.typeText, { color: isOsm ? '#059669' : '#0284c7' }]}>
                      {item.type?.toUpperCase()}
                    </Text>
                  </View>
                  {item.isGovt && (
                    <View style={styles.govtBadge}>
                      <Text style={styles.govtText}>Govt</Text>
                    </View>
                  )}
                  {isOsm && (
                    <View style={styles.osmSourceBadge}>
                      <MaterialCommunityIcons name="open-source-initiative" size={10} color="#059669" />
                      <Text style={styles.osmSourceText}>OSM</Text>
                    </View>
                  )}
                </View>
              </View>
              {dist !== undefined && dist !== null && (
                <View style={styles.distanceBadge}>
                  <Ionicons name="location-outline" size={12} color={Colors.primary} />
                  <Text style={styles.distanceBadgeText}>{formatDistance(dist)}</Text>
                </View>
              )}
            </View>

            {item.address && (
              <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
            )}

            {item.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{item.phone}</Text>
              </View>
            )}

            <View style={styles.actionRow}>
              <AnimatedPressable
                style={[styles.actionBtn, { backgroundColor: Colors.primaryLight }]}
                onPress={() => handleCall(item.phone)}
              >
                <Ionicons name="call-outline" size={16} color={Colors.primary} />
                <Text style={[styles.actionLabel, { color: Colors.primary }]}>Call</Text>
              </AnimatedPressable>

              <AnimatedPressable
                style={[styles.actionBtn, { backgroundColor: '#ede9fe' }]}
                onPress={() => handleDirections(item)}
              >
                {routeLoading === `${item.name}` ? (
                  <ActivityIndicator size="small" color="#7c3aed" />
                ) : (
                  <Ionicons name="navigate-outline" size={16} color="#7c3aed" />
                )}
                <Text style={[styles.actionLabel, { color: '#7c3aed' }]}>Directions</Text>
              </AnimatedPressable>
            </View>

            {routeInfo && (
              <View style={styles.routeInfoBar}>
                <Ionicons name="time-outline" size={14} color="#059669" />
                <Text style={styles.routeInfoText}>
                  {routeInfo.distance} · {routeInfo.duration}
                </Text>
              </View>
            )}
          </AnimatedPressable>
        </Animated.View>
      </StaggerItem>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.mapToggleBar}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AnimatedPressable
            style={[styles.toggleBtn, !showMap && styles.toggleBtnActive]}
            onPress={() => { setShowMap(false); setRouteInfo(null); }}
          >
            <Ionicons name="list-outline" size={16} color={!showMap ? '#fff' : '#64748b'} />
            <Text style={[styles.toggleText, !showMap && styles.toggleTextActive]}>List</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.toggleBtn, showMap && styles.toggleBtnActive]}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map-outline" size={16} color={showMap ? '#fff' : '#64748b'} />
            <Text style={[styles.toggleText, showMap && styles.toggleTextActive]}>Map</Text>
          </AnimatedPressable>
        </View>
        <TouchableOpacity style={styles.multiRouteBtn} onPress={openInOSM}>
          <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
          <Text style={styles.multiRouteText}>OpenStreetMap</Text>
        </TouchableOpacity>
      </View>

      {userLocation && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.distanceBar}>
          <Ionicons name="locate-outline" size={14} color={Colors.primaryDark} />
          <Text style={styles.distanceBarText}>
            {centers.length} centers found within 20 km
          </Text>
        </Animated.View>
      )}

      {locationStatus === 'denied' && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.permissionBar}>
          <Ionicons name="alert-circle-outline" size={16} color="#92400e" />
          <Text style={styles.permissionText}>  Enable location for nearby results</Text>
        </Animated.View>
      )}

      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const selected = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
              style={[styles.filterChip, selected && styles.filterChipActive]}
            >
              {f.icon && React.cloneElement(f.icon as React.ReactElement, {
                color: selected ? '#fff' : '#64748b',
                size: 14,
              })}
              <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        {(['distance', 'name'] as SortType[]).map(s => (
          <TouchableOpacity
            key={s}
            onPress={() => setActiveSort(s)}
            style={[styles.sortChip, activeSort === s && styles.sortChipActive]}
          >
            <Text style={[styles.sortChipText, activeSort === s && styles.sortChipTextActive]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.emptyWrap}>
      <MaterialCommunityIcons name="hospital-marker" size={80} color={Colors.textTertiary} />
      <Text style={styles.emptyText}>
        {loading ? 'Finding nearby centers...' : 'No centers found'}
      </Text>
      <Text style={styles.emptySub}>
        {locationStatus === 'denied'
          ? 'Enable location access or try searching by pincode'
          : 'Try expanding the search radius or check back later'}
      </Text>
      {locationStatus === 'denied' && (
        <AnimatedPressable
          style={styles.retryBtn}
          onPress={() => Linking.openSettings()}
        >
          <Ionicons name="settings-outline" size={18} color="#fff" />
          <Text style={styles.retryText}>Open Settings</Text>
        </AnimatedPressable>
      )}
    </Animated.View>
  );

  if (showMap) {
    const visibleMarkers = mapMarkers.filter(m => m.lat && m.lng);
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
        <View style={styles.mapHeader}>
          <Text style={styles.mapHeaderTitle}>
            {filteredCenters.length} healthcare centers
          </Text>
          <AnimatedPressable
            style={styles.mapCloseBtn}
            onPress={() => setShowMap(false)}
          >
            <Ionicons name="list-outline" size={20} color="#fff" />
            <Text style={styles.mapCloseText}>List</Text>
          </AnimatedPressable>
        </View>
        {userLocation && (
          <MapView
            markers={visibleMarkers}
            userLocation={userLocation}
            onMarkerPress={(marker) => {
              if (marker.type !== 'user') {
                Alert.alert(marker.title, marker.subtitle || '');
              }
            }}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <Animated.View entering={FadeInDown.duration(300)}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nearby Healthcare</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
            <Ionicons name="refresh-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding nearby healthcare centers...</Text>
          <Text style={styles.loadingSub}>Using GPS and OpenStreetMap</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCenters}
          keyExtractor={(item, idx) => item.osmId ? `osm-${item.osmId}` : `local-${item.id}-${idx}`}
          renderItem={renderCard}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          onScroll={RNAnimated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  headerTitle: { ...Typography.h2, color: Colors.text },
  refreshBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  distanceBar: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
  },
  distanceBarText: { ...Typography.small, color: Colors.primaryDark, fontWeight: '500', marginLeft: 6 },
  permissionBar: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: '#fef3c7', borderRadius: Radius.md,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 3, borderLeftColor: '#f59e0b',
  },
  permissionText: { ...Typography.small, color: '#92400e', fontWeight: '500' },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm, gap: 8, flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: '#f1f5f9',
    borderWidth: 1.5, borderColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterChipTextActive: { color: '#ffffff' },
  sortRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  sortLabel: { ...Typography.small, color: Colors.textSecondary, marginRight: 4 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.sm, backgroundColor: '#f1f5f9' },
  sortChipActive: { backgroundColor: Colors.primaryLight },
  sortChipText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  sortChipTextActive: { color: Colors.primaryDark },
  mapToggleBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: '#f1f5f9',
  },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  toggleTextActive: { color: '#fff' },
  multiRouteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: Colors.primaryLight,
  },
  multiRouteText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xxl },
  loadingText: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.lg, textAlign: 'center' },
  loadingSub: { ...Typography.small, color: Colors.textTertiary, marginTop: Spacing.sm },
  listContent: { paddingBottom: 100 },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.xl,
    padding: Spacing.lg, marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md, ...Shadow.md,
  },
  cardTop: { flexDirection: 'row', marginBottom: Spacing.md, alignItems: 'flex-start' },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  cardInfo: { flex: 1 },
  cardName: { ...Typography.bodyBold, color: Colors.text, flexShrink: 1 },
  osmBadge: {
    backgroundColor: '#f0fdf4', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  osmBadgeText: { fontSize: 10, fontWeight: '700', color: '#059669' },
  cardTypeRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  typeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
  typeText: { fontSize: 11, fontWeight: '600' },
  govtBadge: { backgroundColor: '#dbeafe', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
  govtText: { fontSize: 11, fontWeight: '600', color: '#1d4ed8' },
  osmSourceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: '#f0fdf4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm,
  },
  osmSourceText: { fontSize: 10, fontWeight: '600', color: '#059669' },
  distanceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radius.full, marginLeft: Spacing.sm,
  },
  distanceBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  addressText: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  infoText: { ...Typography.small, color: Colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md, borderRadius: Radius.lg, gap: Spacing.sm,
  },
  actionLabel: { ...Typography.captionBold },
  routeInfoBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: Spacing.sm, backgroundColor: '#f0fdf4',
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  routeInfoText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  emptyWrap: { alignItems: 'center', padding: Spacing.xxxl * 2, paddingTop: 80 },
  emptyText: { ...Typography.h3, color: Colors.text, textAlign: 'center' },
  emptySub: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md, borderRadius: Radius.lg, marginTop: Spacing.xl,
  },
  retryText: { ...Typography.captionBold, color: '#fff' },
  mapHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  mapHeaderTitle: { ...Typography.bodyBold, color: Colors.text },
  mapCloseBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: Radius.full,
  },
  mapCloseText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});
