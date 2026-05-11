import pool from '../config/db.js';
import NodeCache from 'node-cache';

const alertCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const reportSymptoms = async (req, res) => {
  try {
    const { symptoms, memberId, primarySymptom, severity, pincode, lat, lng, notes } = req.body;
    const userId = req.user.id;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required' });
    }

    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    const result = await pool.query(
      `INSERT INTO symptom_reports (user_id, member_id, symptoms, primary_symptom, severity, pincode, lat, lng, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, memberId || null, symptoms, primarySymptom || symptoms[0], severity || 1, pincode, lat, lng, notes]
    );

    alertCache.del(`outbreaks_${pincode}`);

    res.status(201).json({
      success: true,
      report: result.rows[0],
      message: 'Symptom report submitted successfully',
    });
  } catch (error) {
    console.error('Report symptoms error:', error);
    res.status(500).json({ error: 'Failed to submit symptom report' });
  }
};

export const getNearbyOutbreaks = async (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    const cacheKey = `outbreaks_${pincode}`;
    const cached = alertCache.get(cacheKey);
    if (cached) {
      return res.json({ outbreaks: cached });
    }

    const result = await pool.query(
      `SELECT * FROM outbreak_alerts 
       WHERE pincode = $1 AND status = 'active'
       ORDER BY created_at DESC`,
      [pincode]
    );

    alertCache.set(cacheKey, result.rows);

    res.json({ outbreaks: result.rows });
  } catch (error) {
    console.error('Get nearby outbreaks error:', error);
    res.status(500).json({ error: 'Failed to get outbreaks' });
  }
};

export const getOutbreakHistory = async (req, res) => {
  try {
    const { pincode, limit = 20 } = req.query;

    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    const result = await pool.query(
      `SELECT * FROM outbreak_alerts 
       WHERE pincode = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [pincode, parseInt(limit)]
    );

    res.json({ outbreaks: result.rows });
  } catch (error) {
    console.error('Get outbreak history error:', error);
    res.status(500).json({ error: 'Failed to get outbreak history' });
  }
};

export const getSymptomHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT sr.*, fm.name as member_name
       FROM symptom_reports sr
       LEFT JOIN family_members fm ON sr.member_id = fm.id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
      [userId]
    );

    res.json({ reports: result.rows });
  } catch (error) {
    console.error('Get symptom history error:', error);
    res.status(500).json({ error: 'Failed to get symptom history' });
  }
};