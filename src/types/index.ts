export interface User {
  id: number;
  name: string | null;
  phone: string;
  pincode: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  role: 'user' | 'asha_worker' | 'admin';
  fcmToken?: string | null;
  language: 'hi' | 'en';
  isProfileComplete: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FamilyMember {
  id: number;
  userId: number;
  name: string;
  age: number | null;
  gender: 'male' | 'female' | 'other';
  relation: string | null;
  createdAt: string;
}

export interface SymptomReport {
  id: number;
  userId: number;
  memberId: number | null;
  memberName?: string;
  symptoms: string[];
  primarySymptom: string;
  severity: 1 | 2 | 3;
  pincode: string;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  reportedAt: string;
  createdAt: string;
}

export interface OutbreakAlert {
  id: number;
  pincode: string;
  district: string | null;
  state: string | null;
  symptom: string;
  reportCount: number;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved';
  ashaNotified: boolean;
  startedAt: string;
  resolvedAt: string | null;
  createdAt: string;
}

export interface Medicine {
  id: number;
  barcode: string | null;
  name: string;
  genericName: string | null;
  manufacturer: string | null;
  batchNo: string | null;
  expiryDate: string | null;
  isVerified: boolean;
  uses: string[];
  sideEffects: string[];
  dosage: string | null;
  price: number | null;
  image: string | null;
}

export interface MedicineScanResult {
  found: boolean;
  isVerified: boolean;
  medicine?: Medicine;
  message?: string;
}

export interface HealthRecord {
  id: number;
  userId: number;
  memberId: number | null;
  memberName?: string;
  type: 'checkup' | 'prescription' | 'test' | 'vaccination';
  title: string;
  description: string | null;
  doctorName: string | null;
  hospitalName: string | null;
  date: string | null;
  attachments: string[];
  createdAt: string;
}

export interface PhcCenter {
  id: number;
  name: string;
  address: string | null;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  type: 'PHC' | 'CHC' | 'hospital' | 'clinic';
  services: string[];
  timings: string | null;
  isGovt: boolean;
  distance?: number;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export interface ProfileUpdateData {
  name?: string;
  pincode?: string;
  village?: string;
  district?: string;
  state?: string;
  language?: 'hi' | 'en';
}

export interface SymptomReportData {
  symptoms: string[];
  memberId?: number | null;
  primarySymptom?: string;
  severity?: 1 | 2 | 3;
  pincode: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface HealthRecordData {
  memberId?: number | null;
  type: 'checkup' | 'prescription' | 'test' | 'vaccination';
  title: string;
  description?: string;
  doctorName?: string;
  hospitalName?: string;
  date?: string;
  attachments?: string[];
}

export interface FamilyMemberData {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  relation?: string;
}

export interface SymptomOption {
  id: string;
  labelKey: string;
  icon: string;
}

export interface SeverityLevel {
  value: 1 | 2 | 3;
  labelKey: 'severityMild' | 'severityModerate' | 'severitySevere';
  emoji: string;
  description: string;
}

export interface RecordType {
  id: 'checkup' | 'prescription' | 'test' | 'vaccination';
  labelKey: string;
  icon: string;
}