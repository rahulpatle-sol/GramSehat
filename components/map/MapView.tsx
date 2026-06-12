import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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

export default function MapView(props: MapViewProps) {
  const [LoadedMap, setLoadedMap] = React.useState<React.ComponentType<MapViewProps> | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      import('./MapView.web').then(mod => {
        setLoadedMap(() => mod.default);
      });
    }
  }, []);

  if (!LoadedMap) {
    return (
      <View style={[styles.container, props.style]}>
        <View style={styles.placeholder}>
          <View style={styles.loadingText}>Loading map...</View>
        </View>
      </View>
    );
  }

  return <LoadedMap {...props} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: Radius.lg, overflow: 'hidden' },
  placeholder: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  loadingText: { color: Colors.textSecondary, fontSize: 14 },
});
