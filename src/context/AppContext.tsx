import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  NavigationPage, 
  Medicine, 
  ScheduleItem, 
  ReminderHistoryRecord, 
  Doctor, 
  HealthArticle, 
  UserProfile, 
  Caregiver, 
  NotificationSettings, 
  AppPreferences, 
  SecuritySettings,
  ReminderStatus 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_MEDICINES, 
  INITIAL_TODAY_SCHEDULE, 
  INITIAL_HISTORY, 
  INITIAL_DOCTORS, 
  INITIAL_ARTICLES, 
  INITIAL_CAREGIVERS, 
  INITIAL_NOTIFICATION_SETTINGS, 
  INITIAL_APP_PREFERENCES, 
  INITIAL_SECURITY_SETTINGS 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  schedule: ScheduleItem[];
  markScheduleStatus: (id: string, status: ReminderStatus) => void;
  history: ReminderHistoryRecord[];
  addHistoryRecord: (record: Omit<ReminderHistoryRecord, 'id'>) => void;
  doctors: Doctor[];
  articles: HealthArticle[];
  caregivers: Caregiver[];
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => void;
  removeCaregiver: (id: string) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  appPreferences: AppPreferences;
  updateAppPreferences: (prefs: Partial<AppPreferences>) => void;
  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  // Computed metrics
  todayStats: {
    total: number;
    taken: number;
    upcoming: number;
    missed: number;
    adherencePercentage: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavigationPage>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_TODAY_SCHEDULE);
  const [history, setHistory] = useState<ReminderHistoryRecord[]>(INITIAL_HISTORY);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [articles] = useState<HealthArticle[]>(INITIAL_ARTICLES);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(INITIAL_NOTIFICATION_SETTINGS);
  const [appPreferences, setAppPreferences] = useState<AppPreferences>(INITIAL_APP_PREFERENCES);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal information has been saved successfully.',
    });
  };

  const addMedicine = (newMedData: Omit<Medicine, 'id'>) => {
    const id = `med-${Date.now()}`;
    const newMed: Medicine = { ...newMedData, id };
    setMedicines((prev) => [newMed, ...prev]);

    // Also add to today's schedule if active
    if (newMed.status === 'Active') {
      const newScheduleItems: ScheduleItem[] = newMed.reminderTimes.map((time, idx) => ({
        id: `sched-${Date.now()}-${idx}`,
        medicineId: id,
        medicineName: newMed.name,
        dosage: `${newMed.dosage} ${newMed.instructions ? `(${newMed.instructions})` : ''}`,
        instructions: newMed.instructions,
        scheduledTime: time,
        status: 'Upcoming',
        pillColor: newMed.pillColor,
      }));
      setSchedule((prev) => [...prev, ...newScheduleItems]);
    }

    addToast({
      type: 'success',
      title: 'Medicine Added',
      message: `${newMed.name} has been added to your medication list.`,
    });
  };

  const updateMedicine = (id: string, updated: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
    // Update schedule names if changed
    if (updated.name || updated.pillColor) {
      setSchedule((prev) =>
        prev.map((s) => (s.medicineId === id ? { ...s, medicineName: updated.name ?? s.medicineName, pillColor: updated.pillColor ?? s.pillColor } : s))
      );
    }
    addToast({
      type: 'success',
      title: 'Medicine Updated',
      message: 'Changes have been saved to your medications.',
    });
  };

  const deleteMedicine = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setSchedule((prev) => prev.filter((s) => s.medicineId !== id));
    addToast({
      type: 'info',
      title: 'Medicine Removed',
      message: `${med?.name ?? 'Medicine'} has been removed from your list.`,
    });
  };

  const markScheduleStatus = (scheduleId: string, status: ReminderStatus) => {
    const item = schedule.find((s) => s.id === scheduleId);
    if (!item) return;

    setSchedule((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              status,
              takenAt: status === 'Taken' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            }
          : s
      )
    );

    // Add to history
    const historyRecord: ReminderHistoryRecord = {
      id: `hist-${Date.now()}`,
      medicineName: item.medicineName,
      category: 'Supplement',
      dosage: item.dosage,
      date: '2026-10-10',
      dateLabel: 'Today, 10 Oct 2026',
      time: item.scheduledTime,
      status: status,
      note: status === 'Taken' ? 'Taken on time' : status === 'Snoozed' ? 'Snoozed by user' : 'Skipped by user',
      pillColor: item.pillColor,
    };
    setHistory((prev) => [historyRecord, ...prev]);

    addToast({
      type: status === 'Taken' ? 'success' : status === 'Skipped' ? 'warning' : 'info',
      title: `Medication ${status}`,
      message: `${item.medicineName} marked as ${status.toLowerCase()}.`,
    });
  };

  const addHistoryRecord = (record: Omit<ReminderHistoryRecord, 'id'>) => {
    const id = `hist-${Date.now()}`;
    setHistory((prev) => [{ ...record, id }, ...prev]);
  };

  const addCaregiver = (newCaregiver: Omit<Caregiver, 'id'>) => {
    const id = `care-${Date.now()}`;
    setCaregivers((prev) => [...prev, { ...newCaregiver, id }]);
    addToast({
      type: 'success',
      title: 'Caregiver Added',
      message: `${newCaregiver.name} has been invited as a caregiver.`,
    });
  };

  const removeCaregiver = (id: string) => {
    setCaregivers((prev) => prev.filter((c) => c.id !== id));
    addToast({
      type: 'info',
      title: 'Caregiver Removed',
      message: 'Caregiver access has been updated.',
    });
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...settings }));
    addToast({
      type: 'success',
      title: 'Notification Settings Saved',
      message: 'Your notification preferences have been updated.',
    });
  };

  const updateAppPreferences = (prefs: Partial<AppPreferences>) => {
    setAppPreferences((prev) => ({ ...prev, ...prefs }));
    addToast({
      type: 'success',
      title: 'Preferences Updated',
      message: 'App settings updated.',
    });
  };

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...settings }));
    addToast({
      type: 'info',
      title: 'Security Settings Updated',
      message: 'Authentication options changed.',
    });
  };

  // Coherent statistics calculation matching the references:
  // In image 1: Today's Medicines = 3, Taken = 1, Upcoming = 2, Missed = 0, Adherence = 33%
  const todayStats = useMemo(() => {
    const total = schedule.length;
    const taken = schedule.filter((s) => s.status === 'Taken').length;
    const upcoming = schedule.filter((s) => s.status === 'Upcoming' || s.status === 'Pending').length;
    const missed = schedule.filter((s) => s.status === 'Missed').length;
    const adherencePercentage = total > 0 ? Math.round((taken / total) * 100) : 0;
    return {
      total,
      taken,
      upcoming,
      missed,
      adherencePercentage,
    };
  }, [schedule]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        user,
        updateUser,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        schedule,
        markScheduleStatus,
        history,
        addHistoryRecord,
        doctors,
        articles,
        caregivers,
        addCaregiver,
        removeCaregiver,
        notificationSettings,
        updateNotificationSettings,
        appPreferences,
        updateAppPreferences,
        securitySettings,
        updateSecuritySettings,
        toasts,
        addToast,
        removeToast,
        todayStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
