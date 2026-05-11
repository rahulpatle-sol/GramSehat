## 1. PROJECT OVERVIEW

**App Name:** GramSehat  
**Platform:** Android only (React Native)  
**Language:** Hindi + English (i18n support)  
**Core Innovation:** Hyperlocal crowd-based disease outbreak detection  
**Target Users:** Rural India — villages, small towns, tier-3 cities  

### Mission
Help rural users check symptoms, find nearby healthcare, detect local outbreaks early, verify medicines, and maintain family health records — all with offline-first support.

---

## 2. TECH STACK

### Frontend
- React Native (Android)
- React Navigation v6 (Stack + Bottom Tabs)
- Redux Toolkit (global state)
- React Query / TanStack Query (API data)
- react-native-maps (Google Maps)
- react-native-camera / vision-camera (barcode scan)
- SQLite via react-native-sqlite-storage (offline DB)
- AsyncStorage (tokens, prefs)
- react-native-localize + i18n-js (Hindi/English)
- Lottie (animations)
- react-native-vector-icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Redis (outbreak alert caching, rate limiting)
- Firebase Cloud Messaging (push notifications)
- JWT (auth)
- Multer + Cloudinary (image uploads)
- node-cron (scheduled outbreak scan job)
- Twilio (OTP via SMS — no email needed for rural users)

### Infrastructure
- Backend: Railway or Render (free tier to start)
- DB: MongoDB Atlas (free tier)
- Cache: node cache  (built  in)
- Storage: Cloudinary (free tier)

---

## 3. SYSTEM DESIGN

```
[Android App]
     │
     ├── Offline Layer (SQLite)
     │     └── Syncs when internet available
     │
     ├── REST API ──► [Node.js + Express]
     │                     │
     │               ┌─────┴──────┐
     │           [MongoDB]     [node cahce ]
     │                     │
     │              [Cron Job - runs every 6hrs]
     │              Scans symptom_reports collection
     │              Groups by pincode + symptom + 48hr window
     │              If count > THRESHOLD → creates outbreak alert
     │              Sends FCM push to users in that pincode
     │              Notifies ASHA worker linked to that pincode
     │
     └── Push Notifications ◄── [Firebase FCM]
```

### Outbreak Detection Logic
```
Every 6 hours, cron job runs:
  FOR each pincode:
    reports = symptom_reports WHERE
      pincode = X AND
      createdAt > (now - 48hrs) AND
      synced = true
    
    GROUP BY primary_symptom
    
    IF any symptom_group.count >= 10:
      CREATE outbreak_alert {
        pincode, symptom, count, severity
      }
      NOTIFY all users in pincode
      NOTIFY ASHA worker of pincode
```

### Offline Sync Logic
```
App starts:
  1. Load data from SQLite (instant)
  2. If internet: sync pending local records to server
  3. Pull fresh data from server → update SQLite
  4. Show UI from SQLite always (offline-first)
```

---

## 4. DATABASE SCHEMA (MongoDB)

### users
```js
{
  _id, name, phone, pincode, village, district, state,
  role: ['user', 'asha_worker', 'admin'],
  fcmToken, language: 'hi'|'en',
  familyMembers: [{ name, age, gender, relation }],
  createdAt, updatedAt
}
```

### symptom_reports
```js
{
  _id, userId, memberId (null = self),
  symptoms: ['fever', 'vomiting', 'cough'],   // array
  primarySymptom: String,
  severity: 1|2|3,
  pincode, lat, lng,
  notes: String,
  reportedAt, createdAt
}
```

### outbreak_alerts
```js
{
  _id, pincode, district, state,
  symptom: String,
  reportCount: Number,
  severity: 'low'|'medium'|'high',
  status: 'active'|'resolved',
  ashaNotified: Boolean,
  startedAt, resolvedAt, createdAt
}
```

### medicines
```js
{
  _id, barcode, name, genericName,
  manufacturer, batchNo, expiryDate,
  isVerified: Boolean,
  uses: [String], sideEffects: [String],
  dosage: String, price: Number,
  image: String (cloudinary url)
}
```

### health_records
```js
{
  _id, userId, memberId,
  type: 'checkup'|'prescription'|'test'|'vaccination',
  title, description,
  doctorName, hospitalName,
  date, attachments: [String],
  createdAt
}
```

### asha_workers
```js
{
  _id, userId, pincodes: [String],   // covers multiple pincodes
  registrationId, isVerified,
  district, state, phone
}
```

### phc_centers (static seed data)
```js
{
  _id, name, address, pincode,
  lat, lng, phone,
  type: 'PHC'|'CHC'|'hospital'|'clinic',
  services: [String],
  timings: String, isGovt: Boolean
}
```

---

## 5. API ENDPOINTS

### Auth
```
POST   /api/auth/send-otp        body: { phone }
POST   /api/auth/verify-otp      body: { phone, otp } → { token, user }
PUT    /api/auth/profile          body: { name, pincode, village, language }
```

### Symptoms & Outbreak
```
POST   /api/symptoms/report       body: { symptoms[], severity, pincode, lat, lng }
GET    /api/outbreak/nearby       query: { pincode } → active outbreaks
GET    /api/outbreak/history      query: { pincode, limit }
```

### Medicine
```
GET    /api/medicine/scan/:barcode → medicine details + verified status
GET    /api/medicine/search       query: { q } → search by name
```

