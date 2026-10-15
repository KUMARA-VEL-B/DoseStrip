/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { MedicinesPage } from './components/medicines/MedicinesPage';
import { HealthcarePage } from './components/healthcare/HealthcarePage';
import { HistoryPage } from './components/history/HistoryPage';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { ToastContainer } from './components/common/ToastContainer';

const MainRouter: React.FC = () => {
  const { activePage } = useApp();

  return (
    <Shell>
      {activePage === 'Dashboard' && <DashboardPage />}
      {activePage === 'My Medicines' && <MedicinesPage />}
      {activePage === 'Healthcare' && <HealthcarePage />}
      {activePage === 'History' && <HistoryPage />}
      {activePage === 'Profile & Settings' && <ProfileSettingsPage />}
      <ToastContainer />
    </Shell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
