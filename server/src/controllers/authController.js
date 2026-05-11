import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const googleAuth = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let userResult = await pool.query(`SELECT * FROM users WHERE google_id = $1 OR email = $2`, [googleId, email]);

    let user;
    if (userResult.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *`,
        [name, email, googleId]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if (!user.name && name) {
        await pool.query(`UPDATE users SET name = $1 WHERE id = $2`, [name, user.id]);
        user.name = name;
      }
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        pincode: user.pincode,
        village: user.village,
        district: user.district,
        state: user.state,
        role: user.role,
        language: user.language,
        isProfileComplete: !!(user.name && user.pincode && user.village),
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3)`,
      [phone, otp, expiresAt]
    );

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const otpResult = await pool.query(
      `SELECT * FROM otps 
       WHERE phone = $1 AND otp = $2 AND used = false AND expires_at > NOW() 
       ORDER BY created_at DESC LIMIT 1`,
      [phone, otp]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await pool.query(`UPDATE otps SET used = true WHERE id = $1`, [otpResult.rows[0].id]);

    let userResult = await pool.query(`SELECT * FROM users WHERE phone = $1`, [phone]);

    let user;
    if (userResult.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (phone) VALUES ($1) RETURNING *`,
        [phone]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        pincode: user.pincode,
        village: user.village,
        district: user.district,
        state: user.state,
        role: user.role,
        language: user.language,
        isProfileComplete: !!(user.name && user.pincode && user.village),
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
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
      name: user.name,
      phone: user.phone,
      pincode: user.pincode,
      village: user.village,
      district: user.district,
      state: user.state,
      role: user.role,
      language: user.language,
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
      name: user.name,
      phone: user.phone,
      pincode: user.pincode,
      village: user.village,
      district: user.district,
      state: user.state,
      role: user.role,
      language: user.language,
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

    await pool.query(`UPDATE users SET fcm_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [fcmToken, userId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Update FCM token error:', error);
    res.status(500).json({ error: 'Failed to update FCM token' });
  }
};