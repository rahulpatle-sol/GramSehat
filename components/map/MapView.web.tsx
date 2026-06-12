import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Colors, Radius } from '../../constants/theme';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type?: 'user' | 'hospital' | 'PHC' | 'CHC' | 'clinic' | 'pharmacy';
}

interface MapViewProps {
  markers: MapMarker[];
  userLocation: { lat: number; lng: number };
  style?: any;
  onMarkerPress?: (marker: MapMarker) => void;
  regionDelta?: number;
}

const iconColors: Record<string, string> = {
  user: '#2563eb',
  hospital: '#dc2626',
  PHC: '#059669',
  CHC: '#7c3aed',
  clinic: '#d97706',
  pharmacy: '#0891b2',
};

function createIcon(type: string = 'hospital', isUser: boolean = false): L.DivIcon {
  const color = isUser ? iconColors.user : (iconColors[type] || '#64748b');
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${isUser ? 28 : 22}px; height: ${isUser ? 28 : 22}px;
      background: ${isUser ? '#fff' : color};
      border: 3px solid ${color};
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ${isUser ? 'background: #2563eb; border-color: #fff;' : ''}
    "><div style="
      width: ${isUser ? 12 : 8}px; height: ${isUser ? 12 : 8}px;
      background: ${isUser ? '#fff' : '#fff'};
      border-radius: 50%;
    "></div></div>`,
    iconSize: [isUser ? 28 : 22, isUser ? 28 : 22],
    iconAnchor: [isUser ? 14 : 11, isUser ? 14 : 11],
  });
}

function MapController({ markers, userLocation, onMarkerPress }: {
  markers: MapMarker[];
  userLocation: { lat: number; lng: number };
  onMarkerPress?: (marker: MapMarker) => void;
}) {
  const map = useMap();
  const initialFit = useRef(true);

  useEffect(() => {
    if (initialFit.current && markers.length > 0) {
      const allPoints = [userLocation, ...markers.map(m => ({ lat: m.lat, lng: m.lng }))];
      const bounds = L.latLngBounds(allPoints.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      initialFit.current = false;
    }
  }, [markers, userLocation, map]);

  return null;
}

export default function MapView({ markers, userLocation, style, onMarkerPress }: MapViewProps) {
  return (
    <View style={[styles.container, style]}>
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        style={{ height: '100%', width: '100%', borderRadius: Radius.lg }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController markers={markers} userLocation={userLocation} onMarkerPress={onMarkerPress} />

        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createIcon('user', true)}
        >
          <Popup>You are here</Popup>
        </Marker>

        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createIcon(marker.type || 'hospital', false)}
            eventHandlers={onMarkerPress ? {
              click: () => onMarkerPress(marker),
            } : undefined}
          >
            <Popup>
              <strong>{marker.title}</strong>
              {marker.subtitle && <br />}
              {marker.subtitle && <span style={{ fontSize: 12, color: '#666' }}>{marker.subtitle}</span>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: Radius.lg, overflow: 'hidden' },
});
