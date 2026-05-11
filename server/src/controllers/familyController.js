import pool from '../config/db.js';

export const getFamilyMembers = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM family_members WHERE user_id = $1 ORDER BY created_at`,
      [userId]
    );

    res.json({ members: result.rows });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({ error: 'Failed to get family members' });
  }
};

export const addFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, age, gender, relation } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pool.query(
      `INSERT INTO family_members (user_id, name, age, gender, relation)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, age, gender, relation]
    );

    res.status(201).json({ member: result.rows[0] });
  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({ error: 'Failed to add family member' });
  }
};

export const updateFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, age, gender, relation } = req.body;

    const result = await pool.query(
      `UPDATE family_members SET 
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        gender = COALESCE($3, gender),
        relation = COALESCE($4, relation)
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [name, age, gender, relation, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    res.json({ member: result.rows[0] });
  } catch (error) {
    console.error('Update family member error:', error);
    res.status(500).json({ error: 'Failed to update family member' });
  }
};

export const deleteFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM family_members WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    res.json({ success: true, message: 'Family member deleted' });
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({ error: 'Failed to delete family member' });
  }
};