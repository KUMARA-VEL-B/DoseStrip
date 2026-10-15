import { 
  Medicine, 
  ScheduleItem, 
  ReminderHistoryRecord, 
  Doctor, 
  HealthArticle, 
  UserProfile, 
  Caregiver, 
  NotificationSettings, 
  AppPreferences, 
  SecuritySettings 
} from '../types';

import bgImage from '../assets/images/medicine_pills_background_1791863611398.jpg';
import avatarKumaravel from '../assets/images/avatar_kumaravel_1791863611259.jpg';
import doctorArvind from '../assets/images/doctor_arvind_kumar_1791863643606.jpg';
import doctorPriya from '../assets/images/doctor_priya_sharma_1791863644859.jpg';
import doctorPatel from '../assets/images/doctor_rn_patel_1791863799610.jpg';
import doctorAnanya from '../assets/images/doctor_ananya_iyer_1791863800364.jpg';
import articleDiet from '../assets/images/article_healthy_diet_1791863644711.jpg';
import articleExercise from '../assets/images/article_exercise_1791863800592.jpg';
import dosestripLogo from '../assets/images/dosestrip_logo_1791867797626.jpg';

export const ASSET_PATHS = {
  logo: dosestripLogo,
  background: bgImage,
  avatar: avatarKumaravel,
  doctors: {
    arvind: doctorArvind,
    priya: doctorPriya,
    patel: doctorPatel,
    ananya: doctorAnanya,
  },
  articles: {
    diet: articleDiet,
    exercise: articleExercise,
  }
};

export const INITIAL_USER: UserProfile = {
  name: 'Kumaravel',
  role: 'Patient',
  fullName: 'Kumaravel B',
  dateOfBirth: '15 Mar 2003',
  gender: 'Male',
  phone: '+91 98765 43210',
  email: 'kumaravelb@example.com',
  location: 'Chennai, Tamil Nadu, India',
  medicalConditions: ['Diabetes', 'Blood Pressure'],
  allergies: ['None'],
  avatarUrl: avatarKumaravel,
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol',
    category: 'Pain Relief',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    instructions: '1 tablet after breakfast',
    status: 'Active',
    startDate: '2026-10-01',
    reminderTimes: ['08:00 AM', '08:00 PM'],
    pillColor: 'pink',
    pillType: 'tablet',
  },
  {
    id: 'med-2',
    name: 'Vitamin D3',
    category: 'Supplement',
    dosage: '1 capsule',
    frequency: 'Once daily',
    instructions: '1 capsule with water',
    status: 'Active',
    startDate: '2024-07-10',
    reminderTimes: ['12:00 PM'],
    pillColor: 'amber',
    pillType: 'capsule',
  },
  {
    id: 'med-3',
    name: 'Metformin',
    category: 'Diabetes',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    instructions: '1 tablet after dinner',
    status: 'Active',
    startDate: '2026-05-15',
    reminderTimes: ['08:00 AM', '08:00 PM'],
    pillColor: 'blue',
    pillType: 'tablet',
  },
  {
    id: 'med-4',
    name: 'Amlodipine',
    category: 'Blood Pressure',
    dosage: '1 tablet',
    frequency: 'Once daily',
    instructions: '1 tablet once daily',
    status: 'Active',
    startDate: '2026-02-01',
    reminderTimes: ['09:00 AM'],
    pillColor: 'purple',
    pillType: 'tablet',
  },
];

export const INITIAL_TODAY_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sched-1',
    medicineId: 'med-1',
    medicineName: 'Medicine A', // Reference shows Medicine A (Paracetamol)
    dosage: '1 tablet after breakfast',
    instructions: '1 tablet after breakfast',
    scheduledTime: '08:00 AM',
    status: 'Taken',
    pillColor: 'pink',
    takenAt: '08:05 AM',
  },
  {
    id: 'sched-2',
    medicineId: 'med-2',
    medicineName: 'Vitamin D',
    dosage: '1 capsule with water',
    instructions: '1 capsule with water',
    scheduledTime: '12:00 PM',
    status: 'Upcoming',
    pillColor: 'amber',
  },
  {
    id: 'sched-3',
    medicineId: 'med-3',
    medicineName: 'Medicine C',
    dosage: '1 tablet after dinner',
    instructions: '1 tablet after dinner',
    scheduledTime: '08:00 PM',
    status: 'Upcoming',
    pillColor: 'blue',
  },
];

