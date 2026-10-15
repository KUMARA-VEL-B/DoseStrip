import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  User, 
  Edit3, 
  Bell, 
  Users, 
  Sliders, 
  Shield, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Lock, 
  Fingerprint, 
  Smartphone, 
  Download, 
  FileText, 
  LogOut, 
  Trash2, 
  Plus, 
  MoreVertical, 
  Check, 
  Sun, 
  Moon, 
  Laptop, 
  Music,
  HeartPulse,
  AlertTriangle,
  Volume2
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const {
    user,
    updateUser,
    notificationSettings,
    updateNotificationSettings,
    caregivers,
    addCaregiver,
    removeCaregiver,
    appPreferences,
    updateAppPreferences,
    securitySettings,
    updateSecuritySettings,
    addToast
  } = useApp();

  // Modals state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user.fullName,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    phone: user.phone,
    email: user.email,
    location: user.location,
    conditions: user.medicalConditions.join(', '),
    allergies: user.allergies.join(', '),
  });

  const [addCaregiverOpen, setAddCaregiverOpen] = useState(false);
  const [caregiverForm, setCaregiverForm] = useState({
    name: '',
    relationship: 'Family Member',
    email: '',
    phone: '',
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Form Submissions
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: profileForm.fullName.split(' ')[0] || user.name,
      fullName: profileForm.fullName,
      dateOfBirth: profileForm.dateOfBirth,
      gender: profileForm.gender,
      phone: profileForm.phone,
      email: profileForm.email,
      location: profileForm.location,
      medicalConditions: profileForm.conditions.split(',').map((s) => s.trim()).filter(Boolean),
      allergies: profileForm.allergies.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setEditProfileOpen(false);
  };

  const handleCaregiverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverForm.name.trim()) return;
    addCaregiver({
      name: caregiverForm.name.trim(),
      relationship: caregiverForm.relationship,
      status: 'Active',
      email: caregiverForm.email || 'caregiver@example.com',
      phone: caregiverForm.phone || '+91 98000 00000',
      avatarInitials: caregiverForm.name.charAt(0).toUpperCase(),
    });
    setCaregiverForm({ name: '', relationship: 'Family Member', email: '', phone: '' });
    setAddCaregiverOpen(false);
  };

  const handleExportData = () => {
    const exportJson = JSON.stringify(
      {
        user,
        exportedAt: new Date().toISOString(),
        note: 'DoseStrip Personal Health Records Export',
      },
      null,
      2
    );
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dosestrip-export-${user.name.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDataModalOpen(false);
    addToast({
      type: 'success',
      title: 'Data Exported',
      message: 'Your health records JSON file has been downloaded.',
    });
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full animate-in fade-in duration-300">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Profile &amp; Settings
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Manage your personal information, notifications, preferences and caregiver access.
          </p>
        </div>
      </div>

      {/* 2. TOP ROW: PERSONAL INFO, NOTIFICATION SETTINGS, CAREGIVER ACCESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* =========================================
            CARD 1: PERSONAL INFORMATION
           ========================================= */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-800">Personal Information</h2>
              </div>
              <button
                onClick={() => setEditProfileOpen(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Profile Avatar & Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800">{user.name}</h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user.fullName}</p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="font-bold text-slate-800">{user.fullName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Date of Birth</span>
                <span className="font-semibold text-slate-800">{user.dateOfBirth}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Gender</span>
                <span className="font-semibold text-slate-800">{user.gender}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <span className="font-mono font-semibold text-slate-800">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Email Address</span>
                <span className="font-semibold text-slate-800 truncate max-w-[160px]">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-semibold text-slate-800 truncate max-w-[160px]">{user.location}</span>
              </div>
              <div className="pt-1.5">
                <span className="text-slate-500 font-medium block mb-1">Medical Conditions</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.medicalConditions.map((cond) => (
                    <span
                      key={cond}
                      className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-[11px]"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">Allergies</span>
                <span className="font-semibold text-slate-700">{user.allergies.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            CARD 2: NOTIFICATION SETTINGS
           ========================================= */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-800">Notification Settings</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Medicine Reminders toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Medicine Reminders</h4>
                  <p className="text-[11px] text-slate-500">Get notified for your medicine schedules</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNotificationSettings({
                      medicineReminders: !notificationSettings.medicineReminders,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notificationSettings.medicineReminders ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={notificationSettings.medicineReminders}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      notificationSettings.medicineReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reminder Sound Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reminder Sound
                </label>
                <div className="relative">
                  <select
                    value={notificationSettings.reminderSound}
                    onChange={(e) =>
                      updateNotificationSettings({ reminderSound: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>Default Tone</option>
                    <option>Gentle Chime</option>
                    <option>Soft Bell</option>
                    <option>Hospital Ping</option>
                  </select>
                </div>
              </div>

              {/* Push Notifications toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Push Notifications</h4>
                  <p className="text-[11px] text-slate-500">Show notifications on this device</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNotificationSettings({
                      pushNotifications: !notificationSettings.pushNotifications,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notificationSettings.pushNotifications ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={notificationSettings.pushNotifications}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Email Reminders toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Email Reminders</h4>
                  <p className="text-[11px] text-slate-500">Receive daily/weekly summary via email</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNotificationSettings({
                      emailReminders: !notificationSettings.emailReminders,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notificationSettings.emailReminders ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={notificationSettings.emailReminders}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      notificationSettings.emailReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Reminders toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">SMS Reminders</h4>
                  <p className="text-[11px] text-slate-500">Get SMS alerts for important reminders</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNotificationSettings({
                      smsReminders: !notificationSettings.smsReminders,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notificationSettings.smsReminders ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={notificationSettings.smsReminders}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      notificationSettings.smsReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================
            CARD 3: CAREGIVER ACCESS
           ========================================= */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-800">Caregiver Access</h2>
              </div>
              <button
                onClick={() => setAddCaregiverOpen(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Caregiver</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Allow your family members to help you manage your medications.
            </p>

            <div className="space-y-3">
              {caregivers.map((cg) => (
                <div
                  key={cg.id}
                  className="flex items-center justify-between p-3 rounded-2xl glass-panel-subtle border border-white/70"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {cg.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{cg.name}</div>
                      <div className="text-[11px] text-slate-500">{cg.relationship}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cg.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      ● {cg.status}
                    </span>
                    <button
                      onClick={() => removeCaregiver(cg.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove caregiver"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM ROW: APP PREFERENCES, PRIVACY & SECURITY, ACCOUNT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* =========================================
            CARD 4: APP PREFERENCES
           ========================================= */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200/60 mb-4">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">App Preferences</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Theme Segmented Control */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Theme</span>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/70 border border-slate-200/60">
                  <button
                    onClick={() => updateAppPreferences({ theme: 'Light' })}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      appPreferences.theme === 'Light'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => updateAppPreferences({ theme: 'Dark' })}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      appPreferences.theme === 'Dark'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => updateAppPreferences({ theme: 'System' })}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      appPreferences.theme === 'System'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Laptop className="w-3 h-3" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Language</span>
                <select
                  value={appPreferences.language}
                  onChange={(e) => updateAppPreferences({ language: e.target.value })}
                  className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option>English</option>
                  <option>Tamil (தமிழ்)</option>
                  <option>Hindi (हिंदी)</option>
                  <option>Spanish</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Date Format</span>
                <select
                  value={appPreferences.dateFormat}
                  onChange={(e) => updateAppPreferences({ dateFormat: e.target.value })}
                  className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option>DD MMM YYYY (10 Oct 2026)</option>
                  <option>MM/DD/YYYY (10/10/2026)</option>
                  <option>YYYY-MM-DD (2026-10-10)</option>
                </select>
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Time Format</span>
                <select
                  value={appPreferences.timeFormat}
                  onChange={(e) => updateAppPreferences({ timeFormat: e.target.value })}
                  className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option>12-Hour (AM/PM)</option>
                  <option>24-Hour (14:00)</option>
                </select>
              </div>

              {/* Units */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Units</span>
                <select
                  value={appPreferences.units}
                  onChange={(e) => updateAppPreferences({ units: e.target.value })}
                  className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option>Metric (kg, cm)</option>
                  <option>Imperial (lb, in)</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================
            CARD 5: PRIVACY & SECURITY
           ========================================= */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200/60 mb-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">Privacy &amp; Security</h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Change Password row */}
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-800">Change Password</div>
                    <div className="text-[11px] text-slate-500">Update your account password</div>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              {/* Biometric Login */}
              <div className="flex items-center justify-between p-2.5 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-800">Biometric Login</div>
                    <div className="text-[11px] text-slate-500">Use fingerprint to login</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSecuritySettings({
                      biometricLogin: !securitySettings.biometricLogin,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    securitySettings.biometricLogin ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={securitySettings.biometricLogin}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      securitySettings.biometricLogin ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-2.5 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-800">Two-Factor Authentication</div>
                    <div className="text-[11px] text-slate-500">Add an extra layer of security</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSecuritySettings({
                      twoFactorAuth: !securitySettings.twoFactorAuth,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={securitySettings.twoFactorAuth}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Manage Data */}
              <button
                onClick={() => setDataModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-800">Manage Data</div>
                    <div className="text-[11px] text-slate-500">Download or delete your data</div>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              {/* Privacy Policy */}
              <button
                onClick={() => setPrivacyModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-800">Privacy Policy</div>
                    <div className="text-[11px] text-slate-500">Read our privacy policy</div>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            CARD 6: ACCOUNT
           ========================================= */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200/60 mb-4">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">Account</h2>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                  ● Active
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Member Since</span>
                <span className="font-semibold text-slate-800">10 Jan 2024</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Last Login</span>
                <span className="font-mono font-semibold text-slate-800">10 Oct 2026, 09:42 AM</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50/80 hover:bg-rose-100/90 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-rose-200/60"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

              <button
                onClick={() => setDeleteAccountModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT PERSONAL INFO MODAL */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Personal Information"
        maxWidth="lg"
      >
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="text"
                value={profileForm.dateOfBirth}
                onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={profileForm.gender}
                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Medical Conditions (comma separated)</label>
            <input
              type="text"
              value={profileForm.conditions}
              onChange={(e) => setProfileForm({ ...profileForm, conditions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Allergies</label>
            <input
              type="text"
              value={profileForm.allergies}
              onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/30"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* ADD CAREGIVER MODAL */}
      <Modal
        isOpen={addCaregiverOpen}
        onClose={() => setAddCaregiverOpen(false)}
        title="Add Caregiver"
        maxWidth="md"
      >
        <form onSubmit={handleCaregiverSubmit} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Caregiver Name *</label>
            <input
              type="text"
              required
              value={caregiverForm.name}
              onChange={(e) => setCaregiverForm({ ...caregiverForm, name: e.target.value })}
              placeholder="e.g. Priya (Spouse), Ramesh (Son)"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Relationship</label>
            <select
              value={caregiverForm.relationship}
              onChange={(e) => setCaregiverForm({ ...caregiverForm, relationship: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            >
              <option>Family Member</option>
              <option>Son</option>
              <option>Daughter</option>
              <option>Spouse</option>
              <option>Brother</option>
              <option>Sister</option>
              <option>Friend</option>
              <option>Professional Nurse</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={caregiverForm.email}
              onChange={(e) => setCaregiverForm({ ...caregiverForm, email: e.target.value })}
              placeholder="caregiver@example.com"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={caregiverForm.phone}
              onChange={(e) => setCaregiverForm({ ...caregiverForm, phone: e.target.value })}
              placeholder="+91 98765 00000"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setAddCaregiverOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/30"
            >
              Invite Caregiver
            </button>
          </div>
        </form>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Password"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200" />
          </div>
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button onClick={() => setPasswordModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-600 font-semibold">Cancel</button>
            <button
              onClick={() => {
                setPasswordModalOpen(false);
                addToast({ type: 'success', title: 'Password Updated', message: 'Your password has been changed.' });
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold"
            >
              Update Password
            </button>
          </div>
        </div>
      </Modal>

      {/* MANAGE DATA MODAL */}
      <Modal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        title="Manage Health Data"
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Download your medication history, doctor consultations, and personal profile information in JSON format for offline storage or doctor sharing.
          </p>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">Export All Data (JSON)</div>
              <div className="text-[11px] text-slate-500">Includes adherence logs and active prescriptions</div>
            </div>
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setDataModalOpen(false)} className="px-4 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700">Close</button>
          </div>
        </div>
      </Modal>

      {/* PRIVACY POLICY MODAL */}
      <Modal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy &amp; Data Security Policy"
        maxWidth="lg"
      >
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-700">
          <p>
            At DoseStrip, your medication adherence and personal health data are stored locally in your browser session for this demonstration.
          </p>
          <h4 className="font-bold text-slate-800 text-sm mt-1">1. Health Data Protection</h4>
          <p>We do not share your prescribed dosage, medications, or caregiver contact details with third-party advertising networks.</p>
          <h4 className="font-bold text-slate-800 text-sm mt-1">2. Local-First Processing</h4>
          <p>All reminders, adherence calculations, and notifications are processed on your device.</p>
          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button onClick={() => setPrivacyModalOpen(false)} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
              Understood
            </button>
          </div>
        </div>
      </Modal>

      {/* LOGOUT CONFIRMATION */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Log Out (Demo)"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            In this demo environment, logging out will reset the active session. Would you like to proceed?
          </p>
          <div className="flex justify-end gap-2.5">
            <button onClick={() => setLogoutModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700">Cancel</button>
            <button
              onClick={() => {
                setLogoutModalOpen(false);
                addToast({ type: 'info', title: 'Session Ended', message: 'You have been logged out of DoseStrip demo.' });
              }}
              className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>

      {/* DELETE ACCOUNT CONFIRMATION */}
      <Modal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        title="Delete Account"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>This action cannot be undone. All medication schedules, adherence history, and caregiver permissions will be permanently removed.</span>
          </div>
          <div className="flex justify-end gap-2.5">
            <button onClick={() => setDeleteAccountModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700">Cancel</button>
            <button
              onClick={() => {
                setDeleteAccountModalOpen(false);
                addToast({ type: 'error', title: 'Action Prevented', message: 'Demo account cannot be deleted in the evaluation sandbox.' });
              }}
              className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