### Health Records
```
GET    /api/records               → user's all records
POST   /api/records               body: { type, title, date, ... }
DELETE /api/records/:id
POST   /api/records/upload        multipart → cloudinary url
```

### PHC / Hospitals
```
GET    /api/phc/nearby            query: { lat, lng, radius=20 } → sorted by distance
GET    /api/phc/:id               → details
```

### Family
```
GET    /api/family                → family members list
POST   /api/family                body: { name, age, gender, relation }
PUT    /api/family/:id
DELETE /api/family/:id
```

### ASHA Worker
```
GET    /api/asha/alerts           → outbreak alerts in my pincodes
PUT    /api/asha/alert/:id/resolve
GET    /api/asha/reports          → symptom reports in my pincodes
```

---

## 6. REACT NATIVE SCREENS

### Auth Flow (Stack)
```
SplashScreen
  └── OnboardingScreen (language select + intro slides)
        └── PhoneScreen (enter phone)
              └── OTPScreen (verify)
                    └── ProfileSetupScreen (name, pincode, village)
```

### Main App (Bottom Tabs)
```
Tab 1: Home
  ├── HomeScreen
  │     ├── OutbreakBannerCard (if active alert in pincode)
  │     ├── QuickSymptomCheck button
  │     ├── FamilyHealthSummary
  │     └── NearbyPHC (top 2)
  └── OutbreakDetailScreen

Tab 2: Symptoms
  ├── SymptomCheckerScreen
  │     ├── Step 1: Select family member (or self)
  │     ├── Step 2: Pick symptoms (visual icons)
  │     ├── Step 3: Severity slider
  │     └── Step 4: Submit + AI suggestion
  └── SymptomHistoryScreen

Tab 3: Medicine
  ├── MedicineScanScreen (camera barcode)
  ├── MedicineResultScreen (verified/fake + details)
  └── MedicineSearchScreen

Tab 4: Records
  ├── HealthRecordsScreen (by family member)
  ├── AddRecordScreen
  └── RecordDetailScreen

Tab 5: Profile
  ├── ProfileScreen
  ├── FamilyMembersScreen
  ├── LanguageSettingScreen
  └── NearbyHospitalsScreen (full map)
```

---

## 7. FOLDER STRUCTURE

### React Native
```
src/
  api/          axios instance + all API functions
  components/   reusable UI components
  navigation/   RootNavigator, MainTabs, AuthStack
  screens/      one folder per screen
  store/        Redux store + slices
  db/           SQLite setup + local queries
  utils/        helpers, formatters, constants
  i18n/         hi.json + en.json translation files
  hooks/        custom hooks
  assets/       images, lottie files
```

### Node.js Backend
```
src/
  controllers/  one per resource
  routes/       one per resource
  models/       mongoose schemas
  middleware/   auth, error handler, rate limiter
  services/     outbreak detector, FCM, OTP
  jobs/         cron job for outbreak scan
  utils/        helpers
  config/       db, redis, cloudinary config
  seed/         PHC center seed data
```

---

## 8. KEY FEATURES — IMPLEMENTATION NOTES

### Symptom Icons (visual, no reading required)
Use emoji or custom icon for each symptom:
fever🤒, cough😷, vomiting🤢, diarrhea, headache🤕, rash, fatigue, chest pain

### Offline First
- SQLite tables: users, symptom_reports (pending), health_records, phc_centers, outbreak_alerts
- On submit: save to SQLite first → try API → if fail, mark as pending
- Background sync: NetInfo listener → when online, flush pending records

### Language Toggle
- All UI strings in hi.json and en.json
- Store preference in AsyncStorage
- useTranslation() hook everywhere

### Medicine Barcode Scan
- Use react-native-vision-camera + MLKit barcode
- GET /api/medicine/scan/:barcode
- Show: Name, manufacturer, verified tick or FAKE warning, uses, dosage

### Outbreak Severity
- LOW: 10–19 reports in 48hrs
- MEDIUM: 20–49 reports
- HIGH: 50+ reports → also SMS to district health officer

---

## 9. ENV VARIABLES

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
REDIS_URL=...
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
TWILIO_SID=...
TWILIO_TOKEN=...
TWILIO_PHONE=...
FCM_SERVER_KEY=...
OUTBREAK_THRESHOLD=10
OUTBREAK_WINDOW_HRS=48
```

### React Native (.env)
```
API_BASE_URL=https://your-backend.railway.app
GOOGLE_MAPS_KEY=...
```

---

## 10. DEVELOPMENT ORDER (Build This Sequence)

```
Week 1:  Backend setup → Auth (OTP) → User model → PHC seed data
Week 2:  Symptom report API → Outbreak cron job → FCN alerts
Week 3:  RN Auth screens → Home + Symptom checker UI
Week 4:  Medicine scanner → Health records → Offline SQLite sync
Week 5:  ASHA worker dashboard → Maps → Hindi translations
Week 6:  Testing → Play Store build (EAS) → Deploy backend
```

---

## 11. PROMPT TO START CODING

Paste this after the spec when prompting an AI to code:

> "Using the spec above, start with the Node.js backend.
> Create the full project structure, install dependencies,
> setup Express server, MongoDB connection, and implement
> the Auth module (send-otp, verify-otp, profile) with
> Twilio SMS OTP and JWT. Use ES modules."

---

*Built for Bharat. GramSehat — Swasth Gaon, Swasth Desh 🇮🇳*