export const INITIAL_HISTORY: ReminderHistoryRecord[] = [
  // Today, 10 Oct 2026
  {
    id: 'hist-1',
    medicineName: 'Paracetamol',
    category: 'Pain Relief',
    dosage: '1 tablet',
    date: '2026-10-10',
    dateLabel: 'Today, 10 Oct 2026',
    time: '08:00 AM',
    status: 'Taken',
    note: 'Taken on time',
    pillColor: 'pink',
  },
  {
    id: 'hist-2',
    medicineName: 'Vitamin D3',
    category: 'Supplement',
    dosage: '1 capsule',
    date: '2026-10-10',
    dateLabel: 'Today, 10 Oct 2026',
    time: '12:00 PM',
    status: 'Snoozed',
    note: 'Snoozed to 12:30 PM',
    pillColor: 'amber',
  },
  {
    id: 'hist-3',
    medicineName: 'Metformin',
    category: 'Diabetes',
    dosage: '1 tablet',
    date: '2026-10-10',
    dateLabel: 'Today, 10 Oct 2026',
    time: '08:00 PM',
    status: 'Pending',
    note: 'Upcoming reminder',
    pillColor: 'blue',
  },
  // Yesterday, 09 Oct 2026
  {
    id: 'hist-4',
    medicineName: 'Amlodipine',
    category: 'Blood Pressure',
    dosage: '1 tablet',
    date: '2026-10-09',
    dateLabel: 'Yesterday, 09 Oct 2026',
    time: '09:00 AM',
    status: 'Skipped',
    note: 'Skipped by user',
    pillColor: 'purple',
  },
  {
    id: 'hist-5',
    medicineName: 'Vitamin D3',
    category: 'Supplement',
    dosage: '1 capsule',
    date: '2026-10-09',
    dateLabel: 'Yesterday, 09 Oct 2026',
    time: '12:00 PM',
    status: 'Taken',
    note: 'Taken 5 min late',
    pillColor: 'amber',
  },
  // 08 Oct 2026
  {
    id: 'hist-6',
    medicineName: 'Paracetamol',
    category: 'Pain Relief',
    dosage: '1 tablet',
    date: '2026-10-08',
    dateLabel: '08 Oct 2026',
    time: '08:00 AM',
    status: 'Taken',
    note: 'Taken on time',
    pillColor: 'pink',
  },
  {
    id: 'hist-7',
    medicineName: 'Metformin',
    category: 'Diabetes',
    dosage: '1 tablet',
    date: '2026-10-08',
    dateLabel: '08 Oct 2026',
    time: '08:00 PM',
    status: 'Missed',
    note: 'No response',
    pillColor: 'blue',
  },
  // 07 Oct 2026
  {
    id: 'hist-8',
    medicineName: 'Vitamin D3',
    category: 'Supplement',
    dosage: '1 capsule',
    date: '2026-10-07',
    dateLabel: '07 Oct 2026',
    time: '12:00 PM',
    status: 'Taken',
    note: 'Taken on time',
    pillColor: 'amber',
  },
  {
    id: 'hist-9',
    medicineName: 'Amlodipine',
    category: 'Blood Pressure',
    dosage: '1 tablet',
    date: '2026-10-07',
    dateLabel: '07 Oct 2026',
    time: '09:00 AM',
    status: 'Taken',
    note: 'Taken on time',
    pillColor: 'purple',
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Arvind Kumar',
    specialty: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    hospital: 'Apollo Hospitals, Chennai',
    location: 'Greams Road, Chennai',
    rating: 4.8,
    reviewCount: 320,
    experienceYears: 10,
    availableToday: true,
    avatarUrl: doctorArvind,
    consultationFee: '₹800',
    bio: 'Senior consultant in Internal Medicine with comprehensive expertise in preventive health checkups, chronic disease management, and fever diagnosis.',
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    degree: 'MBBS, MD (Cardiology)',
    hospital: 'Fortis Hospital, Chennai',
    location: 'Vadapalani, Chennai',
    rating: 4.7,
    reviewCount: 250,
    experienceYears: 8,
    availableToday: true,
    avatarUrl: doctorPriya,
    consultationFee: '₹1,200',
    bio: 'Specialist in clinical and preventive cardiology, hypertension protocols, echocardiography, and lifestyle heart disease risk reduction.',
  },
  {
    id: 'doc-3',
    name: 'Dr. R. N. Patel',
    specialty: 'Endocrinologist',
    degree: 'MBBS, MD (Endocrinology)',
    hospital: 'MIOT International, Chennai',
    location: 'Manapakkam, Chennai',
    rating: 4.6,
    reviewCount: 180,
    experienceYears: 12,
    availableToday: true,
    avatarUrl: doctorPatel,
    consultationFee: '₹1,000',
    bio: 'Specializes in Type 1 & 2 diabetes management, thyroid disorders, metabolic health assessments, and hormone balance counseling.',
  },
  {
    id: 'doc-4',
    name: 'Dr. Ananya Iyer',
    specialty: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    hospital: 'Kauvery Hospital, Chennai',
    location: 'Alwarpet, Chennai',
    rating: 4.5,
    reviewCount: 210,
    experienceYears: 9,
    availableToday: true,
    avatarUrl: doctorAnanya,
    consultationFee: '₹900',
    bio: 'Consultant dermatologist treating allergic reactions, eczema, drug eruptions, psoriasis, and clinical medical cosmetology.',
  },
];

