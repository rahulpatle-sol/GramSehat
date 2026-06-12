const ORS_BASE = 'https://api.openrouteservice.org/v2';

export async function getDirections(originLat, originLng, destLat, destLng, profile = 'driving-car') {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return { error: 'ORS_API_KEY not configured', summary: null };
  }

  try {
    const url = `${ORS_BASE}/directions/${profile}?api_key=${apiKey}&start=${originLng},${originLat}&end=${destLng},${destLat}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!data || data.error) {
      throw new Error(data?.error?.message || 'ORS returned no route');
    }

    const route = data.features?.[0];
    if (!route) throw new Error('No route found');

    const props = route.properties;
    const segments = props.segments || [];
    const summary = segments[0] || {};
    const geometry = route.geometry;

    return {
      distance: summary.distance || 0,
      duration: summary.duration || 0,
      distanceKm: Math.round((summary.distance || 0) / 100) / 10,
      durationMinutes: Math.round((summary.duration || 0) / 60),
      geometry: geometry?.coordinates || [],
      polyline: geometry,
      summary: {
        distance: `${Math.round((summary.distance || 0) / 100) / 10} km`,
        duration: `${Math.round((summary.duration || 0) / 60)} min`,
      },
    };
  } catch (err) {
    console.error('ORS directions error:', err.message);
    return { error: err.message, summary: null };
  }
}

export async function getRouteMatrix(originLat, originLng, destinations, profile = 'driving-car') {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey || !destinations || destinations.length === 0) {
    return [];
  }

  try {
    const coords = [[originLng, originLat], ...destinations.map(d => [d.lng, d.lat])];
    const body = {
      locations: coords,
      sources: [0],
      destinations: destinations.map((_, i) => i + 1),
      metrics: ['distance', 'duration'],
    };

    const resp = await fetch(`${ORS_BASE}/matrix/${profile}?api_key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();

    if (!data || data.error) return [];

    const distances = data.distances?.[0] || [];
    const durations = data.durations?.[0] || [];

    return destinations.map((dest, i) => ({
      destination: dest.name,
      distanceKm: distances[i] ? Math.round(distances[i] / 100) / 10 : null,
      durationMinutes: durations[i] ? Math.round(durations[i] / 60) : null,
    }));
  } catch (err) {
    console.error('ORS matrix error:', err.message);
    return [];
  }
}
