import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PillIcon } from '../common/PillIcon';
import { ReminderStatus } from '../../types';
import { 
  History as HistoryIcon, 
  Search, 
  Check, 
  X, 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  MoreVertical,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { history, searchQuery: globalSearchQuery, medicines } = useApp();

  const [activeFilterTab, setActiveFilterTab] = useState<'All' | 'Taken' | 'Skipped' | 'Missed'>('All');
  const [selectedMedicineFilter, setSelectedMedicineFilter] = useState('All Medicines');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Status');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [historySearch, setHistorySearch] = useState('');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(10);
  const [calendarMonth, setCalendarMonth] = useState('October 2026');

  const query = (historySearch || globalSearchQuery).toLowerCase();

  // Filter history items
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        item.medicineName.toLowerCase().includes(query) ||
        item.dosage.toLowerCase().includes(query) ||
        item.note.toLowerCase().includes(query) ||
        item.dateLabel.toLowerCase().includes(query);

      const matchTab =
        activeFilterTab === 'All'
          ? true
          : activeFilterTab === 'Taken'
          ? item.status === 'Taken'
          : activeFilterTab === 'Skipped'
          ? item.status === 'Skipped'
          : item.status === 'Missed';

      const matchMed =
        selectedMedicineFilter === 'All Medicines' || item.medicineName === selectedMedicineFilter;

      const matchStatus =
        selectedStatusFilter === 'All Status' || item.status === selectedStatusFilter;

      const matchCat =
        selectedCategoryFilter === 'All Categories' || item.category === selectedCategoryFilter;

      // Filter by selected calendar date if active
      let matchDay = true;
      if (selectedCalendarDay !== null) {
        const itemDay = parseInt(item.date.split('-')[2], 10);
        matchDay = itemDay === selectedCalendarDay;
      }

      return matchSearch && matchTab && matchMed && matchStatus && matchCat && matchDay;
    });
  }, [
    history,
    query,
    activeFilterTab,
    selectedMedicineFilter,
    selectedStatusFilter,
    selectedCategoryFilter,
    selectedCalendarDay,
  ]);

  // Group by dateLabel
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: typeof history } = {};
    filteredHistory.forEach((item) => {
      if (!groups[item.dateLabel]) {
        groups[item.dateLabel] = [];
      }
      groups[item.dateLabel].push(item);
    });
    return groups;
  }, [filteredHistory]);

  // Calendar configuration for October 2026
  // October 1, 2026 is Thursday (so 4 empty cells before day 1: Sun, Mon, Tue, Wed)
  const calendarDays = [
    { day: 27, currentMonth: false },
    { day: 28, currentMonth: false },
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true, status: 'taken' },
    { day: 2, currentMonth: true, status: 'taken' },
    { day: 3, currentMonth: true, status: 'taken' },
    { day: 4, currentMonth: true, status: 'taken' },
    { day: 5, currentMonth: true, status: 'taken' },
    { day: 6, currentMonth: true, status: 'taken' },
    { day: 7, currentMonth: true, status: 'taken' },
    { day: 8, currentMonth: true, status: 'missed' },
    { day: 9, currentMonth: true, status: 'skipped' },
    { day: 10, currentMonth: true, status: 'pending', selected: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
  ];

  const getStatusBadge = (status: ReminderStatus) => {
    switch (status) {
      case 'Taken':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Taken</span>
          </span>
        );
      case 'Snoozed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3" />
            <span>Snoozed</span>
          </span>
        );
      case 'Pending':
      case 'Upcoming':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Pending</span>
          </span>
        );
      case 'Skipped':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3 h-3 stroke-[3]" />
            <span>Skipped</span>
          </span>
        );
      case 'Missed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <X className="w-3 h-3 stroke-[3]" />
            <span>Missed</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full animate-in fade-in duration-300">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Reminder History
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            View your past medication reminders and responses.
          </p>
        </div>

        {/* Date Range Selector Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-semibold text-slate-700 border border-white/85 shadow-sm self-start sm:self-auto">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span>01 Oct 2026 – 10 Oct 2026</span>
        </div>
      </div>

      {/* 2. FILTER TABS & SUB-FILTERS BAR */}
      <div className="flex flex-col gap-3">
        {/* Top 4 Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilterTab('All')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeFilterTab === 'All'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'glass-panel text-slate-700 hover:bg-white/80'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            <span>All History</span>
          </button>
          <button
            onClick={() => setActiveFilterTab('Taken')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeFilterTab === 'Taken'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'glass-panel text-slate-700 hover:bg-white/80'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Taken</span>
          </button>
          <button
            onClick={() => setActiveFilterTab('Skipped')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeFilterTab === 'Skipped'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                : 'glass-panel text-slate-700 hover:bg-white/80'
            }`}
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Skipped</span>
          </button>
          <button
            onClick={() => setActiveFilterTab('Missed')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeFilterTab === 'Missed'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
                : 'glass-panel text-slate-700 hover:bg-white/80'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Missed</span>
          </button>
        </div>

        {/* Sub-Filters Dropdown Controls */}
        <div className="glass-panel rounded-2xl p-3 border border-white/85 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search history, medicines, or dates..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedMedicineFilter}
              onChange={(e) => setSelectedMedicineFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option>All Medicines</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Taken</option>
              <option>Snoozed</option>
              <option>Pending</option>
              <option>Skipped</option>
              <option>Missed</option>
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option>All Categories</option>
              <option>Pain Relief</option>
              <option>Supplement</option>
              <option>Diabetes</option>
              <option>Blood Pressure</option>
            </select>

            {selectedCalendarDay !== null && (
              <button
                onClick={() => setSelectedCalendarDay(null)}
                className="px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold transition-colors"
                title="Clear day filter"
              >
                Clear Day ({selectedCalendarDay}th) ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT: GROUPED TIMELINE LIST & ADHERENCE / CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* LEFT COLUMN: Date Grouped History Rows (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center border border-white/85">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-700">No records found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No medication records match the selected date or status filter.
              </p>
              {selectedCalendarDay !== null && (
                <button
                  onClick={() => setSelectedCalendarDay(null)}
                  className="mt-3 text-xs font-semibold text-blue-600 underline"
                >
                  Show all October dates
                </button>
              )}
            </div>
          ) : (
            Object.entries(groupedHistory).map(([dateLabel, items]) => (
              <div key={dateLabel} className="flex flex-col gap-2">
                {/* Date Group Header */}
                <h3 className="text-xs font-bold text-slate-700 px-2 tracking-wide uppercase">
                  {dateLabel}
                </h3>

                {/* Items in this date group */}
                <div className="flex flex-col gap-2">
                  {items.map((record) => (
                    <div
                      key={record.id}
                      className="p-3.5 sm:p-4 rounded-2xl glass-panel hover:bg-white/85 transition-all border border-white/80 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <PillIcon
                          color={record.pillColor}
                          size="md"
                          type={record.pillColor === 'amber' ? 'capsule' : 'tablet'}
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {record.medicineName}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {record.dosage}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{record.time}</span>
                        </div>

                        {getStatusBadge(record.status)}

                        <span className="hidden sm:inline-block text-xs text-slate-500 min-w-[120px] text-right truncate">
                          {record.note}
                        </span>

                        <button 
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                          aria-label="Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: Adherence Summary Donut & History Calendar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6">
          
          {/* Card: Adherence Summary */}
          <div className="glass-panel rounded-3xl p-5 border border-white/85 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Adherence Summary</h3>
              <span className="text-[11px] font-semibold text-slate-600 bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200">
                Last 7 Days
              </span>
            </div>

            {/* Circular Donut Ring (71% Adherence) */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-700 ease-out"
                    strokeDasharray="100, 100"
                    strokeDashoffset="29"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-slate-800 font-mono tabular-nums leading-none">
                    71%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Adherence
                  </span>
                </div>
              </div>

              {/* Legend with exact numbers from Image 3 */}
              <div className="w-full flex flex-col gap-1.5 mt-3 px-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Taken</span>
                  </div>
                  <span className="font-mono tabular-nums">20</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Pending</span>
                  </div>
                  <span className="font-mono tabular-nums">4</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Skipped</span>
                  </div>
                  <span className="font-mono tabular-nums">3</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-700" />
                    <span>Missed</span>
                  </div>
                  <span className="font-mono tabular-nums">1</span>
                </div>
              </div>

              {/* Motivational Insight */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/50 flex items-start gap-2 text-[11px] text-blue-900 leading-relaxed">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Good job! You have taken most of your medicines on time. Keep going to stay healthy.</span>
              </div>
            </div>
          </div>

          {/* Card: History Calendar */}
          <div className="glass-panel rounded-3xl p-5 border border-white/85 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
              <h3 className="text-sm font-bold text-slate-800">History Calendar</h3>
              <div className="flex items-center gap-1.5">
                <button
                  className="p-1 rounded-lg hover:bg-white text-slate-500"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-slate-700">{calendarMonth}</span>
                <button
                  className="p-1 rounded-lg hover:bg-white text-slate-500"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar dates grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((cell, idx) => {
                const isSelected = selectedCalendarDay === cell.day && cell.currentMonth;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (cell.currentMonth) {
                        setSelectedCalendarDay(isSelected ? null : cell.day);
                      }
                    }}
                    disabled={!cell.currentMonth}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                      !cell.currentMonth
                        ? 'text-slate-300 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                        : 'text-slate-700 hover:bg-white/80 font-medium'
                    }`}
                  >
                    <span className="text-xs font-mono">{cell.day}</span>
                    {/* Status dot */}
                    {cell.currentMonth && cell.status && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                          cell.status === 'taken'
                            ? isSelected ? 'bg-white' : 'bg-emerald-500'
                            : cell.status === 'pending'
                            ? isSelected ? 'bg-white' : 'bg-amber-400'
                            : cell.status === 'skipped'
                            ? isSelected ? 'bg-white' : 'bg-rose-500'
                            : isSelected ? 'bg-white' : 'bg-rose-700'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mt-4 pt-3 border-t border-slate-200/60">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Taken</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Skipped</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-700" />
                <span>Missed</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
