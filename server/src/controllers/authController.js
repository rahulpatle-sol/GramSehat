import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(config.googleClientId);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let userResult = await pool.query(
      `SELECT * FROM users WHERE google_id = $1 OR email = $2`,
      [googleId, email]
    );

    let user;
    if (userResult.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (google_id, email, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *`,
        [googleId, email, name, picture]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if (!user.avatar && picture) {
        await pool.query(`UPDATE users SET avatar = $1 WHERE id = $2`, [picture, user.id]);
        user.avatar = picture;
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        googleId: user.google_id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        pincode: user.pincode,
        village: user.village,
        district: user.district,
        state: user.state,
        role: user.role,
        language: user.language,
        trustScore: user.trust_score,
        verifiedResident: user.verified_resident,
        isProfileComplete: !!(user.name && user.pincode && user.village),
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, pincode, village, district, state, language } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        pincode = COALESCE($2, pincode),
        village = COALESCE($3, village),
        district = COALESCE($4, district),
        state = COALESCE($5, state),
        language = COALESCE($6, language),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 RETURNING *`,
      [name, pincode, village, district, state, language, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      googleId: user.google_id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      pincode: user.pincode,
      village: user.village,
      district: user.district,
      state: user.state,
      role: user.role,
      language: user.language,
      trustScore: user.trust_score,
      verifiedResident: user.verified_resident,
      isProfileComplete: !!(user.name && user.pincode && user.village),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      googleId: user.google_id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      pincode: user.pincode,
      village: user.village,
      district: user.district,
      state: user.state,
      role: user.role,
      language: user.language,
      trustScore: user.trust_score,
      verifiedResident: user.verified_resident,
      isProfileComplete: !!(user.name && user.pincode && user.village),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    await pool.query(
      `UPDATE users SET fcm_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [fcmToken, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update FCM token error:', error);
    res.status(500).json({ error: 'Failed to update FCM token' });
  }
};
