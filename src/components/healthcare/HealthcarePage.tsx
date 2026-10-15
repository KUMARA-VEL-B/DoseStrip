import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, HealthArticle } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Stethoscope, 
  BookOpen, 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  UserCheck, 
  ChevronRight, 
  ChevronDown, 
  Phone, 
  Award, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

export const HealthcarePage: React.FC = () => {
  const { doctors, articles, searchQuery: globalSearchQuery, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'both' | 'doctors' | 'library'>('both');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('All');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai, Tamil Nadu');

  // Doctor Details Modal
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  // Appointment Modal
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('2026-10-14');
  const [appointmentSlot, setAppointmentSlot] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<'In-Person' | 'Teleconsultation'>('In-Person');

  // Article Modal
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const specialties = [
    'All Specialties',
    'General Physician',
    'Cardiologist',
    'Endocrinologist',
    'Dermatologist',
    'Pediatrician',
  ];

  const articleCategories = [
    'All',
    'Nutrition',
    'Exercise',
    'Chronic Care',
    'Mental Health',
    'Medicine Tips',
  ];

  // Doctors filtering
  const filteredDoctors = useMemo(() => {
    const q = (doctorSearch || globalSearchQuery).toLowerCase();
    return doctors.filter((doc) => {
      const matchQuery =
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q);
      const matchSpecialty =
        selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;
      return matchQuery && matchSpecialty;
    });
  }, [doctors, doctorSearch, globalSearchQuery, selectedSpecialty]);

  // Articles filtering
  const filteredArticles = useMemo(() => {
    const q = (articleSearch || globalSearchQuery).toLowerCase();
    return articles.filter((art) => {
      const matchQuery =
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);
      const matchCat =
        selectedArticleCategory === 'All' || art.category === selectedArticleCategory;
      return matchQuery && matchCat;
    });
  }, [articles, articleSearch, globalSearchQuery, selectedArticleCategory]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    setBookingModalOpen(false);
    addToast({
      type: 'success',
      title: 'Appointment Requested (Demo)',
      message: `Your appointment with ${bookingDoctor.name} on ${appointmentDate} at ${appointmentSlot} has been scheduled.`,
    });
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full animate-in fade-in duration-300">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Healthcare
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Find trusted doctors and explore health articles for a healthier life.
          </p>
        </div>

        {/* Primary Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border border-white/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'both'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            All Views
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'doctors'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Health Library</span>
          </button>
        </div>
      </div>

      {/* 2. DEMO HEALTH DISCLAIMER CALLOUT */}
      <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/60 flex items-center justify-between gap-3 text-xs text-sky-900 shadow-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Educational Demo:</strong> Doctor profiles and health guides are mock resources for demonstration. Please consult licensed medical professionals for emergency or personalized medical care.
          </span>
        </div>
      </div>

      {/* 3. MAIN SPLIT CONTENT GRID (MATCHING IMAGE 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* =========================================
            LEFT COLUMN: DOCTOR DIRECTORY (Col 6 or Full)
           ========================================= */}
        {(activeTab === 'both' || activeTab === 'doctors') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col gap-4`}>
            
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col gap-4">
              
              {/* Doctor Directory Title & Subtitle */}
              <div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Find a Doctor</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search for doctors by name or specialty.
                </p>
              </div>

              {/* Search + City Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-7 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    placeholder="Search doctors, specialty, or location..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/70 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-5 relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs font-semibold rounded-xl bg-white/70 border border-slate-200 text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
                  >
                    <option>Chennai, Tamil Nadu</option>
                    <option>Bengaluru, Karnataka</option>
                    <option>Hyderabad, Telangana</option>
                    <option>Mumbai, Maharashtra</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Specialty Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      selectedSpecialty === spec
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white/60 hover:bg-white text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {/* Doctor List Cards (Matching 4 Doctors in Image 5) */}
              <div className="flex flex-col gap-3.5 mt-1">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl glass-panel-subtle hover:bg-white/80 transition-all border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-white shadow-xs shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-semibold text-blue-600">
                          {doc.specialty}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {doc.degree}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.hospital}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {doc.rating} ({doc.reviewCount} reviews)
                          </span>
                          <span>·</span>
                          <span>{doc.experienceYears}+ years exp</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Available Today</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 justify-end sm:justify-center">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setDoctorModalOpen(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-blue-600 border border-blue-200 text-xs font-semibold shadow-xs transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setBookingDoctor(doc);
                          setBookingModalOpen(true);
                        }}
                        className="w-full px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all whitespace-nowrap"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* =========================================
            RIGHT COLUMN: HEALTH LIBRARY (Col 6 or Full)
           ========================================= */}
        {(activeTab === 'both' || activeTab === 'library') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col gap-4`}>
            
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/85 shadow-md flex flex-col gap-4">
              
              {/* Library Title & Subtitle */}
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Health Library</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Read articles and tips for a healthier life.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Search health articles..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/70 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {articleCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedArticleCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      selectedArticleCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white/60 hover:bg-white text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 2-Column Article Grid (Matching 6 cards in Image 5) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 rounded-2xl glass-panel-subtle hover:bg-white/90 transition-all border border-white/80 flex flex-col justify-between shadow-xs group"
                  >
                    <div>
                      {/* Thumbnail with overlay category */}
                      <div className="relative h-28 rounded-xl overflow-hidden mb-2.5">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-blue-700 shadow-xs backdrop-blur-xs">
                          {art.category}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedArticle(art);
                        setArticleModalOpen(true);
                      }}
                      className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* DOCTOR PROFILE MODAL */}
      <Modal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        title="Doctor Profile"
        maxWidth="lg"
      >
        {selectedDoctor && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-start gap-4">
              <img
                src={selectedDoctor.avatarUrl}
                alt={selectedDoctor.name}
                className="w-20 h-20 rounded-2xl object-cover border border-white shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-base font-bold text-slate-800">{selectedDoctor.name}</h3>
                <p className="text-xs font-bold text-blue-600">{selectedDoctor.specialty}</p>
                <p className="text-xs text-slate-500">{selectedDoctor.degree}</p>
                <p className="text-xs text-slate-600 font-semibold mt-1">{selectedDoctor.hospital}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
              {selectedDoctor.bio}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Consultation Fee</span>
                <span className="text-sm font-bold text-slate-800">{selectedDoctor.consultationFee}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Hospital Location</span>
                <span className="text-sm font-bold text-slate-800">{selectedDoctor.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                onClick={() => setDoctorModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDoctorModalOpen(false);
                  setBookingDoctor(selectedDoctor);
                  setBookingModalOpen(true);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* APPOINTMENT BOOKING MODAL */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Schedule Appointment (Demo)"
        maxWidth="md"
      >
        {bookingDoctor && (
          <form onSubmit={handleBookSubmit} className="flex flex-col gap-4 text-sm">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
              <img
                src={bookingDoctor.avatarUrl}
                alt={bookingDoctor.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{bookingDoctor.name}</h4>
                <p className="text-xs text-blue-600 font-semibold">{bookingDoctor.specialty}</p>
                <p className="text-xs text-slate-500">{bookingDoctor.hospital}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Time Slot *
                </label>
                <select
                  value={appointmentSlot}
                  onChange={(e) => setAppointmentSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>09:30 AM</option>
                  <option>10:30 AM</option>
                  <option>11:30 AM</option>
                  <option>02:00 PM</option>
                  <option>04:30 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Consultation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultType('In-Person')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                    consultType === 'In-Person'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  In-Person (Hospital)
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType('Teleconsultation')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                    consultType === 'Teleconsultation'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Teleconsultation (Video)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30"
              >
                Confirm Booking (Demo)
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ARTICLE READER MODAL */}
      <Modal
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        title={selectedArticle?.title || 'Health Article'}
        maxWidth="2xl"
      >
        {selectedArticle && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/90 text-xs font-bold text-blue-700 backdrop-blur-xs">
                {selectedArticle.category}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
              <span>By {selectedArticle.author}</span>
              <span>Published {selectedArticle.publishedDate} · {selectedArticle.readTime}</span>
            </div>

            <div className="whitespace-pre-line text-slate-700 leading-relaxed text-xs sm:text-sm">
              {selectedArticle.content}
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
              <strong>Medical Disclaimer:</strong> This article is for informational and educational purposes only and does not constitute clinical diagnosis or medical counsel.
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setArticleModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Close Article
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
