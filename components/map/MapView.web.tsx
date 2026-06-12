import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function loadCSS(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(link);
  });
}

export default function MapView({ markers, userLocation, style, onMarkerPress }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      await loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
      await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

      if (cancelled || !mapRef.current) return;

      await new Promise(resolve => setTimeout(resolve, 50));

      const L = (window as any).L;
      if (!L) {
        console.error('Leaflet not loaded');
        return;
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      function makeIcon(type: string, isUser: boolean) {
        const color = isUser ? iconColors.user : (iconColors[type] || '#64748b');
        return L.divIcon({
          className: '',
          html: `<div style="
            width: ${isUser ? 28 : 22}px; height: ${isUser ? 28 : 22}px;
            background: ${isUser ? '#2563eb' : color};
            border: 3px solid ${isUser ? '#fff' : color};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "><div style="
            width: ${isUser ? 12 : 8}px; height: ${isUser ? 12 : 8}px;
            background: #fff;
            border-radius: 50%;
          "></div></div>`,
          iconSize: [isUser ? 28 : 22, isUser ? 28 : 22],
          iconAnchor: [isUser ? 14 : 11, isUser ? 14 : 11],
        });
      }

      L.marker([userLocation.lat, userLocation.lng], {
        icon: makeIcon('user', true),
      }).addTo(map).bindPopup('You are here');

      markers.forEach(marker => {
        if (!marker.lat || !marker.lng) return;
        L.marker([marker.lat, marker.lng], {
          icon: makeIcon(marker.type || 'hospital', false),
        }).addTo(map)
          .bindPopup(`<strong>${marker.title}</strong>${marker.subtitle ? `<br/><span style="font-size:12px;color:#666">${marker.subtitle}</span>` : ''}`)
          .on('click', () => onMarkerPress?.(marker));
      });

      if (markers.length > 0) {
        const points = [userLocation, ...markers].filter(m => m.lat && m.lng);
        if (points.length > 0) {
          const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        }
      }

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [markers, userLocation]);

  return (
    <View style={[styles.container, style]}>
      <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: Radius.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: Radius.lg, overflow: 'hidden' },
});