export const INITIAL_ARTICLES: HealthArticle[] = [
  {
    id: 'art-1',
    title: 'Healthy Diet for a Stronger Heart',
    excerpt: 'Learn how a balanced diet can improve heart health and overall well-being.',
    category: 'Nutrition',
    readTime: '4 min read',
    imageUrl: articleDiet,
    author: 'Dr. Priya Sharma, Cardiologist',
    publishedDate: '02 Oct 2026',
    content: `A heart-healthy diet is one of the most effective strategies for preventing cardiovascular disease and supporting sustained vitality.

Key Dietary Guidelines:
1. Emphasize Whole Foods: Fill half your plate with colorful vegetables and whole fruits rich in flavonoids, potassium, and dietary fiber.
2. Healthy Unsaturated Fats: Incorporate extra virgin olive oil, avocados, and omega-3 fatty acids from walnuts and flaxseeds to naturally lower LDL cholesterol.
3. Sodium Awareness: Aim for under 2,000 mg of sodium per day, especially if taking antihypertensive medications such as Amlodipine.
4. Consistent Meal Timing: Eating at regular intervals promotes steady glucose metabolism and supports your prescribed medication schedule.`,
  },
  {
    id: 'art-2',
    title: 'Benefits of Regular Exercise',
    excerpt: 'Discover how simple exercises can boost your physical and mental health.',
    category: 'Exercise',
    readTime: '5 min read',
    imageUrl: articleExercise,
    author: 'Medical Wellness Team',
    publishedDate: '28 Sep 2026',
    content: `Moderate physical exercise delivers remarkable systemic benefits for cardiovascular endurance, insulin sensitivity, and mood regulation.

Recommended Routine:
- 150 minutes of moderate-intensity aerobic physical activity per week (such as brisk walking, swimming, or cycling).
- Two weekly sessions of resistance training to preserve bone density and muscle mass.
- Consistency over intensity: Even a 20-minute daily walk after dinner significantly assists glycemic control in individuals managing diabetes.`,
  },
  {
    id: 'art-3',
    title: 'Managing Blood Pressure',
    excerpt: 'Tips and lifestyle changes to keep your blood pressure under control.',
    category: 'Chronic Care',
    readTime: '6 min read',
    imageUrl: articleDiet,
    author: 'Dr. Arvind Kumar',
    publishedDate: '15 Sep 2026',
    content: `Hypertension is frequently termed the "silent condition" because it often causes no obvious symptoms until complications arise.

Best Practices for Daily BP Management:
- Take readings at the same time each morning prior to morning medication.
- Avoid caffeine, smoking, or strenuous exercise for 30 minutes before testing.
- Rest quietly for 5 minutes with feet flat on the floor before inflating the cuff.
- Maintain a digital log in your MedReminder dashboard to share during clinical checkups.`,
  },
  {
    id: 'art-4',
    title: 'Stress Management Techniques',
    excerpt: 'Practical ways to reduce stress and improve mental well-being.',
    category: 'Mental Health',
    readTime: '3 min read',
    imageUrl: articleExercise,
    author: 'Clinical Psychology Dept',
    publishedDate: '10 Sep 2026',
    content: `Chronic emotional stress elevates cortisol levels, which in turn increases heart rate, destabilizes blood sugar, and leads to medication lapses.

Evidence-Based Techniques:
- The 4-7-8 Diaphragmatic Breathing Method: Inhale for 4 seconds, hold for 7, exhale gently through pursed lips for 8.
- Digital Downtime: Disconnect from work emails and notifications 45 minutes prior to sleep.
- Setting gentle reminders: Let your DoseStrip application track pill times so you do not carry reminder fatigue throughout the day.`,
  },
  {
    id: 'art-5',
    title: 'How to Take Medicines Safely',
    excerpt: 'Important tips to take medicines on time and avoid common mistakes.',
    category: 'Medicine Tips',
    readTime: '4 min read',
    imageUrl: articleDiet,
    author: 'Pharmacology Review Panel',
    publishedDate: '01 Sep 2026',
    content: `Taking prescription medications safely ensures maximum therapeutic benefit while minimizing adverse side effects.

Safe Medication Checklist:
1. Always verify the label instructions: check whether your medicine requires food or should be taken on an empty stomach with a full glass of water.
2. Never adjust dosages without consulting your prescribing physician.
3. Store tablets away from excessive heat and direct sunlight in a dry medicine organizer.
4. Keep emergency and caregiver contact details up to date in your DoseStrip profile.`,
  },
  {
    id: 'art-6',
    title: 'Building a Healthier Lifestyle',
    excerpt: 'Simple daily habits for a healthier and happier life.',
    category: 'General Health',
    readTime: '5 min read',
    imageUrl: articleExercise,
    author: 'Preventive Health Forum',
    publishedDate: '20 Aug 2026',
    content: `Sustainable longevity is built upon small, consistent daily decisions rather than drastic short-term diets.

The Four Pillars of Health:
- Hydration: Drink 2 to 2.5 liters of clean water daily.
- Quality Sleep: Prioritize 7 to 8 hours of restorative sleep in a cool, dark room.
- Mindful Nutrition: Choose wholesome, unrefined ingredients.
- Treatment Adherence: Adhering to your prescribed therapies with DoseStrip ensures long-term clinical stability.`,
  },
];

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'care-1',
    name: 'Rakesh',
    relationship: 'Son',
    status: 'Active',
    email: 'rakesh.k@example.com',
    phone: '+91 98401 23456',
    avatarInitials: 'R',
  },
  {
    id: 'care-2',
    name: 'Surendhar',
    relationship: 'Brother',
    status: 'Active',
    email: 'surendhar.b@example.com',
    phone: '+91 98402 34567',
    avatarInitials: 'S',
  },
  {
    id: 'care-3',
    name: 'Yokesh',
    relationship: 'Friend',
    status: 'Pending',
    email: 'yokesh.m@example.com',
    phone: '+91 98403 45678',
    avatarInitials: 'Y',
  },
];

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  medicineReminders: true,
  reminderSound: 'Default Tone',
  pushNotifications: true,
  emailReminders: false,
  smsReminders: false,
};

export const INITIAL_APP_PREFERENCES: AppPreferences = {
  theme: 'Light',
  language: 'English',
  dateFormat: 'DD MMM YYYY (10 Oct 2026)',
  timeFormat: '12-Hour (AM/PM)',
  units: 'Metric (kg, cm)',
};

export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  biometricLogin: true,
  twoFactorAuth: false,
};
