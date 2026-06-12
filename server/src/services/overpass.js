import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const OSM_TYPES = [
  'node["amenity"="hospital"]',
  'node["amenity"="clinic"]',
  'node["amenity"="doctors"]',
  'node["healthcare"="pharmacy"]',
  'node["amenity"="pharmacy"]',
];

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function fetchNearbyHospitals(lat, lng, radiusKm = 20) {
  const cacheKey = `overpass_${lat}_${lng}_${radiusKm}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const radiusM = radiusKm * 1000;
  const query = `[out:json];
(
  ${OSM_TYPES.join('\n  ')}
)(around:${radiusM},${lat},${lng});
out center 50;`;

  try {
    const resp = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });
    const data = await resp.json();

    const mapped = (data.elements || []).map(el => {
      const elementLat = el.lat || el.center?.lat;
      const elementLng = el.lon || el.center?.lon;
      const tags = el.tags || {};

      return {
        osmId: el.id,
        name: tags.name || tags.amenity || tags.healthcare || 'Unknown',
        address: [
          tags['addr:full'] || tags['addr:street'] || '',
          tags['addr:village'] || tags['addr:city'] || '',
          tags['addr:district'] || '',
        ].filter(Boolean).join(', ') || tags.display_name || '',
        phone: tags.phone || tags['contact:phone'] || null,
        type: mapType(tags),
        distance: haversine(lat, lng, elementLat, elementLng),
        location: { lat: elementLat, lng: elementLng },
        openNow: tags['opening_hours'] ? true : null,
        rating: null,
        source: 'osm',
      };
    });

    const seen = new Set();
    const unique = mapped.filter(r => {
      const key = r.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort((a, b) => a.distance - b.distance);
    cache.set(cacheKey, unique);
    return unique;
  } catch (err) {
    console.error('Overpass API error:', err.message);
    throw err;
  }
}

export async function fetchNearbyWithExpansion(lat, lng, radius = 20) {
  const radii = [radius, 50, 100];
  for (const r of radii) {
    try {
      const results = await fetchNearbyHospitals(lat, lng, r);
      if (results.length > 0) return { centers: results, expanded: r > radius, radiusUsed: r };
    } catch (err) {
      console.error(`Overpass radius ${r}km failed:`, err.message);
    }
  }
  return { centers: [], expanded: false, radiusUsed: 100 };
}

function mapType(tags) {
  const amenity = tags.amenity || '';
  const healthcare = tags.healthcare || '';
  if (amenity === 'hospital') return 'hospital';
  if (amenity === 'clinic') return 'clinic';
  if (amenity === 'doctors') return 'clinic';
  if (amenity === 'pharmacy' || healthcare === 'pharmacy') return 'pharmacy';
  if (healthcare) return healthcare;
  return 'hospital';
}

export function clearOverpassCache() {
  cache.flushAll();
}
