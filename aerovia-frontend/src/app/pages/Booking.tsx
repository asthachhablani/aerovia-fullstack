import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { bookingsApi } from '../services/api';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Plane, Hotel, Shield, CreditCard, ChevronDown, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, label: 'ROUTE', icon: Plane },
  { id: 2, label: 'FLIGHT', icon: Plane },
  { id: 3, label: 'EXTRAS', icon: Hotel },
  { id: 4, label: 'PAYMENT', icon: CreditCard },
];

const AIRPORTS = [
  'DEL — New Delhi', 'BOM — Mumbai', 'BLR — Bengaluru', 'MAA — Chennai',
  'CCU — Kolkata', 'HYD — Hyderabad', 'GOI — Goa', 'AMD — Ahmedabad',
  'PNQ — Pune', 'COK — Kochi',
];

const DESTINATIONS_LIST = [
  'NRT — Tokyo, Japan', 'KIX — Osaka / Kyoto', 'KEF — Reykjavik, Iceland',
  'RAK — Marrakech, Morocco', 'MLE — Malé, Maldives', 'EZE — Buenos Aires',
  'LIS — Lisbon, Portugal', 'BGO — Bergen, Norway', 'DXB — Dubai, UAE',
  'SIN — Singapore', 'BKK — Bangkok, Thailand', 'CDG — Paris, France',
  'FCO — Rome, Italy', 'BCN — Barcelona, Spain', 'AMS — Amsterdam',
  'SYD — Sydney, Australia', 'NBO — Nairobi, Kenya', 'JFK — New York, USA',
];

const FLIGHTS = [
  { id: 'f1', airline: 'Air India', code: 'AI-307', dep: '23:15', arr: '10:30+1', duration: '7h 45m', stops: 'Direct', price: 42800, tag: 'BEST VALUE' },
  { id: 'f2', airline: 'Emirates', code: 'EK-512', dep: '02:30', arr: '14:55+1', duration: '8h 25m', stops: '1 stop · DXB', price: 38500, tag: 'LOWEST PRICE' },
  { id: 'f3', airline: 'JAL', code: 'JL-095', dep: '14:00', arr: '04:15+2', duration: '9h 15m', stops: '1 stop · BKK', price: 45200, tag: 'FULL SERVICE' },
  { id: 'f4', airline: 'IndiGo', code: '6E-811', dep: '06:00', arr: '18:30+1', duration: '8h 30m', stops: '1 stop · SIN', price: 34900, tag: 'BUDGET' },
];

const EXTRAS = [
  { id: 'hotel', label: 'Hotel Bundle', desc: '4-star, 5 nights, breakfast incl.', price: 18500, icon: Hotel },
  { id: 'insurance', label: 'Travel Insurance', desc: 'Full cover — medical & cancellation', price: 2800, icon: Shield },
];

function getTodayStr() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
}

