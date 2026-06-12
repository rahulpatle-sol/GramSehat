import pool from './db.js';

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255),
  name VARCHAR(255),
  avatar TEXT,
  pincode VARCHAR(10),
  village VARCHAR(255),
  district VARCHAR(255),
  state VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  fcm_token TEXT,
  language VARCHAR(10) DEFAULT 'hi',
  trust_score INTEGER DEFAULT 10,
  verified_resident BOOLEAN DEFAULT FALSE,
  last_report_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  relation VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS symptom_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  symptoms TEXT[] NOT NULL,
  primary_symptom VARCHAR(100),
  severity INTEGER DEFAULT 1,
  pincode VARCHAR(10),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  notes TEXT,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outbreak_alerts (
  id SERIAL PRIMARY KEY,
  pincode VARCHAR(10) NOT NULL,
  district VARCHAR(255),
  state VARCHAR(255),
  symptom VARCHAR(100) NOT NULL,
  report_count INTEGER DEFAULT 0,
  severity VARCHAR(20) DEFAULT 'low',
  status VARCHAR(20) DEFAULT 'active',
  asha_notified BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicines (
  id SERIAL PRIMARY KEY,
  barcode VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  manufacturer VARCHAR(255),
  batch_no VARCHAR(100),
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  uses TEXT[],
  side_effects TEXT[],
  dosage TEXT,
  price DECIMAL(10, 2),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  doctor_name VARCHAR(255),
  hospital_name VARCHAR(255),
  date DATE,
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asha_workers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pincodes TEXT[] NOT NULL,
  registration_id VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  district VARCHAR(255),
  state VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phc_centers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  pincode VARCHAR(10),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  phone VARCHAR(20),
  type VARCHAR(50) DEFAULT 'PHC',
  services TEXT[],
  timings VARCHAR(100),
  is_govt BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_symptom_reports_pincode ON symptom_reports(pincode);
CREATE INDEX IF NOT EXISTS idx_symptom_reports_created_at ON symptom_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_outbreak_alerts_pincode ON outbreak_alerts(pincode);
CREATE INDEX IF NOT EXISTS idx_outbreak_alerts_status ON outbreak_alerts(status);
CREATE INDEX IF NOT EXISTS idx_medicines_barcode ON medicines(barcode);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
`;

const phcCenters = [
  { name: 'Primary Health Center - Bela', address: 'Main Road, Bela Village', pincode: '224201', lat: 26.8721, lng: 82.1987, phone: '9450001234', type: 'PHC', services: ['General Medicine', 'Maternity Care', 'Vaccination', 'First Aid'], timings: '9:00 AM - 4:00 PM', is_govt: true },
  { name: 'Community Health Center - Jalalpur', address: 'Market Road, Jalalpur', pincode: '224201', lat: 26.8756, lng: 82.2034, phone: '9450002345', type: 'CHC', services: ['General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics', 'Emergency Care'], timings: '24x7', is_govt: true },
  { name: 'District Hospital - Ambedkar Nagar', address: 'Civil Lines, Akbarpur', pincode: '224149', lat: 26.5107, lng: 82.6824, phone: '9450003456', type: 'hospital', services: ['All Departments', 'Emergency', 'ICU', 'Operation Theater', 'Laboratory', 'Pharmacy'], timings: '24x7', is_govt: true },
  { name: 'Dr. Sharma Clinic', address: 'Near Bus Stand, Tanda', pincode: '224190', lat: 26.5578, lng: 82.6521, phone: '9450004567', type: 'clinic', services: ['General Medicine', 'Dental Care'], timings: '10:00 AM - 6:00 PM', is_govt: false },
  { name: 'Government Allopathic Dispensary - Katehri', address: 'Village Katehri, Main Chowk', pincode: '224146', lat: 26.6234, lng: 82.4532, phone: '9450005678', type: 'PHC', services: ['First Aid', 'Basic Medicines', 'Family Planning'], timings: '8:00 AM - 2:00 PM', is_govt: true },
  { name: 'Primary Health Center - Rajesul', address: 'Rajesul, Near Temple', pincode: '224147', lat: 26.7534, lng: 82.5234, phone: '9450006789', type: 'PHC', services: ['General Medicine', 'Maternity Care', 'Child Health'], timings: '9:00 AM - 5:00 PM', is_govt: true },
];

async function initDB() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to Neon PostgreSQL!');
    await client.query(schema);
    console.log('Schema created successfully!');

    // Remove duplicate PHC centers keeping only the oldest
    await client.query(`
      DELETE FROM phc_centers a USING phc_centers b
      WHERE a.id > b.id AND a.name = b.name AND a.pincode = b.pincode
    `);
    console.log('PHC duplicates cleaned');

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_phc_centers_name_pincode ON phc_centers(name, pincode)
    `);
    console.log('PHC unique index created');

    for (const center of phcCenters) {
      await client.query(
        `INSERT INTO phc_centers (name, address, pincode, lat, lng, phone, type, services, timings, is_govt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [center.name, center.address, center.pincode, center.lat, center.lng, center.phone, center.type, center.services, center.timings, center.is_govt]
      );
    }
    console.log('PHC centers seeded!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

export default initDB;
