import pool from '../config/db.js';

const phcCenters = [
  {
    name: 'Primary Health Center - Bela',
    address: 'Main Road, Bela Village',
    pincode: '224201',
    lat: 26.8721,
    lng: 82.1987,
    phone: '9450001234',
    type: 'PHC',
    services: ['General Medicine', 'Maternity Care', 'Vaccination', 'First Aid'],
    timings: '9:00 AM - 4:00 PM',
    is_govt: true,
  },
  {
    name: 'Community Health Center - Jalalpur',
    address: 'Market Road, Jalalpur',
    pincode: '224201',
    lat: 26.8756,
    lng: 82.2034,
    phone: '9450002345',
    type: 'CHC',
    services: ['General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics', 'Emergency Care'],
    timings: '24x7',
    is_govt: true,
  },
  {
    name: 'District Hospital - Ambedkar Nagar',
    address: 'Civil Lines, Akbarpur',
    pincode: '224149',
    lat: 26.5107,
    lng: 82.6824,
    phone: '9450003456',
    type: 'hospital',
    services: ['All Departments', 'Emergency', 'ICU', 'Operation Theater', 'Laboratory', 'Pharmacy'],
    timings: '24x7',
    is_govt: true,
  },
  {
    name: 'Dr. Sharma Clinic',
    address: 'Near Bus Stand, Tanda',
    pincode: '224190',
    lat: 26.5578,
    lng: 82.6521,
    phone: '9450004567',
    type: 'clinic',
    services: ['General Medicine', 'Dental Care'],
    timings: '10:00 AM - 6:00 PM',
    is_govt: false,
  },
  {
    name: 'Government Allopathic Dispensary - Katehri',
    address: 'Village Katehri, Main Chowk',
    pincode: '224146',
    lat: 26.6234,
    lng: 82.4532,
    phone: '9450005678',
    type: 'PHC',
    services: ['First Aid', 'Basic Medicines', 'Family Planning'],
    timings: '8:00 AM - 2:00 PM',
    is_govt: true,
  },
  {
    name: 'Primary Health Center - Rajesul',
    address: 'Rajesul, Near Temple',
    pincode: '224147',
    lat: 26.7534,
    lng: 82.5234,
    phone: '9450006789',
    type: 'PHC',
    services: ['General Medicine', 'Maternity Care', 'Child Health'],
    timings: '9:00 AM - 5:00 PM',
    is_govt: true,
  },
];

async function seedPhcCenters() {
  try {
    for (const center of phcCenters) {
      await pool.query(
        `INSERT INTO phc_centers (name, address, pincode, lat, lng, phone, type, services, timings, is_govt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [
          center.name,
          center.address,
          center.pincode,
          center.lat,
          center.lng,
          center.phone,
          center.type,
          center.services,
          center.timings,
          center.is_govt,
        ]
      );
    }
    console.log('PHC centers seeded successfully');
  } catch (error) {
    console.error('Error seeding PHC centers:', error);
  } finally {
    process.exit();
  }
}

seedPhcCenters();