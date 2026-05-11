import pool from '../config/db.js';

export const scanMedicine = async (req, res) => {
  try {
    const { barcode } = req.params;

    if (!barcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }

    const result = await pool.query(
      `SELECT * FROM medicines WHERE barcode = $1`,
      [barcode]
    );

    if (result.rows.length === 0) {
      return res.json({
        found: false,
        message: 'Medicine not found in database',
        isVerified: false,
      });
    }

    const medicine = result.rows[0];
    res.json({
      found: true,
      isVerified: medicine.is_verified,
      medicine: {
        id: medicine.id,
        barcode: medicine.barcode,
        name: medicine.name,
        genericName: medicine.generic_name,
        manufacturer: medicine.manufacturer,
        batchNo: medicine.batch_no,
        expiryDate: medicine.expiry_date,
        isVerified: medicine.is_verified,
        uses: medicine.uses,
        sideEffects: medicine.side_effects,
        dosage: medicine.dosage,
        price: medicine.price,
        image: medicine.image,
      },
    });
  } catch (error) {
    console.error('Scan medicine error:', error);
    res.status(500).json({ error: 'Failed to scan medicine' });
  }
};

export const searchMedicines = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const result = await pool.query(
      `SELECT * FROM medicines 
       WHERE name ILIKE $1 OR generic_name ILIKE $1 OR barcode ILIKE $1
       ORDER BY is_verified DESC, name
       LIMIT $2`,
      [`%${q}%`, parseInt(limit)]
    );

    res.json({ medicines: result.rows });
  } catch (error) {
    console.error('Search medicines error:', error);
    res.status(500).json({ error: 'Failed to search medicines' });
  }
};

export const addMedicine = async (req, res) => {
  try {
    const { barcode, name, genericName, manufacturer, batchNo, expiryDate, uses, sideEffects, dosage, price } = req.body;

    if (!barcode || !name) {
      return res.status(400).json({ error: 'Barcode and name are required' });
    }

    const result = await pool.query(
      `INSERT INTO medicines (barcode, name, generic_name, manufacturer, batch_no, expiry_date, uses, side_effects, dosage, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (barcode) DO UPDATE SET
         name = EXCLUDED.name,
         generic_name = EXCLUDED.generic_name,
         manufacturer = EXCLUDED.manufacturer
       RETURNING *`,
      [barcode, name, genericName, manufacturer, batchNo, expiryDate, uses || [], sideEffects || [], dosage, price]
    );

    res.status(201).json({ medicine: result.rows[0] });
  } catch (error) {
    console.error('Add medicine error:', error);
    res.status(500).json({ error: 'Failed to add medicine' });
  }
};