export function Booking() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [from, setFrom] = useState('DEL — New Delhi');
  const [to, setTo] = useState('NRT — Tokyo, Japan');
  const [travelDate, setTravelDate] = useState(getTodayStr());
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState('f1');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cardNum, setCardNum] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  // Pre-fill from URL params (when coming from Destination / Packages page)
  useEffect(() => {
    const destName = searchParams.get('destName');
    const price = searchParams.get('price');
    const itinerary = searchParams.get('itinerary');
    const days = searchParams.get('days');

    if (destName) {
      const match = DESTINATIONS_LIST.find(d => d.toLowerCase().includes(destName.toLowerCase().split(',')[0]));
      if (match) setTo(match);
    }
    if (days) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setTravelDate(d.toISOString().split('T')[0]);
      const ret = new Date(d);
      ret.setDate(ret.getDate() + Number(days));
      setReturnDate(ret.toISOString().split('T')[0]);
    }
    if (price) {
      const p = Number(price);
      const closest = FLIGHTS.reduce((best, f) => Math.abs(f.price - p) < Math.abs(best.price - p) ? f : best);
      setSelectedFlight(closest.id);
    }
  }, [searchParams]);

  const baseFlight = FLIGHTS.find(f => f.id === selectedFlight);
  const basePrice = baseFlight?.price ?? 42800;
  const extrasCost = selectedExtras.reduce((sum, id) => {
    const e = EXTRAS.find(x => x.id === id);
    return sum + (e?.price ?? 0);
  }, 0);
  const totalPrice = (basePrice * passengers) + extrasCost;

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const advance = () => step < 4 && setStep(s => s + 1);
  const retreat = () => step > 1 && setStep(s => s - 1);

  const handleConfirm = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setConfirming(true);
    try {
      const destNameParam = searchParams.get('destName');
      const imageParam = searchParams.get('image');
      const itineraryParam = searchParams.get('itinerary');
      await bookingsApi.create({
        type: 'flight',
        from: from.split(' — ')[0],
        to: to.split(' — ')[0],
        flightCode: baseFlight?.code,
        airline: baseFlight?.airline,
        departure: baseFlight?.dep,
        arrival: baseFlight?.arr,
        duration: baseFlight?.duration,
        travelDate,
        returnDate: returnDate || undefined,
        passengers,
        extras: selectedExtras,
        basePrice,
        totalPrice,
        destinationName: destNameParam || to.split(' — ')[1] || to,
        destinationImage: imageParam ? decodeURIComponent(imageParam) : undefined,
        hotel: selectedExtras.includes('hotel') ? '4-Star Hotel Bundle' : undefined,
        status: 'confirmed',
      });
      setBookingDone(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch {
      setBookingDone(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
    setConfirming(false);
  };

  if (bookingDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--av-bg)' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.4)' }}>
            <Check size={28} strokeWidth={2} style={{ color: 'var(--av-lime)' }} />
          </div>
          <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-lime)' }}>BOOKING CONFIRMED</p>
          <h2 className="font-display text-4xl mb-3" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>You&apos;re going.</h2>
          <p className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.4)' }}>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Progress timeline */}
        <div className="flex items-center gap-0 mb-10 md:mb-16">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button onClick={() => s.id < step && setStep(s.id)} className="flex items-center gap-1.5 md:gap-2 group">
                <div className="w-7 h-7 rounded-[5px] flex items-center justify-center transition-all" style={{ background: step === s.id ? 'var(--av-accent)' : step > s.id ? 'rgba(200,241,53,0.2)' : 'var(--av-surface)', border: `1px solid ${step === s.id ? 'var(--av-accent)' : step > s.id ? 'rgba(200,241,53,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                  {step > s.id
                    ? <Check size={12} strokeWidth={2} style={{ color: 'var(--av-lime)' }} />
                    : <s.icon size={11} strokeWidth={1.5} style={{ color: step === s.id ? '#fff' : 'rgba(240,238,233,0.3)' }} />
                  }
                </div>
                <span className="font-data text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] hidden sm:block" style={{ color: step === s.id ? 'var(--av-text)' : step > s.id ? 'var(--av-lime)' : 'rgba(240,238,233,0.3)' }}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 md:mx-4 h-[1px]" style={{ background: step > s.id ? 'rgba(200,241,53,0.3)' : 'rgba(255,255,255,0.07)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

            {/* STEP 1: ROUTE */}
            {step === 1 && (
              <div>
                <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-accent)' }}>STEP 01 / CHOOSE YOUR ROUTE</p>
                <h2 className="font-display mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Where are you going?</h2>

                {searchParams.get('destName') && (
                  <div className="mb-6 px-4 py-3 rounded-[6px] flex items-center gap-3" style={{ background: 'rgba(92,111,255,0.08)', border: '1px solid rgba(92,111,255,0.2)' }}>
                    <span className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'var(--av-accent)' }}>PRE-FILLED FROM</span>
                    <span className="font-body text-sm" style={{ color: 'var(--av-text)' }}>{searchParams.get('destName')} · {searchParams.get('itinerary') || 'Package'}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>DEPARTING FROM</label>
                    <div className="relative">
                      <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-5 py-4 rounded-[6px] appearance-none font-body text-sm outline-none" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }}>
                        {AIRPORTS.map(a => <option key={a} value={a} style={{ background: '#0E0E16' }}>{a}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(240,238,233,0.3)' }} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>DESTINATION</label>
                    <div className="relative">
                      <select value={to} onChange={e => setTo(e.target.value)} className="w-full px-5 py-4 rounded-[6px] appearance-none font-body text-sm outline-none" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }}>
                        {DESTINATIONS_LIST.map(d => <option key={d} value={d} style={{ background: '#0E0E16' }}>{d}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(240,238,233,0.3)' }} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <div>
                    <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                      <Calendar size={9} className="inline mr-1" strokeWidth={1.5} />DEPARTURE DATE
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setTravelDate(e.target.value)}
                      className="w-full px-5 py-4 rounded-[6px] font-body text-sm outline-none"
                      style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)', colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                      <Calendar size={9} className="inline mr-1" strokeWidth={1.5} />RETURN DATE (OPT.)
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      min={travelDate || new Date().toISOString().split('T')[0]}
                      onChange={e => setReturnDate(e.target.value)}
                      className="w-full px-5 py-4 rounded-[6px] font-body text-sm outline-none"
                      style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)', colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>PASSENGERS</label>
                    <div className="flex items-center gap-4 px-5 py-4 rounded-[6px]" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="font-data text-lg w-6 h-6 rounded-[4px] flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: 'var(--av-text)' }}>−</button>
                      <span className="font-data text-base flex-1 text-center" style={{ color: 'var(--av-text)' }}>{passengers}</span>
                      <button onClick={() => setPassengers(Math.min(8, passengers + 1))} className="font-data text-lg w-6 h-6 rounded-[4px] flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: 'var(--av-text)' }}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FLIGHT */}
            {step === 2 && (
              <div>
                <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-accent)' }}>STEP 02 / SELECT FLIGHT</p>
                <h2 className="font-display mb-2" style={{ fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Available flights</h2>
                <p className="font-body text-sm mb-8" style={{ color: 'rgba(240,238,233,0.4)' }}>
                  {from.split(' — ')[0]} → {to.split(' — ')[0]} · {travelDate ? new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} · {passengers} pax
                </p>
                <div className="space-y-3 mb-10">
                  {FLIGHTS.map(flight => (
                    <motion.div key={flight.id} onClick={() => setSelectedFlight(flight.id)} whileHover={{ y: -1 }} className="p-4 md:p-6 rounded-[6px] cursor-pointer transition-all" style={{ border: `1px solid ${selectedFlight === flight.id ? 'rgba(92,111,255,0.45)' : 'rgba(255,255,255,0.07)'}`, background: selectedFlight === flight.id ? 'rgba(92,111,255,0.07)' : 'var(--av-surface)' }}>
                      {/* Mobile */}
                      <div className="flex items-center justify-between mb-3 md:hidden">
                        <div>
                          <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.35)' }}>{flight.code}</p>
                          <p className="font-body text-sm" style={{ color: 'var(--av-text)' }}>{flight.airline}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-data text-[8px] tracking-[0.2em] px-2 py-0.5 rounded-[3px] mb-1 inline-block" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}>{flight.tag}</span>
                          <p className="font-data text-lg" style={{ color: 'var(--av-text)' }}>₹{(flight.price * passengers).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:hidden">
                        <div className="flex items-center gap-3">
                          <span className="font-data text-lg" style={{ color: 'var(--av-text)' }}>{flight.dep}</span>
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="font-data text-[8px]" style={{ color: 'rgba(240,238,233,0.3)' }}>{flight.duration}</span>
                            <div className="w-16 h-[1px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
                            <span className="font-data text-[8px]" style={{ color: flight.stops === 'Direct' ? 'var(--av-lime)' : 'rgba(240,238,233,0.3)' }}>{flight.stops}</span>
                          </div>
                          <span className="font-data text-lg" style={{ color: 'var(--av-text)' }}>{flight.arr}</span>
                        </div>
                      </div>
                      {/* Desktop */}
                      <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          <div>
                            <p className="font-data text-[9px] tracking-[0.2em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>{flight.code}</p>
                            <p className="font-body text-sm" style={{ color: 'var(--av-text)' }}>{flight.airline}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-data text-xl" style={{ color: 'var(--av-text)' }}>{flight.dep}</span>
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.3)' }}>{flight.duration}</span>
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-[1px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
                                <Plane size={10} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.3)' }} />
                                <div className="w-12 h-[1px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
                              </div>
                              <span className="font-data text-[8px]" style={{ color: flight.stops === 'Direct' ? 'var(--av-lime)' : 'rgba(240,238,233,0.3)' }}>{flight.stops}</span>
                            </div>
                            <span className="font-data text-xl" style={{ color: 'var(--av-text)' }}>{flight.arr}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-data text-[8px] tracking-[0.2em] px-2 py-0.5 rounded-[3px] mb-2 inline-block" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}>{flight.tag}</span>
                          <p className="font-data text-xl" style={{ color: 'var(--av-text)' }}>₹{(flight.price * passengers).toLocaleString()}</p>
                          <p className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.35)' }}>per {passengers > 1 ? `${passengers} pax` : 'person'}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: EXTRAS */}
            {step === 3 && (
              <div>
                <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-accent)' }}>STEP 03 / ADD EXTRAS</p>
                <h2 className="font-display mb-2" style={{ fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Enhance your trip</h2>
                <p className="font-body text-sm mb-8" style={{ color: 'rgba(240,238,233,0.4)' }}>Optional add-ons. Skip if you prefer to sort these yourself.</p>
                <div className="space-y-4 mb-10">
                  {EXTRAS.map(extra => {
                    const selected = selectedExtras.includes(extra.id);
                    return (
                      <motion.div key={extra.id} onClick={() => toggleExtra(extra.id)} whileHover={{ y: -1 }} className="p-5 md:p-6 rounded-[6px] cursor-pointer flex items-center justify-between transition-all" style={{ border: `1px solid ${selected ? 'rgba(92,111,255,0.4)' : 'rgba(255,255,255,0.07)'}`, background: selected ? 'rgba(92,111,255,0.07)' : 'var(--av-surface)' }}>
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="w-10 h-10 rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <extra.icon size={16} strokeWidth={1.5} style={{ color: selected ? 'var(--av-accent)' : 'rgba(240,238,233,0.4)' }} />
                          </div>
                          <div>
                            <p className="font-body text-sm" style={{ color: 'var(--av-text)' }}>{extra.label}</p>
                            <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.4)' }}>{extra.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                          <span className="font-data text-sm md:text-base" style={{ color: 'var(--av-text)' }}>+₹{extra.price.toLocaleString()}</span>
                          <div className="w-5 h-5 rounded-[4px] flex items-center justify-center transition-all" style={{ background: selected ? 'var(--av-accent)' : 'rgba(0,0,0,0)', border: `1px solid ${selected ? 'var(--av-accent)' : 'rgba(255,255,255,0.15)'}` }}>
                            {selected && <Check size={11} strokeWidth={2.5} color="#fff" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 4 && (
              <div>
                <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-accent)' }}>STEP 04 / PAYMENT</p>
                <h2 className="font-display mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Confirm &amp; pay</h2>

                {!isAuthenticated && (
                  <div className="mb-6 px-5 py-4 rounded-[6px] flex items-center gap-4" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}>
                    <span className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'var(--av-orange)' }}>⚠ LOGIN REQUIRED</span>
                    <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.5)' }}>You need to be logged in to confirm a booking.</p>
                    <Link to="/login" className="font-data text-[9px] tracking-[0.2em] px-4 py-2 rounded-[4px] ml-auto flex-shrink-0" style={{ background: 'var(--av-accent)', color: '#fff' }}>LOGIN</Link>
                  </div>
                )}

                <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 mb-10">
                  <div className="space-y-4">
                    <div>
                      <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>CARD NUMBER</label>
                      <input type="text" placeholder="•••• •••• •••• ••••" value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} maxLength={19} className="w-full px-5 py-4 rounded-[6px] font-data text-sm outline-none tracking-widest" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['EXPIRY (MM/YY)', 'CVV'].map(label => (
                        <div key={label}>
                          <label className="font-data text-[9px] tracking-[0.25em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>{label}</label>
                          <input type="text" placeholder={label === 'EXPIRY (MM/YY)' ? '01/27' : '•••'} maxLength={label === 'EXPIRY (MM/YY)' ? 5 : 3} className="w-full px-5 py-4 rounded-[6px] font-data text-sm outline-none" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }} />
                        </div>
                      ))}
                    </div>
                    <p className="font-data text-[9px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.25)' }}>DEMO MODE — no real charge will occur</p>
                  </div>
                  <div className="rounded-[6px] p-5 md:p-6" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="font-data text-[9px] tracking-[0.3em] mb-5" style={{ color: 'rgba(240,238,233,0.35)' }}>BOOKING SUMMARY</p>
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between">
                        <span className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.55)' }}>{from.split(' — ')[0]} → {to.split(' — ')[0]}</span>
                        <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.4)' }}>{travelDate ? new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.55)' }}>{baseFlight?.airline} {baseFlight?.code} · {passengers} pax</span>
                        <span className="font-data text-sm" style={{ color: 'var(--av-text)' }}>₹{(basePrice * passengers).toLocaleString()}</span>
                      </div>
                      {selectedExtras.map(id => {
                        const e = EXTRAS.find(x => x.id === id);
                        return e ? (
                          <div key={id} className="flex justify-between">
                            <span className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.55)' }}>{e.label}</span>
                            <span className="font-data text-sm" style={{ color: 'var(--av-text)' }}>₹{e.price.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="pt-4 flex justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="font-data text-[11px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.4)' }}>TOTAL</span>
                      <span className="font-data text-2xl" style={{ color: 'var(--av-lime)' }}>₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 pb-28 md:pb-8">
          {step > 1 && (
            <button onClick={retreat} className="font-data text-[10px] tracking-[0.2em] px-5 md:px-6 py-3.5 rounded-[6px] border flex items-center gap-2 hover:border-[rgba(255,255,255,0.2)] transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.5)' }}>
              <ArrowLeft size={12} strokeWidth={2} /> BACK
            </button>
          )}
          <button
            onClick={step === 4 ? handleConfirm : advance}
            disabled={confirming}
            className="font-data text-[10px] tracking-[0.2em] px-7 md:px-8 py-3.5 rounded-[6px] flex items-center gap-2.5 hover:brightness-110 transition-all disabled:opacity-60"
            style={{ background: step === 4 ? 'var(--av-lime)' : 'var(--av-accent)', color: step === 4 ? '#06060A' : '#fff' }}
          >
            {confirming ? 'CONFIRMING...' : step === 4 ? 'CONFIRM BOOKING' : 'CONTINUE'}
            <ArrowRight size={12} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Sticky price bar */}
      <motion.div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-8 py-4 md:hidden" style={{ background: 'rgba(14,14,22,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <div>
          <p className="font-data text-[8px] tracking-[0.25em]" style={{ color: 'rgba(240,238,233,0.35)' }}>CURRENT TOTAL</p>
          <motion.p key={totalPrice} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-data text-xl" style={{ color: 'var(--av-lime)' }}>₹{totalPrice.toLocaleString()}</motion.p>
        </div>
        <div className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.35)' }}>STEP {step} / {STEPS.length}</div>
      </motion.div>

      {/* Desktop floating price */}
      <motion.div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-30 items-center gap-6 px-8 py-4 rounded-[8px]" style={{ background: 'rgba(14,14,22,0.96)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <div>
          <p className="font-data text-[8px] tracking-[0.25em]" style={{ color: 'rgba(240,238,233,0.35)' }}>CURRENT TOTAL</p>
          <motion.p key={totalPrice} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-data text-xl" style={{ color: 'var(--av-lime)' }}>₹{totalPrice.toLocaleString()}</motion.p>
        </div>
        <div className="w-[1px] h-10" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.35)' }}>{STEPS[step - 1].label} · STEP {step} OF {STEPS.length}</div>
      </motion.div>
    </div>
  );
}
