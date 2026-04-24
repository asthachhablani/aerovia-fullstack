import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, MapPin, Calendar, Globe, Shield,
  Check, Edit3, Plane, Heart, TrendingUp, ChevronRight, LogOut, Camera,
} from 'lucide-react';
import { useAuth, getInitials } from '../context/AuthContext';

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
  'Germany', 'France', 'Japan', 'Singapore', 'UAE',
];

const TRAVEL_STYLES = [
  'Adventure', 'Culture', 'Luxury', 'Budget', 'Solo', 'Family', 'Food & Wine', 'Wildlife',
];

type Section = 'personal' | 'travel' | 'security' | 'docs';

const NAV_SECTIONS: { id: Section; label: string; icon: any }[] = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'travel', label: 'Travel Preferences', icon: Plane },
  { id: 'docs', label: 'Travel Documents', icon: Globe },
  { id: 'security', label: 'Account Security', icon: Shield },
];

export function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local form state
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    country: user?.country ?? '',
    city: user?.city ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
    passportNumber: user?.passportNumber ?? '',
    nationality: user?.nationality ?? '',
    travelPreferences: user?.travelPreferences ?? [],
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--av-bg)' }}>
        <div className="text-center">
          <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.3)' }}>NOT SIGNED IN</p>
          <Link to="/login" className="font-display text-2xl hover:text-white transition-colors" style={{ color: 'var(--av-accent)' }}>
            Sign in to view profile →
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.name);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const togglePref = (pref: string) => {
    setForm(prev => ({
      ...prev,
      travelPreferences: prev.travelPreferences.includes(pref)
        ? prev.travelPreferences.filter(p => p !== pref)
        : [...prev.travelPreferences, pref],
    }));
  };

  const inputClass = "w-full px-4 py-3.5 rounded-[6px] font-body text-sm outline-none transition-all";
  const inputStyle = (editable: boolean) => ({
    background: editable ? 'var(--av-surface)' : 'rgba(255,255,255,0.02)',
    border: `1px solid ${editable ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
    color: editable ? 'var(--av-text)' : 'rgba(240,238,233,0.65)',
    cursor: editable ? 'text' : 'default',
  });

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 72 }}
    >
      {/* ── PROFILE HEADER ── */}
      <div
        className="px-4 sm:px-8 lg:px-12 py-8 md:py-10"
        style={{ borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)' }}
      >
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div
                className="w-16 h-16 rounded-[10px] flex items-center justify-center flex-shrink-0 select-none"
                style={{ background: 'linear-gradient(135deg, rgba(92,111,255,0.3) 0%, rgba(92,111,255,0.08) 100%)', border: '1px solid rgba(92,111,255,0.35)' }}
              >
                <span className="font-display text-2xl" style={{ color: 'var(--av-accent)', letterSpacing: '-0.02em' }}>
                  {initials}
                </span>
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-[4px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--av-accent)' }}
                title="Change photo"
              >
                <Camera size={11} strokeWidth={2} color="#fff" />
              </button>
            </div>

            {/* Name and meta */}
            <div>
              <h1 className="font-display" style={{ fontSize: 'clamp(22px, 3vw, 30px)', color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {user.name}
              </h1>
              <p className="font-body text-[13px] mt-1" style={{ color: 'rgba(240,238,233,0.4)' }}>{user.email}</p>
              <p className="font-data text-[9px] tracking-[0.2em] mt-1.5" style={{ color: 'rgba(240,238,233,0.25)' }}>
                MEMBER SINCE {memberSince.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 sm:gap-8">
            {[
              { icon: Plane, value: '12', label: 'TRIPS' },
              { icon: Heart, value: '8', label: 'WISHLIST' },
              { icon: TrendingUp, value: '₹2.8L', label: 'SPENT' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon size={13} strokeWidth={1.5} className="mx-auto mb-1.5" style={{ color: 'rgba(240,238,233,0.3)' }} />
                <p className="font-data text-base" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p className="font-data text-[8px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row gap-6">

        {/* Sidebar nav */}
        <div className="flex-shrink-0 md:w-56">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0" style={{ scrollbarWidth: 'none' }}>
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setEditing(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-[6px] transition-all flex-shrink-0 md:flex-shrink text-left w-full"
                style={{
                  background: activeSection === s.id ? 'rgba(92,111,255,0.1)' : 'rgba(0,0,0,0)',
                  border: `1px solid ${activeSection === s.id ? 'rgba(92,111,255,0.3)' : 'rgba(0,0,0,0)'}`,
                  color: activeSection === s.id ? 'var(--av-text)' : 'rgba(240,238,233,0.4)',
                }}
              >
                <s.icon size={13} strokeWidth={1.5} className="flex-shrink-0" />
                <span className="font-data text-[10px] tracking-[0.15em] whitespace-nowrap">{s.label.toUpperCase()}</span>
                {activeSection === s.id && <ChevronRight size={11} strokeWidth={1.5} className="ml-auto hidden md:block" style={{ color: 'var(--av-accent)' }} />}
              </button>
            ))}

            {/* Divider */}
            <div className="hidden md:block h-[1px] my-2" style={{ background: 'var(--av-border)' }} />

            {/* Quick links */}
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-[6px] transition-all hidden md:flex" style={{ color: 'rgba(240,238,233,0.35)' }}>
              <TrendingUp size={13} strokeWidth={1.5} />
              <span className="font-data text-[10px] tracking-[0.15em]">DASHBOARD</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-[6px] transition-all w-full text-left hidden md:flex hover:text-white"
              style={{ color: 'rgba(255,107,53,0.6)' }}
            >
              <LogOut size={13} strokeWidth={1.5} />
              <span className="font-data text-[10px] tracking-[0.15em]">SIGN OUT</span>
            </button>
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="rounded-[8px] overflow-hidden"
              style={{ border: '1px solid var(--av-border)', background: 'var(--av-surface)' }}
            >
              {/* Section header */}
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--av-border)' }}>
                <div>
                  <p className="font-data text-[9px] tracking-[0.28em] mb-1" style={{ color: 'rgba(240,238,233,0.3)' }}>
                    {NAV_SECTIONS.find(s => s.id === activeSection)?.label.toUpperCase()}
                  </p>
                  <p className="font-body text-[13px]" style={{ color: 'rgba(240,238,233,0.5)' }}>
                    {activeSection === 'personal' && 'Basic info about you'}
                    {activeSection === 'travel' && 'How you like to travel'}
                    {activeSection === 'docs' && 'Passport and identity documents'}
                    {activeSection === 'security' && 'Password and account settings'}
                  </p>
                </div>
                {activeSection !== 'security' && (
                  <div className="flex items-center gap-3">
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px]"
                        style={{ background: 'rgba(200,241,53,0.12)', border: '1px solid rgba(200,241,53,0.3)' }}
                      >
                        <Check size={11} strokeWidth={2.5} style={{ color: 'var(--av-lime)' }} />
                        <span className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>SAVED</span>
                      </motion.div>
                    )}
                    {editing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setForm({ name: user.name, phone: user.phone, country: user.country, city: user.city, dateOfBirth: user.dateOfBirth, passportNumber: user.passportNumber, nationality: user.nationality, travelPreferences: user.travelPreferences }); setEditing(false); }}
                          className="font-data text-[10px] tracking-[0.2em] px-4 py-2 rounded-[5px] border transition-all"
                          style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.5)' }}
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={handleSave}
                          className="font-data text-[10px] tracking-[0.2em] px-4 py-2 rounded-[5px] flex items-center gap-1.5 hover:brightness-110 transition-all"
                          style={{ background: 'var(--av-lime)', color: '#06060A' }}
                        >
                          <Check size={11} strokeWidth={2.5} /> SAVE
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 font-data text-[10px] tracking-[0.2em] px-4 py-2 rounded-[5px] border transition-all hover:border-[rgba(92,111,255,0.4)]"
                        style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.5)' }}
                      >
                        <Edit3 size={11} strokeWidth={1.5} /> EDIT
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ── PERSONAL DETAILS ── */}
              {activeSection === 'personal' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <User size={10} strokeWidth={1.5} /> FULL NAME
                      </label>
                      <input
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        disabled={!editing}
                        className={inputClass}
                        style={inputStyle(editing)}
                        onFocus={e => editing && (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                        onBlur={e => editing && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <Mail size={10} strokeWidth={1.5} /> EMAIL ADDRESS
                      </label>
                      <input
                        value={user.email}
                        disabled
                        className={inputClass}
                        style={{ ...inputStyle(false), opacity: 0.5 }}
                      />
                    </div>

                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <Phone size={10} strokeWidth={1.5} /> PHONE NUMBER
                      </label>
                      <input
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder={editing ? '+91 98765 43210' : '—'}
                        disabled={!editing}
                        className={inputClass}
                        style={inputStyle(editing)}
                        onFocus={e => editing && (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                        onBlur={e => editing && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <Calendar size={10} strokeWidth={1.5} /> DATE OF BIRTH
                      </label>
                      <input
                        value={form.dateOfBirth}
                        onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                        placeholder={editing ? 'DD/MM/YYYY' : '—'}
                        disabled={!editing}
                        className={inputClass}
                        style={inputStyle(editing)}
                        onFocus={e => editing && (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                        onBlur={e => editing && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <MapPin size={10} strokeWidth={1.5} /> COUNTRY
                      </label>
                      {editing ? (
                        <div className="relative">
                          <select
                            value={form.country}
                            onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                            className={inputClass + ' appearance-none'}
                            style={{ ...inputStyle(true), paddingRight: 36 }}
                          >
                            <option value="" style={{ background: '#0E0E16' }}>Select country</option>
                            {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0E0E16' }}>{c}</option>)}
                          </select>
                          <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: 'rgba(240,238,233,0.3)' }} strokeWidth={1.5} />
                        </div>
                      ) : (
                        <div className={inputClass} style={inputStyle(false)}>
                          {form.country || <span style={{ color: 'rgba(240,238,233,0.2)' }}>—</span>}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <MapPin size={10} strokeWidth={1.5} /> CITY
                      </label>
                      <input
                        value={form.city}
                        onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                        placeholder={editing ? 'Mumbai, Delhi...' : '—'}
                        disabled={!editing}
                        className={inputClass}
                        style={inputStyle(editing)}
                        onFocus={e => editing && (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                        onBlur={e => editing && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── TRAVEL PREFERENCES ── */}
              {activeSection === 'travel' && (
                <div className="p-6">
                  <p className="font-data text-[9px] tracking-[0.25em] mb-5" style={{ color: 'rgba(240,238,233,0.3)' }}>
                    TRAVEL STYLES · SELECT ALL THAT APPLY
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {TRAVEL_STYLES.map(pref => {
                      const active = form.travelPreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          onClick={() => editing && togglePref(pref)}
                          disabled={!editing}
                          className="font-data text-[10px] tracking-[0.15em] px-4 py-2.5 rounded-[5px] border transition-all flex items-center gap-2"
                          style={{
                            background: active ? 'rgba(92,111,255,0.12)' : 'rgba(255,255,255,0.02)',
                            borderColor: active ? 'rgba(92,111,255,0.4)' : 'rgba(255,255,255,0.06)',
                            color: active ? 'var(--av-text)' : 'rgba(240,238,233,0.4)',
                            cursor: editing ? 'pointer' : 'default',
                            opacity: !editing && !active ? 0.5 : 1,
                          }}
                        >
                          {active && <Check size={10} strokeWidth={2.5} style={{ color: 'var(--av-accent)' }} />}
                          {pref}
                        </button>
                      );
                    })}
                  </div>

                  {form.travelPreferences.length === 0 && !editing && (
                    <p className="font-body text-[13px]" style={{ color: 'rgba(240,238,233,0.25)' }}>
                      No travel preferences set. Click EDIT to add some.
                    </p>
                  )}

                  <div className="mt-6 p-5 rounded-[6px]" style={{ background: 'rgba(92,111,255,0.05)', border: '1px solid rgba(92,111,255,0.15)' }}>
                    <p className="font-data text-[9px] tracking-[0.25em] mb-2" style={{ color: 'var(--av-accent)' }}>AI PERSONALISATION</p>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.5)' }}>
                      Your travel preferences are used by the AI concierge to surface better destination matches, itinerary options, and flash deals.
                    </p>
                  </div>
                </div>
              )}

              {/* ── TRAVEL DOCUMENTS ── */}
              {activeSection === 'docs' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <Globe size={10} strokeWidth={1.5} /> PASSPORT NUMBER
                      </label>
                      <input
                        value={form.passportNumber}
                        onChange={e => setForm(p => ({ ...p, passportNumber: e.target.value }))}
                        placeholder={editing ? 'P1234567' : '—'}
                        disabled={!editing}
                        className={inputClass}
                        style={inputStyle(editing)}
                        onFocus={e => editing && (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                        onBlur={e => editing && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    <div>
                      <label className="font-data text-[8px] tracking-[0.28em] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        <Globe size={10} strokeWidth={1.5} /> NATIONALITY
                      </label>
                      {editing ? (
                        <div className="relative">
                          <select
                            value={form.nationality}
                            onChange={e => setForm(p => ({ ...p, nationality: e.target.value }))}
                            className={inputClass + ' appearance-none'}
                            style={{ ...inputStyle(true), paddingRight: 36 }}
                          >
                            <option value="" style={{ background: '#0E0E16' }}>Select nationality</option>
                            {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0E0E16' }}>{c}</option>)}
                          </select>
                          <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: 'rgba(240,238,233,0.3)' }} strokeWidth={1.5} />
                        </div>
                      ) : (
                        <div className={inputClass} style={inputStyle(false)}>
                          {form.nationality || <span style={{ color: 'rgba(240,238,233,0.2)' }}>—</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 p-5 rounded-[6px]" style={{ background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.15)' }}>
                    <p className="font-data text-[9px] tracking-[0.25em] mb-2" style={{ color: 'var(--av-orange)' }}>PRIVACY NOTE</p>
                    <p className="font-body text-[12px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.45)' }}>
                      Passport data is stored locally on your device and never transmitted to any server. This is a demo platform.
                    </p>
                  </div>
                </div>
              )}

              {/* ── SECURITY ── */}
              {activeSection === 'security' && (
                <div className="p-6 space-y-4">
                  <div className="p-5 rounded-[6px] flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p className="font-data text-[10px] tracking-[0.2em] mb-1" style={{ color: 'var(--av-text)' }}>PASSWORD</p>
                      <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.4)' }}>Last changed: Never</p>
                    </div>
                    <button className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] border transition-all hover:border-[rgba(92,111,255,0.4)] flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.5)' }}>
                      CHANGE PASSWORD
                    </button>
                  </div>

                  <div className="p-5 rounded-[6px] flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p className="font-data text-[10px] tracking-[0.2em] mb-1" style={{ color: 'var(--av-text)' }}>ACCOUNT ID</p>
                      <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.4)' }}>AV-{user.id.toUpperCase()}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-[4px]" style={{ background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.25)' }}>
                      <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>ACTIVE</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-5" style={{ borderTop: '1px solid var(--av-border)' }}>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 font-data text-[10px] tracking-[0.2em] px-5 py-3 rounded-[6px] transition-all hover:bg-[rgba(255,107,53,0.1)]"
                      style={{ color: 'rgba(255,107,53,0.7)', border: '1px solid rgba(255,107,53,0.2)' }}
                    >
                      <LogOut size={13} strokeWidth={1.5} />
                      SIGN OUT OF AEROVIA
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
