import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine, MedicineCategory } from '../../types';
import { PillIcon } from '../common/PillIcon';
import { Modal } from '../common/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Layers, 
  ListFilter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MedicinesPage: React.FC = () => {
  const { 
    medicines, 
    addMedicine, 
    updateMedicine, 
    deleteMedicine, 
    schedule,
    searchQuery: globalSearchQuery 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'list' | 'daily' | 'weekly' | 'categories'>('list');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>(medicines[1]?.id || medicines[0]?.id);

  // Form State for Add / Edit Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Supplement' as MedicineCategory,
    dosage: '1 tablet',
    frequency: 'Once daily',
    instructions: 'Take after meal with water',
    startDate: '2026-10-10',
    endDate: '',
    reminderTimes: ['08:00 AM', '08:00 PM'],
    pillColor: 'amber' as 'pink' | 'amber' | 'blue' | 'purple' | 'emerald',
    pillType: 'capsule' as 'tablet' | 'capsule',
  });
  const [newTimeInput, setNewTimeInput] = useState('');
  const [showAddTime, setShowAddTime] = useState(false);

  // Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMed, setDeletingMed] = useState<Medicine | null>(null);

  // Filter & Search logic
  const query = (localSearch || globalSearchQuery).toLowerCase();
  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((med) => {
        const matchesQuery = 
          med.name.toLowerCase().includes(query) || 
          med.category.toLowerCase().includes(query) ||
          med.instructions.toLowerCase().includes(query);
        const matchesCategory = 
          selectedCategory === 'All Categories' || med.category === selectedCategory;
        const matchesStatus = 
          selectedStatus === 'All Status' || med.status === selectedStatus;
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
  }, [medicines, query, selectedCategory, selectedStatus, sortAsc]);

  const selectedMed = medicines.find((m) => m.id === selectedMedicineId) || medicines[0];

  const openAddModal = () => {
    setEditingMedId(null);
    setFormData({
      name: '',
      category: 'Supplement',
      dosage: '1 capsule',
      frequency: 'Once daily',
      instructions: 'Take with water after lunch',
      startDate: '2026-10-10',
      endDate: '',
      reminderTimes: ['08:00 AM', '08:00 PM'],
      pillColor: 'amber',
      pillType: 'capsule',
    });
    setFormModalOpen(true);
  };

  const openEditModal = (med: Medicine) => {
    setEditingMedId(med.id);
    setFormData({
      name: med.name,
      category: med.category,
      dosage: med.dosage,
      frequency: med.frequency,
      instructions: med.instructions,
      startDate: med.startDate,
      endDate: med.endDate || '',
      reminderTimes: [...med.reminderTimes],
      pillColor: med.pillColor,
      pillType: med.pillType,
    });
    setFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingMedId) {
      updateMedicine(editingMedId, {
        name: formData.name.trim(),
        category: formData.category,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        reminderTimes: formData.reminderTimes,
        pillColor: formData.pillColor,
        pillType: formData.pillType,
      });
    } else {
      addMedicine({
        name: formData.name.trim(),
        category: formData.category,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        status: 'Active',
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        reminderTimes: formData.reminderTimes,
        pillColor: formData.pillColor,
        pillType: formData.pillType,
      });
    }

    setFormModalOpen(false);
  };

  const handleAddTime = () => {
    if (!newTimeInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, newTimeInput.trim()],
    }));
    setNewTimeInput('');
    setShowAddTime(false);
  };

  const handleRemoveTime = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const confirmDelete = () => {
    if (deletingMed) {
      deleteMedicine(deletingMed.id);
      if (selectedMedicineId === deletingMed.id) {
        setSelectedMedicineId(medicines.find((m) => m.id !== deletingMed.id)?.id || '');
      }
      setDeleteModalOpen(false);
      setDeletingMed(null);
    }
  };

  // 7-day adherence mock for the selected medicine
  const last7DaysAdherence = [
    { day: 'Mon', value: 100 },
    { day: 'Tue', value: 100 },
    { day: 'Wed', value: 80 },
    { day: 'Thu', value: 60 },
    { day: 'Fri', value: 100 },
    { day: 'Sat', value: 80 },
    { day: 'Sun', value: 0 },
  ];

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full animate-in fade-in duration-300">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            My Medicines
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Manage your medicines, dosage, frequency and reminder times.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeSubTab === 'list'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'glass-panel text-slate-700 hover:bg-white/80'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Medicine List</span>
        </button>
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeSubTab === 'daily'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'glass-panel text-slate-700 hover:bg-white/80'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Schedule</span>
        </button>
        <button
          onClick={() => setActiveSubTab('weekly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeSubTab === 'weekly'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'glass-panel text-slate-700 hover:bg-white/80'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Schedule</span>
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeSubTab === 'categories'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'glass-panel text-slate-700 hover:bg-white/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Categories</span>
        </button>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS BAR */}
      <div className="glass-panel rounded-3xl p-3 sm:p-4 border border-white/85 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Categories</option>
            <option>Pain Relief</option>
            <option>Supplement</option>
            <option>Diabetes</option>
            <option>Blood Pressure</option>
            <option>Antibiotics</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Completed</option>
          </select>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200/60 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>Sort by Name {sortAsc ? '(A-Z)' : '(Z-A)'}</span>
          </button>
        </div>
      </div>

      {/* 4. MEDICINES LIST VIEW OR ALTERNATE TABS */}
      {activeSubTab === 'list' && (
        <div className="flex flex-col gap-3">
          {filteredMedicines.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center border border-white/85">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-700">No medicines found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter settings.</p>
            </div>
          ) : (
            filteredMedicines.map((med) => {
              const isSelected = med.id === selectedMedicineId;
              return (
                <div
                  key={med.id}
                  onClick={() => setSelectedMedicineId(med.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-3xl glass-panel transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-blue-400/80 bg-white/90 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/40'
                      : 'border-white/80 hover:bg-white/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <PillIcon
                      color={med.pillColor}
                      size="lg"
                      type={med.pillType}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-slate-800">
                          {med.name}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                          {med.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {med.instructions || `${med.dosage} with water`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-200/50">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{med.frequency}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{med.reminderTimes.join(' · ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{med.status}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(med)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit medicine"
                        aria-label={`Edit ${med.name}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingMed(med);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete medicine"
                        aria-label={`Delete ${med.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ALTERNATE TAB: DAILY SCHEDULE */}
      {activeSubTab === 'daily' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/85 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Daily Medication Timeline</h3>
          <div className="space-y-3">
            {schedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <PillIcon color={item.pillColor} size="sm" type={item.pillColor === 'amber' ? 'capsule' : 'tablet'} />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{item.medicineName}</div>
                    <div className="text-xs text-slate-500">{item.dosage}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-700">{item.scheduledTime}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALTERNATE TAB: WEEKLY SCHEDULE */}
      {activeSubTab === 'weekly' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/85 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Weekly Calendar Overview</h3>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="p-3 rounded-2xl glass-panel-subtle border border-white/60">
                <div className="text-xs font-bold text-slate-700 mb-2">{day}</div>
                <div className="space-y-1.5">
                  <div className="text-[10px] bg-rose-100 text-rose-800 p-1 rounded font-medium truncate">Paracetamol</div>
                  <div className="text-[10px] bg-amber-100 text-amber-800 p-1 rounded font-medium truncate">Vitamin D3</div>
                  {idx < 5 && (
                    <div className="text-[10px] bg-blue-100 text-blue-800 p-1 rounded font-medium truncate">Metformin</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALTERNATE TAB: MANAGE CATEGORIES */}
      {activeSubTab === 'categories' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/85 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Medication Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Pain Relief', count: 1, color: 'text-rose-600 bg-rose-50' },
              { name: 'Supplement', count: 1, color: 'text-amber-600 bg-amber-50' },
              { name: 'Diabetes', count: 1, color: 'text-blue-600 bg-blue-50' },
              { name: 'Blood Pressure', count: 1, color: 'text-purple-600 bg-purple-50' },
              { name: 'Antibiotics', count: 0, color: 'text-emerald-600 bg-emerald-50' },
              { name: 'Cardiology', count: 0, color: 'text-cyan-600 bg-cyan-50' },
            ].map((cat) => (
              <div key={cat.name} className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">{cat.name}</div>
                  <div className="text-xs text-slate-500">{cat.count} medicines assigned</div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cat.color}`}>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BOTTOM SPLIT: MEDICINE DETAILS & 7-DAY ADHERENCE */}
      {selectedMed && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mt-2">
          
          {/* Left: Medicine Details Spotlight */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
              <h3 className="text-base font-bold text-slate-800">Medicine Details</h3>
              <button
                onClick={() => openEditModal(selectedMed)}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <PillIcon color={selectedMed.pillColor} size="xl" type={selectedMed.pillType} />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-800">{selectedMed.name}</h4>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    {selectedMed.category}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {selectedMed.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80">
                <span className="text-slate-400 font-semibold block mb-0.5">Dosage</span>
                <span className="font-bold text-slate-800 text-sm">{selectedMed.dosage}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80">
                <span className="text-slate-400 font-semibold block mb-0.5">Frequency</span>
                <span className="font-bold text-slate-800 text-sm">{selectedMed.frequency}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80">
                <span className="text-slate-400 font-semibold block mb-0.5">Reminder Times</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{selectedMed.reminderTimes.join(', ')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80">
                <span className="text-slate-400 font-semibold block mb-0.5">Start Date</span>
                <span className="font-bold text-slate-800 text-sm">{selectedMed.startDate}</span>
              </div>
              <div className="sm:col-span-2 p-3 rounded-2xl bg-white/60 border border-white/80">
                <span className="text-slate-400 font-semibold block mb-0.5">Instructions</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedMed.instructions}</span>
              </div>
            </div>
          </div>

          {/* Right: Adherence (Last 7 Days) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
              <h3 className="text-base font-bold text-slate-800">Adherence (Last 7 Days)</h3>
              <button 
                onClick={() => openEditModal(selectedMed)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-2 px-2">
              {last7DaysAdherence.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[10px] font-bold text-slate-500 font-mono mb-1">{item.value}%</span>
                  <div className="w-full max-w-[32px] bg-slate-200/40 rounded-t-lg h-24 flex items-end">
                    <div
                      style={{ height: `${item.value}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        item.value === 100
                          ? 'bg-blue-600'
                          : item.value > 0
                          ? 'bg-sky-400'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 mt-2">{item.day}</span>
                </div>
              ))}
            </div>

            {/* Bottom 3 Summary Pills */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200/60 text-center">
              <div className="p-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800">5 Taken</span>
              </div>
              <div className="p-2 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-800">1 Pending</span>
              </div>
              <div className="p-2 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-center justify-center gap-2">
                <X className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-800">1 Missed</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ADD / EDIT MEDICINE MODAL */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingMedId ? 'Edit Medicine' : 'Add New Medicine'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Paracetamol, Vitamin D3"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pain Relief">Pain Relief</option>
                <option value="Supplement">Supplement</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Blood Pressure">Blood Pressure</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Cardiology">Cardiology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dosage *
              </label>
              <input
                type="text"
                required
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 1 tablet, 500mg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pill Icon Style &amp; Color
              </label>
              <div className="flex items-center gap-2 py-1">
                {(['pink', 'amber', 'blue', 'purple', 'emerald'] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, pillColor: color })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === 'pink' ? 'bg-rose-500' :
                      color === 'amber' ? 'bg-amber-500' :
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'
                    } ${formData.pillColor === color ? 'scale-125 border-slate-900 ring-2 ring-blue-400' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructions
            </label>
            <input
              type="text"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g., 1 tablet after breakfast"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reminder Times *
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {formData.reminderTimes.map((time, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{time}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(idx)}
                    className="p-0.5 hover:text-rose-600 rounded-full"
                    title="Remove time"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {showAddTime ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTimeInput}
                    onChange={(e) => setNewTimeInput(e.target.value)}
                    placeholder="e.g. 09:00 PM"
                    className="w-28 px-2 py-1 text-xs rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddTime}
                    className="px-2 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTime(false)}
                    className="px-2 py-1 text-slate-500 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddTime(true)}
                  className="px-3 py-1.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-xs font-semibold hover:bg-blue-50 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Time</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 mt-2">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/30"
            >
              {editingMedId ? 'Update Medicine' : 'Save Medicine'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Medicine"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4 text-sm">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-slate-800">{deletingMed?.name}</span>? 
            This will also remove its associated reminders from today&apos;s schedule.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
