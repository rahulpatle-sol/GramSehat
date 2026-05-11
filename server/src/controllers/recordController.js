import pool from '../config/db.js';

export const getHealthRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.query;

    let query = `
      SELECT hr.*, fm.name as member_name
      FROM health_records hr
      LEFT JOIN family_members fm ON hr.member_id = fm.id
      WHERE hr.user_id = $1
    `;
    const params = [userId];

    if (memberId) {
      query += ` AND hr.member_id = $2`;
      params.push(memberId);
    }

    query += ` ORDER BY hr.date DESC`;

    const result = await pool.query(query, params);

    res.json({ records: result.rows });
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({ error: 'Failed to get health records' });
  }
};

export const addHealthRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId, type, title, description, doctorName, hospitalName, date, attachments } = req.body;

    if (!type || !title) {
      return res.status(400).json({ error: 'Type and title are required' });
    }

    const result = await pool.query(
      `INSERT INTO health_records (user_id, member_id, type, title, description, doctor_name, hospital_name, date, attachments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, memberId || null, type, title, description, doctorName, hospitalName, date, attachments || []]
    );

    res.status(201).json({ record: result.rows[0] });
  } catch (error) {
    console.error('Add health record error:', error);
    res.status(500).json({ error: 'Failed to add health record' });
  }
};

export const getHealthRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT hr.*, fm.name as member_name
       FROM health_records hr
       LEFT JOIN family_members fm ON hr.member_id = fm.id
       WHERE hr.id = $1 AND hr.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    res.json({ record: result.rows[0] });
  } catch (error) {
    console.error('Get health record error:', error);
    res.status(500).json({ error: 'Failed to get health record' });
  }
};

export const deleteHealthRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM health_records WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    res.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({ error: 'Failed to delete health record' });
  }
};