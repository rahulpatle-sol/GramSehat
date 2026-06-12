import pool from '../config/db.js';
import { fetchNearbyWithExpansion } from '../services/overpass.js';

export const getNearbyPhc = async (req, res) => {
  try {
    const { lat, lng, radius = 20, pincode, type } = req.query;

    if (pincode) {
      let query = `SELECT * FROM phc_centers WHERE pincode = $1`;
      const params = [pincode];

      if (type) {
        query += ` AND type = $2`;
        params.push(type);
      }

      query += ` ORDER BY type, name`;
      const result = await pool.query(query, params);
      return res.json({ centers: result.rows });
    }

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location coordinates or pincode is required' });
    }

    const latFloat = parseFloat(lat);
    const lngFloat = parseFloat(lng);
    const radiusFloat = parseFloat(radius);

    // Fetch from local DB with haversine
    const dbResult = await pool.query(
      `SELECT *,
        (6371 * acos(
          LEAST(1.0, GREATEST(-1.0,
            COS(RADIANS($1)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS($2)) +
            SIN(RADIANS($1)) * SIN(RADIANS(lat))
          ))
        )) AS distance
       FROM phc_centers
       ORDER BY distance
       LIMIT 50`,
      [latFloat, lngFloat]
    );

    let centers = dbResult.rows.map(c => ({
      ...c,
      source: 'local',
    }));

    // Augment with Overpass API results
    try {
      const osmResult = await fetchNearbyWithExpansion(latFloat, lngFloat, radiusFloat);
      if (osmResult.centers.length > 0) {
        const merged = [...centers, ...osmResult.centers];
        const seen = new Set();
        centers = merged.filter(c => {
          const key = c.name.toLowerCase().trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        centers.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }
    } catch (osmErr) {
      console.error('Overpass augmentation failed:', osmErr.message);
    }

    res.json({ centers: centers.slice(0, 50) });
  } catch (error) {
    console.error('Get nearby PHC error:', error);
    res.status(500).json({ error: 'Failed to get nearby PHC centers' });
  }
};

export const getPhcDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const isOsm = req.query.source === 'osm';

    if (isOsm) {
      return res.status(400).json({ error: 'OSM details not available via this endpoint' });
    }

    const result = await pool.query(`SELECT * FROM phc_centers WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PHC center not found' });
    }

    res.json({ center: result.rows[0] });
  } catch (error) {
    console.error('Get PHC details error:', error);
    res.status(500).json({ error: 'Failed to get PHC details' });
  }
};

export const searchPhc = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    let query = `SELECT * FROM phc_centers WHERE 1=1`;
    const params = [];

    if (q) {
      query += ` AND (name ILIKE $1 OR address ILIKE $1)`;
      params.push(`%${q}%`);
    }

    if (type) {
      query += params.length > 0 ? ` AND type = $${params.length + 1}` : ` AND type = $1`;
      params.push(type);
    }

    query += ` ORDER BY is_govt DESC, name LIMIT 50`;

    const result = await pool.query(query, params);
    res.json({ centers: result.rows });
  } catch (error) {
    console.error('Search PHC error:', error);
    res.status(500).json({ error: 'Failed to search PHC centers' });
  }
};
