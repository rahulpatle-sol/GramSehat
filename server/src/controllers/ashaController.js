import pool from '../config/db.js';

export const getAshaAlerts = async (req, res) => {
  try {
    const userId = req.user.id;

    const ashaResult = await pool.query(
      `SELECT * FROM asha_workers WHERE user_id = $1`,
      [userId]
    );

    if (ashaResult.rows.length === 0) {
      return res.status(403).json({ error: 'User is not an ASHA worker' });
    }

    const asha = ashaResult.rows[0];
    const pincodes = asha.pincodes;

    const result = await pool.query(
      `SELECT * FROM outbreak_alerts 
       WHERE pincode = ANY($1) AND status = 'active'
       ORDER BY created_at DESC`,
      [pincodes]
    );

    res.json({ alerts: result.rows });
  } catch (error) {
    console.error('Get ASHA alerts error:', error);
    res.status(500).json({ error: 'Failed to get ASHA alerts' });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const ashaResult = await pool.query(
      `SELECT * FROM asha_workers WHERE user_id = $1`,
      [userId]
    );

    if (ashaResult.rows.length === 0) {
      return res.status(403).json({ error: 'User is not an ASHA worker' });
    }

    const alertResult = await pool.query(
      `UPDATE outbreak_alerts 
       SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (alertResult.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ alert: alertResult.rows[0] });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
};

export const getAshaReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const ashaResult = await pool.query(
      `SELECT * FROM asha_workers WHERE user_id = $1`,
      [userId]
    );

    if (ashaResult.rows.length === 0) {
      return res.status(403).json({ error: 'User is not an ASHA worker' });
    }

    const asha = ashaResult.rows[0];

    const result = await pool.query(
      `SELECT sr.*, u.name as user_name, u.phone as user_phone
       FROM symptom_reports sr
       JOIN users u ON sr.user_id = u.id
       WHERE sr.pincode = ANY($1)
       ORDER BY sr.created_at DESC
       LIMIT 100`,
      [asha.pincodes]
    );

    res.json({ reports: result.rows });
  } catch (error) {
    console.error('Get ASHA reports error:', error);
    res.status(500).json({ error: 'Failed to get ASHA reports' });
  }
};