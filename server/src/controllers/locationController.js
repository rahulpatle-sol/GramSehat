import { reverseGeocode, searchLocation } from '../services/nominatim.js';
import { getDirections, getRouteMatrix } from '../services/openrouteservice.js';
import { fetchNearbyHospitals } from '../services/overpass.js';

export async function reverseGeocodeHandler(req, res) {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters are required' });
    }

    const latFloat = parseFloat(lat);
    const lngFloat = parseFloat(lng);

    if (isNaN(latFloat) || isNaN(lngFloat)) {
      return res.status(400).json({ error: 'Invalid lat/lng values' });
    }

    const result = await reverseGeocode(latFloat, lngFloat);
    res.json(result);
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode location' });
  }
}

export async function searchLocationHandler(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.length < 3) {
      return res.status(400).json({ error: 'Query parameter q must be at least 3 characters' });
    }

    const results = await searchLocation(q);
    res.json({ results });
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
}

export async function getRouteHandler(req, res) {
  try {
    const { originLat, originLng, destLat, destLng, profile } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ error: 'originLat, originLng, destLat, destLng are required' });
    }

    const route = await getDirections(
      parseFloat(originLat), parseFloat(originLng),
      parseFloat(destLat), parseFloat(destLng),
      profile || 'driving-car'
    );

    res.json(route);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Failed to get route' });
  }
}

export async function getRouteMatrixHandler(req, res) {
  try {
    const { originLat, originLng } = req.query;
    let destinations = req.body?.destinations;

    if (!originLat || !originLng || !destinations || !Array.isArray(destinations)) {
      return res.status(400).json({ error: 'originLat, originLng, and destinations array are required' });
    }

    const matrix = await getRouteMatrix(
      parseFloat(originLat), parseFloat(originLng),
      destinations
    );

    res.json({ routes: matrix });
  } catch (error) {
    console.error('Route matrix error:', error);
    res.status(500).json({ error: 'Failed to get route matrix' });
  }
}

// Convenience: get reverse geocode + nearby hospitals in one call
export async function getLocationDetails(req, res) {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const latFloat = parseFloat(lat);
    const lngFloat = parseFloat(lng);
    const radiusFloat = parseFloat(radius || '20');

    const [geo, hospitals] = await Promise.all([
      reverseGeocode(latFloat, lngFloat),
      fetchNearbyHospitals(latFloat, lngFloat, radiusFloat),
    ]);

    res.json({
      location: geo,
      hospitals: hospitals.slice(0, 20),
    });
  } catch (error) {
    console.error('Location details error:', error);
    res.status(500).json({ error: 'Failed to get location details' });
  }
}
