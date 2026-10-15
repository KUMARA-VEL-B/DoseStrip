export type NavigationPage = 
  | 'Dashboard'
  | 'My Medicines'
  | 'Healthcare'
  | 'History'
  | 'Profile & Settings';

export type MedicineCategory = 
  | 'Pain Relief'
  | 'Supplement'
  | 'Diabetes'
  | 'Blood Pressure'
  | 'Antibiotics'
  | 'Cardiology';

export type ReminderStatus = 'Taken' | 'Upcoming' | 'Pending' | 'Snoozed' | 'Skipped' | 'Missed';

export interface Medicine {
  id: string;
  name: string;
  category: MedicineCategory;
  dosage: string;
  frequency: string;
  instructions: string;
  status: 'Active' | 'Inactive' | 'Completed';
  startDate: string;
  endDate?: string;
  reminderTimes: string[];
  pillColor: 'pink' | 'amber' | 'blue' | 'purple' | 'emerald';
  pillType: 'tablet' | 'capsule';
}

export interface ScheduleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  instructions: string;
  scheduledTime: string; // e.g. "08:00 AM"
  status: ReminderStatus;
  pillColor: 'pink' | 'amber' | 'blue' | 'purple' | 'emerald';
  takenAt?: string;
  notes?: string;
}

export interface ReminderHistoryRecord {
  id: string;
  medicineName: string;
  category: MedicineCategory;
  dosage: string;
  date: string; // e.g. "2026-10-10"
  dateLabel: string; // e.g. "Today, 10 Oct 2026"
  time: string; // e.g. "08:00 AM"
  status: ReminderStatus;
  note: string; // e.g. "Taken on time"
  pillColor: 'pink' | 'amber' | 'blue' | 'purple' | 'emerald';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  hospital: string;
  location: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  availableToday: boolean;
  avatarUrl: string;
  consultationFee: string;
  bio: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Nutrition' | 'Exercise' | 'Chronic Care' | 'Mental Health' | 'Medicine Tips' | 'General Health';
  readTime: string;
  imageUrl: string;
  author: string;
  publishedDate: string;
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string;
  status: 'Active' | 'Pending' | 'Inactive';
  email: string;
  phone: string;
  avatarInitials: string;
}

export interface UserProfile {
  name: string;
  role: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  location: string;
  medicalConditions: string[];
  allergies: string[];
  avatarUrl: string;
}

export interface NotificationSettings {
  medicineReminders: boolean;
  reminderSound: string;
  pushNotifications: boolean;
  emailReminders: boolean;
  smsReminders: boolean;
}

export interface AppPreferences {
  theme: 'Light' | 'Dark' | 'System';
  language: string;
  dateFormat: string;
  timeFormat: string;
  units: string;
}

export interface SecuritySettings {
  biometricLogin: boolean;
  twoFactorAuth: boolean;
}
