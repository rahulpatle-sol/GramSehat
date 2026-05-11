# GramSehat Backend

## Quick Setup

### 1. Create `.env` file
```bash
cp .env.example .env
```

### 2. Fill in your Neon DB credentials
Edit `.env`:
```
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_NAME=gramsehat
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true
```

### 3. Update JWT Secret
```bash
JWT_SECRET=make_this_long_and_random_32_chars_minimum
```

### 4. Run the server
```bash
npm start
```

Server will:
- Connect to Neon PostgreSQL
- Auto-create all tables
- Seed PHC centers
- Start on port 5000

### API Base URL
```
http://localhost:5000/api
```

## Endpoints

### Auth
- POST `/api/auth/send-otp` - Send OTP
- POST `/api/auth/verify-otp` - Verify OTP & login
- PUT `/api/auth/profile` - Update profile
- GET `/api/auth/profile` - Get profile

### Symptoms
- POST `/api/symptoms/report` - Report symptoms
- GET `/api/symptoms/history` - Get symptom history

### Outbreak
- GET `/api/outbreak/nearby?pincode=XXXXXX` - Get active outbreaks
- GET `/api/outbreak/history?pincode=XXXXXX` - Get outbreak history

### Medicine
- GET `/api/medicine/scan/:barcode` - Scan medicine
- GET `/api/medicine/search?q=name` - Search medicines

### Records
- GET `/api/records` - Get health records
- POST `/api/records` - Add record
- DELETE `/api/records/:id` - Delete record

### Family
- GET `/api/family` - Get family members
- POST `/api/family` - Add member
- DELETE `/api/family/:id` - Delete member

### PHC
- GET `/api/phc/nearby?pincode=XXXXXX` - Get nearby centers
- GET `/api/phc/:id` - Get center details

## Testing with Postman

Import `GramSehat-API.postman_collection.json` into Postman.