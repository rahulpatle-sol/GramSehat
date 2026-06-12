import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // 24h cache (addresses rarely change)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export async function reverseGeocode(lat, lng) {
  const cacheKey = `geo_${lat}_${lng}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=14&accept-language=hi`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'GramSehat/1.0 (health-app)' },
    });
    const data = await resp.json();

    if (!data || data.error) {
      throw new Error(data?.error || 'Nominatim returned no results');
    }

    const addr = data.address || {};
    const result = {
      pincode: addr.postcode || null,
      village: addr.village || addr.town || addr.city_district || addr.city || addr.municipality || null,
      district: addr.county || addr.district || addr.state_district || null,
      state: addr.state || null,
      country: addr.country || null,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      displayName: data.display_name || null,
    };

    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Nominatim reverse geocode error:', err.message);
    throw err;
  }
}

export async function searchLocation(query) {
  if (!query || query.length < 3) return [];

  const cacheKey = `search_${query}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `${NOMINATIM_URL}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&accept-language=hi`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'GramSehat/1.0 (health-app)' },
    });
    const data = await resp.json();

    const results = (data || []).map(item => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      pincode: item.address?.postcode || null,
      village: item.address?.village || item.address?.town || item.address?.city || null,
      district: item.address?.county || item.address?.district || null,
      state: item.address?.state || null,
    }));

    cache.set(cacheKey, results);
    return results;
  } catch (err) {
    console.error('Nominatim search error:', err.message);
    return [];
  }
}
