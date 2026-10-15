import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationPage } from '../../types';
import { ASSET_PATHS } from '../../data/mockData';
import { 
  LayoutDashboard, 
  Pill, 
  Stethoscope, 
  History, 
  Settings, 
  Heart, 
  Activity, 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  UserCheck
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { 
    activePage, 
    setActivePage, 
    searchQuery, 
    setSearchQuery, 
    user, 
    notificationSettings 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems: { label: NavigationPage; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { label: 'My Medicines', icon: <Pill className="w-5 h-5 shrink-0" /> },
    { label: 'Healthcare', icon: <Stethoscope className="w-5 h-5 shrink-0" /> },
    { label: 'History', icon: <History className="w-5 h-5 shrink-0" /> },
    { label: 'Profile & Settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const sidebarQuote = activePage === 'History' 
    ? 'Track Today, Stay Healthier Tomorrow'
    : 'Better Medication, Brighter Tomorrows';

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans">
      {/* 1. MANDATORY ORIGINAL BACKGROUND IMAGE */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transform scale-100"
        style={{
          backgroundImage: `url(${ASSET_PATHS.background})`,
          backgroundAttachment: 'fixed',
        }}
        aria-hidden="true"
      />
      
      {/* Liquid glass light diffusion and subtle tint overlay */}
      <div 
        className="fixed inset-0 z-0 bg-slate-900/15 backdrop-blur-[2px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Main Content Layout Container */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row p-3 sm:p-5 lg:p-6 gap-5 lg:gap-6 max-w-[1720px] mx-auto">
        
        {/* =========================================
            SIDEBAR (Desktop & Tablet)
           ========================================= */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 glass-panel rounded-3xl p-5 shadow-2xl border border-white/80 justify-between">
          <div className="flex flex-col gap-7">
            {/* DoseStrip Logo & Brand */}
            <div className="flex items-center gap-3.5 px-2 pt-1">
              <div className="relative group">
                <img
                  src={ASSET_PATHS.logo}
                  alt="DoseStrip Logo"
                  className="w-11 h-11 rounded-2xl object-cover shadow-lg shadow-blue-500/25 border border-white/80 ring-2 ring-sky-400/30 transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-800 flex items-center gap-1">
                  DoseStrip
                </span>
                <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
                  Health &amp; Reminders
                </span>
              </div>
            </div>

            {/* Navigation links - EXACT 5 labels required by Phase 5 */}
            <nav className="flex flex-col gap-2" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = activePage === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActivePage(item.label)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/35 scale-[1.02]'
                        : 'text-slate-700 hover:bg-white/50 hover:text-blue-600'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-600'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Feature/Quote Glass Card */}
          <div className="mt-8 p-4 rounded-2xl glass-panel-subtle border border-white/70 shadow-sm flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-700 italic leading-snug">
              &ldquo;{sidebarQuote}&rdquo;
            </p>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-blue-600 shrink-0">
              <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
          </div>
        </aside>

        {/* =========================================
            MOBILE / TABLET TOP BAR
           ========================================= */}
        <div className="lg:hidden flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/80 shadow-md">
          <div className="flex items-center gap-2.5">
            <img
              src={ASSET_PATHS.logo}
              alt="DoseStrip Logo"
              className="w-9 h-9 rounded-xl object-cover shadow-md border border-white/80"
              referrerPolicy="no-referrer"
            />
            <span className="text-lg font-bold text-slate-800 tracking-tight">DoseStrip</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-white/70 text-slate-700 relative hover:bg-white transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationSettings.pushNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/70 text-slate-700 hover:bg-white transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/30">
              <div className="flex items-center gap-2.5">
                <img
                  src={ASSET_PATHS.logo}
                  alt="DoseStrip Logo"
                  className="w-8 h-8 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xl font-bold text-white">DoseStrip</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/80 hover:text-white rounded-xl"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mt-6">
              {navItems.map((item) => {
                const isActive = activePage === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActivePage(item.label);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
                        : 'text-white/90 hover:bg-white/20'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/20 flex items-center justify-between text-white/80 text-xs">
              <span>{user.fullName} · {user.role}</span>
              <button 
                onClick={() => {
                  setActivePage('Profile & Settings');
                  setMobileMenuOpen(false);
                }}
                className="text-blue-300 font-medium underline"
              >
                Settings
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            MAIN APP CONTENT AREA
           ========================================= */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* TOP HEADER */}
          <header className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* Global Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, doctors, articles..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass-panel-elevated text-sm text-slate-800 placeholder-slate-400 border border-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Date indicator, Notifications, Profile capsule */}
            <div className="flex items-center justify-end gap-3 shrink-0">
              
              {/* Date Badge */}
              <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel-subtle text-xs font-semibold text-slate-700 border border-white/80 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Fri, 10 Oct 2026</span>
              </div>

              {/* Notification Bell with Badge and Flyout */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileMenuOpen(false);
                  }}
                  className="relative p-2.5 rounded-2xl glass-panel hover:bg-white text-slate-700 border border-white/90 shadow-sm transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-3xl glass-panel-elevated p-4 shadow-2xl border border-white/90 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-2">
                      <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">3 New</span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Upcoming Medication</span>
                        </div>
                        <p className="text-slate-600 mt-1">Vitamin D3 is scheduled at 12:00 PM with water.</p>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Paracetamol Confirmed</span>
                        </div>
                        <p className="text-slate-600 mt-1">Marked as taken at 08:05 AM.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              {/* User Profile Pill Capsule */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileMenuOpen(!profileMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl glass-panel hover:bg-white text-slate-800 border border-white/90 shadow-sm transition-all"
                  aria-label="User profile menu"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-white/90 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold leading-tight text-slate-800">{user.name}</div>
                    <div className="text-[11px] text-slate-500 leading-tight">{user.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-3xl glass-panel-elevated p-3 shadow-2xl border border-white/90 z-50">
                    <div className="px-3 py-2 border-b border-slate-200/60 mb-2">
                      <div className="font-bold text-sm text-slate-800">{user.fullName}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setActivePage('Profile & Settings');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 transition-colors text-left"
                    >
                      <UserCheck className="w-4 h-4 text-slate-500" />
                      <span>Manage Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActivePage('Profile & Settings');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Notification & Preferences</span>
                    </button>
                    <div className="mt-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out (Demo)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="flex-1 w-full">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
};
