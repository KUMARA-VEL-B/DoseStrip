import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PillIcon } from '../common/PillIcon';
import { Modal } from '../common/Modal';
import { 
  Calendar, 
  Check, 
  Clock, 
  X, 
  MoreVertical, 
  ArrowRight, 
  BarChart2, 
  Lightbulb, 
  Plus, 
  FileText, 
  Stethoscope, 
  Zap, 
  BellRing,
  Pill as PillLucide,
  ChevronDown
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    schedule, 
    markScheduleStatus, 
    setActivePage, 
    addMedicine,
    todayStats 
  } = useApp();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedCategory, setNewMedCategory] = useState<'Pain Relief' | 'Supplement' | 'Diabetes' | 'Blood Pressure'>('Supplement');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedTime, setNewMedTime] = useState('02:00 PM');
  const [newMedInstructions, setNewMedInstructions] = useState('With water after food');
  const [adherencePeriod, setAdherencePeriod] = useState('This Week');

  // Next reminder calculation
  const upcomingItem = schedule.find((s) => s.status === 'Upcoming' || s.status === 'Pending') || schedule[1];

  const handleAddQuickMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    addMedicine({
      name: newMedName.trim(),
      category: newMedCategory,
      dosage: newMedDosage,
      frequency: 'Once daily',
      instructions: newMedInstructions,
      status: 'Active',
      startDate: '2026-10-10',
      reminderTimes: [newMedTime],
      pillColor: newMedCategory === 'Pain Relief' ? 'pink' : newMedCategory === 'Supplement' ? 'amber' : 'blue',
      pillType: 'tablet',
    });

    setNewMedName('');
    setAddModalOpen(false);
  };

  // Weekly data from the reference: Mon: 60%, Tue: 80%, Wed: 40%, Thu: 20%, Fri: 33%, Sat: 0%, Sun: 0%
  const weeklyData = [
    { day: 'Mon', value: 60 },
    { day: 'Tue', value: 80 },
    { day: 'Wed', value: 40 },
    { day: 'Thu', value: 20 },
    { day: 'Fri', value: todayStats.adherencePercentage || 33, active: true },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  // SVG Donut calculation
  const total = todayStats.total || 3;
  const taken = todayStats.taken || 1;
  const percentage = Math.round((taken / total) * 100);
  const strokeDashoffset = 100 - percentage;

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full animate-in fade-in duration-300">
      
      {/* 1. WELCOME BANNER & GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Good morning, {user.name} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Stay on track with your daily medication.
          </p>
        </div>

        <div className="sm:hidden flex items-center gap-2 text-xs font-semibold text-slate-700 glass-panel px-3 py-1.5 rounded-xl self-start">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Fri, 10 Oct 2026</span>
        </div>
      </div>

      {/* 2. TOP 4 METRICS KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4.5">
        
        {/* Card 1: Today's Medicines */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm border border-white/85">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-600 shrink-0">
            <PillLucide className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tabular-nums leading-none">
              {todayStats.total}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Today&apos;s Medicines
            </div>
          </div>
        </div>

        {/* Card 2: Taken */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm border border-white/85">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-600 shrink-0">
            <Check className="w-6 h-6 stroke-[3] text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tabular-nums leading-none">
              {todayStats.taken}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Taken
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm border border-white/85">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tabular-nums leading-none">
              {todayStats.upcoming}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Upcoming
            </div>
          </div>
        </div>

        {/* Card 4: Missed */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm border border-white/85">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-600 shrink-0">
            <X className="w-6 h-6 stroke-[3] text-rose-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tabular-nums leading-none">
              {todayStats.missed}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Missed
            </div>
          </div>
        </div>

      </div>

      {/* 3. MAIN DASHBOARD SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* LEFT COLUMN: Today's Schedule & Weekly Adherence (7 cols on lg, 8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5 sm:gap-6">
          
          {/* Card: Today's Schedule */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-md border border-white/85">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Today&apos;s Schedule</h2>
              </div>
              <button
                onClick={() => setActivePage('My Medicines')}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Schedule List */}
            <div className="flex flex-col gap-3">
              {schedule.map((item) => {
                const isTaken = item.status === 'Taken';
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-panel-subtle hover:bg-white/70 transition-all border border-white/70 ${
                      isTaken ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <PillIcon
                        color={item.pillColor}
                        size="md"
                        type={item.pillColor === 'amber' ? 'capsule' : 'tablet'}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">
                          {item.medicineName}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {item.dosage}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 font-mono tabular-nums">
                        {item.scheduledTime}
                      </div>

                      {/* Status indicator badge / action */}
                      {isTaken ? (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Taken</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => markScheduleStatus(item.id, 'Taken')}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 transition-colors shadow-xs"
                          title="Click to mark as taken"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Upcoming</span>
                        </button>
                      )}

                      {/* Item options dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                          aria-label="Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 mt-1 w-36 rounded-2xl glass-panel-elevated p-2 shadow-xl border border-white/90 z-20">
                            {!isTaken && (
                              <button
                                onClick={() => {
                                  markScheduleStatus(item.id, 'Taken');
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Taken</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                markScheduleStatus(item.id, 'Snoozed');
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-2"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Snooze 30m</span>
                            </button>
                            <button
                              onClick={() => {
                                markScheduleStatus(item.id, 'Skipped');
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Skip Dose</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Weekly Adherence Chart */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-md border border-white/85">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Weekly Adherence</h2>
              </div>
              <div className="relative">
                <select
                  value={adherencePeriod}
                  onChange={(e) => setAdherencePeriod(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-white/70 border border-slate-200/70 rounded-xl px-3 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs cursor-pointer"
                >
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>Last 30 Days</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-48 sm:h-52 w-full pt-4">
              {/* Gridlines */}
              <div className="absolute inset-x-0 top-2 border-b border-dashed border-slate-200/60 flex items-center justify-start text-[10px] text-slate-400 pl-1 font-mono">
                100%
              </div>
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-200/60 flex items-center justify-start text-[10px] text-slate-400 pl-1 font-mono">
                50%
              </div>
              <div className="absolute inset-x-0 bottom-7 border-b border-slate-200/80 flex items-center justify-start text-[10px] text-slate-400 pl-1 font-mono">
                0%
              </div>

              {/* Bar Columns */}
              <div className="absolute inset-x-0 bottom-0 top-0 pl-10 pr-2 flex items-end justify-between gap-2">
                {weeklyData.map((item) => {
                  const barHeight = Math.max(item.value, 4);
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                      {/* Tooltip Percentage */}
                      <span className="text-[11px] font-bold text-slate-600 mb-1 opacity-90 group-hover:opacity-100 font-mono tabular-nums">
                        {item.value}%
                      </span>
                      {/* Bar Fill */}
                      <div className="w-full max-w-[42px] bg-slate-200/30 rounded-t-xl h-36 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${barHeight}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            item.active
                              ? 'bg-blue-600 shadow-md shadow-blue-500/30'
                              : 'bg-sky-400 hover:bg-sky-500'
                          }`}
                        />
                      </div>
                      {/* Day Label */}
                      <span className="text-xs font-semibold text-slate-600 mt-2">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Daily Adherence Ring, Next Reminder, Quick Actions (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 sm:gap-6">
          
          {/* Card: Daily Adherence */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-md border border-white/85">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-5">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Daily Adherence</h3>
              </div>
              <div className="relative">
                <span className="text-xs font-semibold text-slate-600 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-xs">
                  Today
                </span>
              </div>
            </div>

            {/* Circular Donut Ring */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Taken Progress Ring (Green / Cyan) */}
                  <path
                    className="text-emerald-500 transition-all duration-700 ease-out"
                    strokeDasharray="100, 100"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                {/* Center Percentage */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums leading-none">
                    {percentage}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Today
                  </span>
                </div>
              </div>

              {/* Adherence Legend */}
              <div className="w-full flex flex-col gap-2 mt-4 px-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Taken</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-800">{todayStats.taken}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>Upcoming</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-800">{todayStats.upcoming}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Missed</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-800">{todayStats.missed}</span>
                </div>
              </div>

              {/* Motivational Insight Banner */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-blue-50/80 border border-blue-200/60 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed shadow-xs">
                <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Keep going! Take your upcoming medicines on time to stay healthy.</span>
              </div>
            </div>
          </div>

          {/* Card: Next Reminder */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-md border border-white/85">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 mb-3.5">
              <BellRing className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">Next Reminder</h3>
            </div>

            {upcomingItem ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl glass-panel-subtle border border-white/70">
                <div className="flex items-center gap-3 min-w-0">
                  <PillIcon
                    color={upcomingItem.pillColor}
                    size="md"
                    type={upcomingItem.pillColor === 'amber' ? 'capsule' : 'tablet'}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">
                      {upcomingItem.medicineName}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {upcomingItem.dosage}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 font-mono tabular-nums">
                    {upcomingItem.scheduledTime}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Today
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 p-3">All scheduled medications completed for today.</p>
            )}
          </div>

          {/* Card: Quick Actions */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-md border border-white/85">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 mb-4">
              <Zap className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
            </div>

            <div className="flex flex-col gap-3">
              {/* Primary + Add Medicine button */}
              <button
                onClick={() => setAddModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Medicine</span>
              </button>

              {/* 3 Secondary Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => setActivePage('My Medicines')}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl glass-panel-subtle hover:bg-white text-slate-700 text-xs font-semibold border border-white/70 transition-colors shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">View Schedule</span>
                </button>
                <button
                  onClick={() => setActivePage('History')}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl glass-panel-subtle hover:bg-white text-slate-700 text-xs font-semibold border border-white/70 transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">View History</span>
                </button>
                <button
                  onClick={() => setActivePage('Healthcare')}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl glass-panel-subtle hover:bg-white text-slate-700 text-xs font-semibold border border-white/70 transition-colors shadow-xs"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">Find a Doctor</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* QUICK ADD MEDICINE MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Medicine"
      >
        <form onSubmit={handleAddQuickMedicine} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              placeholder="e.g., Vitamin C, Atorvastatin"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={newMedCategory}
                onChange={(e) => setNewMedCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Supplement">Supplement</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Blood Pressure">Blood Pressure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dosage *
              </label>
              <input
                type="text"
                value={newMedDosage}
                onChange={(e) => setNewMedDosage(e.target.value)}
                placeholder="e.g. 1 tablet, 500mg"
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reminder Time *
              </label>
              <input
                type="text"
                value={newMedTime}
                onChange={(e) => setNewMedTime(e.target.value)}
                placeholder="e.g. 02:00 PM"
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instructions
              </label>
              <input
                type="text"
                value={newMedInstructions}
                onChange={(e) => setNewMedInstructions(e.target.value)}
                placeholder="e.g. After food"
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/30"
            >
              Save Medicine
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
