import { apiClient } from '../../app/src/api/client';

export interface ReverseGeocodeResult {
  pincode: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  lat: number;
  lng: number;
  displayName: string | null;
}

export interface RouteResult {
  distance?: number;
  duration?: number;
  distanceKm?: number;
  durationMinutes?: number;
  geometry?: number[][];
  summary?: {
    distance: string;
    duration: string;
  } | null;
  error?: string | null;
}

export interface OsmHospital {
  osmId: number;
  name: string;
  address: string;
  phone: string | null;
  type: string;
  distance: number;
  location: { lat: number; lng: number };
  openNow: boolean | null;
  rating: null;
  source: 'osm';
}

export const locationApi = {
  reverseGeocode: async (lat: number, lng: number): Promise<ReverseGeocodeResult> => {
    return apiClient.get<ReverseGeocodeResult>(`/location/reverse-geocode?lat=${lat}&lng=${lng}`);
  },

  searchLocation: async (q: string): Promise<{ results: ReverseGeocodeResult[] }> => {
    return apiClient.get<{ results: ReverseGeocodeResult[] }>(`/location/search?q=${encodeURIComponent(q)}`);
  },

  getRoute: async (
    originLat: number, originLng: number,
    destLat: number, destLng: number,
    profile: string = 'driving-car'
  ): Promise<RouteResult> => {
    return apiClient.get<RouteResult>(
      `/location/route?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}&profile=${profile}`
    );
  },

  getLocationDetails: async (lat: number, lng: number, radius: number = 20): Promise<{
    location: ReverseGeocodeResult;
    hospitals: OsmHospital[];
  }> => {
    return apiClient.get<{
      location: ReverseGeocodeResult;
      hospitals: OsmHospital[];
    }>(`/location/details?lat=${lat}&lng=${lng}&radius=${radius}`);
  },
};
