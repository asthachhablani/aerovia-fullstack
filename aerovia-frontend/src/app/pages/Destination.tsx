import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, MapPin, Thermometer, Clock, Globe, DollarSign, Calendar, Loader2, Heart } from 'lucide-react';
import { getDestination } from '../data/destinations';
import { dataApi, wishlistApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STAT_ICONS: Record<string, React.ReactNode> = {
  weather: <Thermometer size={11} strokeWidth={1.5} />,
  avgCost: <DollarSign size={11} strokeWidth={1.5} />,
  bestSeason: <Calendar size={11} strokeWidth={1.5} />,
  flightTime: <Clock size={11} strokeWidth={1.5} />,
  timezone: <Globe size={11} strokeWidth={1.5} />,
  currency: <DollarSign size={11} strokeWidth={1.5} />,
  population: <MapPin size={11} strokeWidth={1.5} />,
  language: <Globe size={11} strokeWidth={1.5} />,
};

type MobileTab = 'info' | 'itineraries';

interface DestData {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  tag: string;
  price: number;
  temp?: string;
  bestMonth?: string;
  desc?: string;
  stats?: Record<string, string>;
  itineraries?: Array<{ id: string; days: number; title: string; price: number; tag: string; highlights: string[] }>;
}

function buildFallbackStats(dest: DestData): Record<string, string> {
  return {
    avgCost: dest.price ? `₹${dest.price.toLocaleString()}` : 'N/A',
    bestSeason: dest.bestMonth ? dest.bestMonth : 'Year round',
    weather: dest.temp || 'Varies',
    flightTime: 'Check airline',
    timezone: 'Local time',
    currency: 'Local currency',
    population: 'N/A',
    language: 'Local',
  };
}

function buildFallbackItineraries(dest: DestData) {
  return [
    {
      id: `${dest.id}-1`,
      days: 5,
      title: `${dest.name} Explorer`,
      price: dest.price || 45000,
      tag: 'POPULAR',
      highlights: [
        `Arrive in ${dest.name}`,
        'City sightseeing tour',
        'Local cuisine experience',
        'Day trip to nearby attractions',
        'Departure',
      ],
    },
    {
      id: `${dest.id}-2`,
      days: 7,
      title: `${dest.name} Complete`,
      price: Math.round((dest.price || 45000) * 1.35),
      tag: 'COMPREHENSIVE',
      highlights: [
        `Arrive in ${dest.name}`,
        'Airport hotel transfer',
        'Guided sightseeing',
        'Cultural immersion day',
        'Day trip excursion',
        'Leisure day',
        'Departure day',
      ],
    },
  ];
}

export function Destination() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [dest, setDest] = useState<DestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [mobileTab, setMobileTab] = useState<MobileTab>('info');
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    // First try static data (rich with full stats + itineraries)
    const staticDest = getDestination(id);
    if (staticDest) {
      setDest(staticDest as DestData);
      setLoading(false);
      return;
    }
    // Fall back to API for generated destinations
    dataApi.getDestination(id)
      .then((res: any) => {
        const d = res.data as DestData;
        if (d) setDest(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated || !dest) return;
    setWishlistLoading(true);
    try {
      await wishlistApi.add('destination', dest.id, {
        name: dest.name,
        image: dest.image,
        price: dest.price,
        tag: dest.tag,
        country: dest.country,
      });
      setWishlisted(true);
    } catch {
      setWishlisted(true);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--av-bg)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--av-accent)' }} />
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--av-bg)' }}>
        <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.3)' }}>404 / DESTINATION NOT FOUND</p>
        <Link to="/search" className="font-display text-2xl" style={{ color: 'var(--av-text)' }}>Explore others →</Link>
      </div>
    );
  }

  const stats = dest.stats || buildFallbackStats(dest);
  const itineraries = (dest.itineraries && dest.itineraries.length > 0) ? dest.itineraries : buildFallbackItineraries(dest);
  const statEntries = Object.entries(stats);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ background: 'var(--av-bg)', minHeight: '100vh' }}>

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden flex flex-col" style={{ paddingTop: 64 }}>
        <div className="relative overflow-hidden" style={{ height: '55vh', minHeight: 280 }}>
          <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.4'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,6,10,0.35) 0%, rgba(6,6,10,0.1) 35%, rgba(6,6,10,0.85) 90%, rgba(6,6,10,1) 100%)' }} />
          <div className="grain-overlay" />

          <Link to="/search" className="absolute top-4 left-5 z-10 flex items-center gap-2 font-data text-[9px] tracking-[0.2em] px-3 py-2 rounded-[4px]" style={{ background: 'rgba(6,6,10,0.6)', color: 'rgba(240,238,233,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ArrowLeft size={10} strokeWidth={1.5} /> BACK
          </Link>

          <div className="absolute top-4 right-5 z-10 flex items-center gap-2">
            <span className="font-data text-[9px] tracking-[0.28em] px-2.5 py-1 rounded-[3px]" style={{ background: 'rgba(92,111,255,0.2)', color: 'var(--av-accent)', border: '1px solid rgba(92,111,255,0.3)' }}>{dest.tag}</span>
            {isAuthenticated && (
              <button onClick={handleWishlist} disabled={wishlistLoading || wishlisted} className="w-8 h-8 rounded-[4px] flex items-center justify-center transition-all" style={{ background: wishlisted ? 'rgba(255,107,53,0.2)' : 'rgba(6,6,10,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${wishlisted ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                <Heart size={13} strokeWidth={1.5} style={{ color: wishlisted ? 'var(--av-orange)' : 'rgba(240,238,233,0.6)' }} fill={wishlisted ? 'rgba(255,107,53,0.5)' : 'none'} />
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
            <h1 className="font-display" style={{ fontSize: 'clamp(44px, 14vw, 68px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9 }}>{dest.name}</h1>
            <p className="font-body mt-2" style={{ fontSize: 13, color: 'rgba(240,238,233,0.5)' }}>{dest.desc || `Explore ${dest.name}, ${dest.country}.`}</p>
            <p className="font-data text-[10px] mt-1" style={{ color: 'rgba(240,238,233,0.35)' }}>{dest.country} · {dest.region}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex" style={{ borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)' }}>
          {(['info', 'itineraries'] as MobileTab[]).map(tab => (
            <button key={tab} onClick={() => setMobileTab(tab)} className="flex-1 py-3.5 font-data text-[10px] tracking-[0.2em] transition-colors" style={{ color: mobileTab === tab ? 'var(--av-text)' : 'rgba(240,238,233,0.35)', borderBottom: mobileTab === tab ? '2px solid var(--av-accent)' : '2px solid transparent' }}>
              {tab === 'info' ? 'DESTINATION DATA' : 'ITINERARIES'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mobileTab === 'info' && (
            <motion.div key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="px-5 py-6">
              <p className="font-data text-[8px] tracking-[0.3em] mb-5" style={{ color: 'rgba(240,238,233,0.25)' }}>DESTINATION DATA</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {statEntries.map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span style={{ color: 'rgba(240,238,233,0.3)' }}>{STAT_ICONS[key] || <Globe size={11} strokeWidth={1.5} />}</span>
                      <span className="font-data text-[8px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                    </div>
                    <p className="font-data text-[12px]" style={{ color: 'var(--av-text)' }}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--av-border)' }}>
                <p className="font-data text-[8px] tracking-[0.3em] mb-1" style={{ color: 'rgba(240,238,233,0.25)' }}>REGION</p>
                <p className="font-data text-[11px]" style={{ color: 'var(--av-accent)' }}>{dest.region}</p>
              </div>
            </motion.div>
          )}
          {mobileTab === 'itineraries' && (
            <motion.div key="itineraries" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="px-4 py-5">
              <p className="font-data text-[9px] tracking-[0.3em] mb-5 px-1" style={{ color: 'rgba(240,238,233,0.3)' }}>ITINERARY OPTIONS · {itineraries.length}</p>
              {itineraries.map((it, idx) => (
                <motion.div key={it.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} onClick={() => setSelectedItinerary(idx)} className="mb-3 rounded-[6px] p-5 transition-all cursor-pointer" style={{ border: `1px solid ${selectedItinerary === idx ? 'rgba(92,111,255,0.45)' : 'rgba(255,255,255,0.06)'}`, background: selectedItinerary === idx ? 'rgba(92,111,255,0.08)' : 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-data text-[8px] tracking-[0.25em] px-2 py-0.5 rounded-[3px] mb-2 inline-block" style={{ background: it.tag === 'BESTSELLER' ? 'rgba(200,241,53,0.15)' : 'rgba(255,107,53,0.1)', color: it.tag === 'BESTSELLER' ? 'var(--av-lime)' : 'var(--av-orange)', border: `1px solid ${it.tag === 'BESTSELLER' ? 'rgba(200,241,53,0.3)' : 'rgba(255,107,53,0.25)'}` }}>{it.tag}</span>
                      <h3 className="font-display text-base" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{it.title}</h3>
                    </div>
                    <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{it.days}D</span>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {it.highlights.slice(0, 3).map((h, hi) => (
                      <div key={hi} className="flex items-start gap-2">
                        <span className="font-data text-[8px] mt-0.5" style={{ color: 'var(--av-accent)' }}>◆</span>
                        <span className="font-body text-[11px]" style={{ color: 'rgba(240,238,233,0.5)' }}>{h}</span>
                      </div>
                    ))}
                    {it.highlights.length > 3 && <p className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.25)' }}>+{it.highlights.length - 3} more</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-data text-base" style={{ color: 'var(--av-lime)' }}>₹{it.price.toLocaleString()}</span>
                    <Link to={`/book?destination=${dest.id}&destName=${encodeURIComponent(dest.name)}&price=${it.price}&itinerary=${encodeURIComponent(it.title)}&days=${it.days}&image=${encodeURIComponent(dest.image)}`} className="font-data text-[9px] tracking-[0.2em] px-4 py-2 rounded-[4px] flex items-center gap-1.5" style={{ background: 'var(--av-accent)', color: '#fff' }}>
                      BOOK <ArrowRight size={10} strokeWidth={2} />
                    </Link>
                  </div>
                </motion.div>
              ))}
              <div className="mt-2 p-5 rounded-[6px]" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
                <p className="font-data text-[9px] tracking-[0.2em] mb-2" style={{ color: 'rgba(240,238,233,0.3)' }}>CUSTOM ROUTE</p>
                <p className="font-body text-[12px] mb-3" style={{ color: 'rgba(240,238,233,0.45)' }}>Build your own {dest.name} itinerary with AI.</p>
                <Link to="/search" className="font-data text-[9px] tracking-[0.2em] px-4 py-2 rounded-[4px] border w-full flex items-center justify-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.4)' }}>
                  OPEN AI CHAT
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex" style={{ paddingTop: 0, minHeight: '100vh' }}>
        {/* Left: Stats */}
        <div className="flex-shrink-0 flex flex-col justify-between py-8 px-6 relative" style={{ width: 200, borderRight: '1px solid var(--av-border)', background: 'var(--av-surface)', paddingTop: 96 }}>
          <div>
            <Link to="/search" className="flex items-center gap-2 font-data text-[9px] tracking-[0.2em] mb-10 hover:text-white transition-colors" style={{ color: 'rgba(240,238,233,0.35)' }}>
              <ArrowLeft size={11} strokeWidth={1.5} /> BACK
            </Link>
            <p className="font-data text-[8px] tracking-[0.3em] mb-6" style={{ color: 'rgba(240,238,233,0.25)' }}>DESTINATION DATA</p>
            {statEntries.map(([key, value], statIdx) => (
              <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: statIdx * 0.05 }} className="mb-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <span style={{ color: 'rgba(240,238,233,0.3)' }}>{STAT_ICONS[key] || <Globe size={11} strokeWidth={1.5} />}</span>
                  <span className="font-data text-[8px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                </div>
                <p className="font-data text-[12px]" style={{ color: 'var(--av-text)' }}>{value}</p>
              </motion.div>
            ))}
          </div>
          <div>
            <div className="w-full h-[1px] mb-5" style={{ background: 'var(--av-border)' }} />
            <p className="font-data text-[8px] tracking-[0.3em] mb-1" style={{ color: 'rgba(240,238,233,0.25)' }}>REGION</p>
            <p className="font-data text-[11px]" style={{ color: 'var(--av-accent)' }}>{dest.region}</p>
          </div>
        </div>

        {/* Center: Image */}
        <div className="relative flex-1 min-h-screen overflow-hidden">
          <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.4'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,6,10,0.4) 0%, rgba(6,6,10,0.1) 40%, rgba(6,6,10,0.75) 85%, rgba(6,6,10,0.95) 100%)' }} />
          <div className="grain-overlay" />

          {/* Wishlist button */}
          {isAuthenticated && (
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading || wishlisted}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-[5px] transition-all"
              style={{ background: wishlisted ? 'rgba(255,107,53,0.15)' : 'rgba(6,6,10,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${wishlisted ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.1)'}` }}
            >
              <Heart size={13} strokeWidth={1.5} style={{ color: wishlisted ? 'var(--av-orange)' : 'rgba(240,238,233,0.5)' }} fill={wishlisted ? 'rgba(255,107,53,0.5)' : 'none'} />
              <span className="font-data text-[9px] tracking-[0.2em]" style={{ color: wishlisted ? 'var(--av-orange)' : 'rgba(240,238,233,0.5)' }}>{wishlisted ? 'SAVED' : 'SAVE'}</span>
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 px-12 pb-12 z-10" style={{ paddingTop: 96 }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <span className="font-data text-[9px] tracking-[0.28em] px-2.5 py-1 rounded-[3px] mb-5 inline-block" style={{ background: 'rgba(92,111,255,0.2)', color: 'var(--av-accent)', border: '1px solid rgba(92,111,255,0.3)' }}>{dest.tag}</span>
              <h1 className="font-display" style={{ fontSize: 'clamp(56px, 7vw, 92px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9, marginBottom: 16 }}>{dest.name}</h1>
              <p className="font-body text-base max-w-md mb-2 leading-relaxed" style={{ color: 'rgba(240,238,233,0.55)' }}>{dest.desc || `Explore ${dest.name}, ${dest.country}.`}</p>
              <p className="font-data text-[11px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{dest.country} · {dest.region}</p>
            </motion.div>
          </div>
          <div className="absolute top-0 left-0 right-0 px-12 z-10" style={{ paddingTop: 96 + 20 }}>
            <p className="font-data text-[9px] tracking-[0.3em]" style={{ color: 'rgba(240,238,233,0.3)' }}>{dest.name.toUpperCase()} / {dest.country.toUpperCase()}</p>
          </div>
        </div>

        {/* Right: Itineraries */}
        <div className="flex-shrink-0 overflow-y-auto flex flex-col" style={{ width: 320, borderLeft: '1px solid var(--av-border)', background: 'var(--av-surface)', paddingTop: 96 }}>
          <div className="p-6">
            <p className="font-data text-[9px] tracking-[0.3em] mb-6" style={{ color: 'rgba(240,238,233,0.3)' }}>ITINERARY OPTIONS · {itineraries.length}</p>
            {itineraries.map((it, idx) => (
              <motion.div key={it.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.1 }} onClick={() => setSelectedItinerary(idx)} className="mb-4 rounded-[6px] p-5 transition-all cursor-pointer" style={{ border: `1px solid ${selectedItinerary === idx ? 'rgba(92,111,255,0.45)' : 'rgba(255,255,255,0.06)'}`, background: selectedItinerary === idx ? 'rgba(92,111,255,0.08)' : 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-data text-[8px] tracking-[0.25em] px-2 py-0.5 rounded-[3px] mb-2 inline-block" style={{ background: it.tag === 'BESTSELLER' ? 'rgba(200,241,53,0.15)' : 'rgba(255,107,53,0.1)', color: it.tag === 'BESTSELLER' ? 'var(--av-lime)' : 'var(--av-orange)', border: `1px solid ${it.tag === 'BESTSELLER' ? 'rgba(200,241,53,0.3)' : 'rgba(255,107,53,0.25)'}` }}>{it.tag}</span>
                    <h3 className="font-display text-base" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{it.title}</h3>
                  </div>
                  <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{it.days}D</span>
                </div>
                <div className="space-y-1.5 mb-4">
                  {it.highlights.slice(0, 4).map((h, hi) => (
                    <div key={hi} className="flex items-start gap-2">
                      <span className="font-data text-[8px] mt-0.5" style={{ color: 'var(--av-accent)' }}>◆</span>
                      <span className="font-body text-[11px]" style={{ color: 'rgba(240,238,233,0.5)' }}>{h}</span>
                    </div>
                  ))}
                  {it.highlights.length > 4 && <p className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.25)' }}>+{it.highlights.length - 4} more</p>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-data text-base" style={{ color: 'var(--av-lime)' }}>₹{it.price.toLocaleString()}</span>
                  {selectedItinerary === idx && (
                    <Link
                      to={`/book?destination=${dest.id}&destName=${encodeURIComponent(dest.name)}&price=${it.price}&itinerary=${encodeURIComponent(it.title)}&days=${it.days}&image=${encodeURIComponent(dest.image)}`}
                      className="font-data text-[9px] tracking-[0.2em] px-4 py-2 rounded-[4px] flex items-center gap-1.5"
                      style={{ background: 'var(--av-accent)', color: '#fff' }}
                    >
                      BOOK <ArrowRight size={10} strokeWidth={2} />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
            <div className="mt-4 p-5 rounded-[6px]" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
              <p className="font-data text-[9px] tracking-[0.2em] mb-2" style={{ color: 'rgba(240,238,233,0.3)' }}>CUSTOM ROUTE</p>
              <p className="font-body text-[12px] mb-3" style={{ color: 'rgba(240,238,233,0.45)' }}>Build your own {dest.name} itinerary with AI guidance.</p>
              <Link to="/search" className="font-data text-[9px] tracking-[0.2em] px-4 py-2 rounded-[4px] border w-full flex items-center justify-center gap-2 hover:border-[rgba(92,111,255,0.4)] transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.4)' }}>
                OPEN AI CHAT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
