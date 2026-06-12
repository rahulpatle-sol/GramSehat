import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PhcCenter } from '../types';

const CACHE_KEYS = {
  NEARBY_HOSPITALS: 'cache_nearby_hospitals',
  LAST_LOCATION: 'cache_last_location',
  LAST_UPDATED: 'cache_last_updated',
};

const CACHE_TTL_MS = 30 * 60 * 1000;

export const offlineCache = {
  async saveNearbyHospitals(lat: number, lng: number, centers: PhcCenter[]): Promise<void> {
    const payload = {
      lat,
      lng,
      centers,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.NEARBY_HOSPITALS, JSON.stringify(payload));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_LOCATION, JSON.stringify({ lat, lng }));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATED, String(Date.now()));
  },

  async getNearbyHospitals(lat: number, lng: number): Promise<{
    centers: PhcCenter[];
    fromCache: boolean;
  } | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.NEARBY_HOSPITALS);
      if (!raw) return null;

      const cached = JSON.parse(raw);
      const age = Date.now() - cached.timestamp;
      const isStale = age > CACHE_TTL_MS;

      return {
        centers: cached.centers || [],
        fromCache: !isStale,
      };
    } catch {
      return null;
    }
  },

  async getLastLocation(): Promise<{ lat: number; lng: number } | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.LAST_LOCATION);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async clearCache(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
  },
};
