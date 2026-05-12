import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Loader2, Star, Package, Clock, Users } from 'lucide-react';
import { dataApi } from '../services/api';

interface Pkg {
  id: string;
  title: string;
  destination: string;
  image: string;
  duration: string;
  price: number;
  tag: string;
  rating: number;
  reviews: number;
  inclusions?: string[];
  desc?: string;
}

const TAGS = ['All', 'BESTSELLER', 'LUXURY', 'ADVENTURE', 'CULTURAL', 'WELLNESS', 'WILDLIFE', 'SEASONAL', 'SELF DRIVE', 'EXPLORER'];

const PAGE_SIZE = 18;

export function Packages() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTag, setActiveTag] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchPackages = useCallback(async (tag: string, p: number, append = false) => {
    if (p === 1) setLoading(true); else setLoadingMore(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(PAGE_SIZE) };
      if (tag && tag !== 'All') params.tag = tag;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await dataApi.getPackages(params) as any;
      setTotal(res.total ?? 0);
      setPackages(prev => append ? [...prev, ...(res.data || [])] : (res.data || []));
    } catch {
      if (!append) setPackages([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [minPrice, maxPrice]);

  useEffect(() => { fetchPackages('All', 1); }, []);

  const handleTag = (t: string) => {
    setActiveTag(t);
    setPage(1);
    fetchPackages(t, 1);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPackages(activeTag, next, true);
  };

  const hasMore = packages.length < total;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}>

      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-8">
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'var(--av-accent)' }}>
          AEROVIA / HOLIDAY PACKAGES
        </motion.p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 72px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9 }}>
            Curated packages.<br /><span style={{ color: 'rgba(240,238,233,0.35)' }}>Everything included.</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 px-5 py-3 rounded-[6px] flex-shrink-0" style={{ border: '1px solid rgba(92,111,255,0.2)', background: 'rgba(92,111,255,0.05)' }}>
            <Package size={14} strokeWidth={1.5} style={{ color: 'var(--av-accent)' }} />
            <div>
              <p className="font-data text-[9px] tracking-[0.25em]" style={{ color: 'var(--av-accent)' }}>{loading ? '…' : `${total.toLocaleString()} PACKAGES`}</p>
              <p className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.35)' }}>FLIGHTS + HOTELS + TRANSFERS</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 sm:px-8 lg:px-16 py-3 overflow-x-auto" style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)', scrollbarWidth: 'none' }}>
        <div className="flex items-center gap-8 min-w-max">
          {[
            { label: 'PACKAGES', value: `${(total || 10018).toLocaleString()}+` },
            { label: 'DESTINATIONS', value: '200+' },
            { label: 'STARTING FROM', value: '₹16,000' },
            { label: 'ALL INCLUSIVE', value: 'Yes' },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-8">
              {i > 0 && <div className="w-[1px] h-6" style={{ background: 'rgba(255,255,255,0.07)' }} />}
              <div>
                <p className="font-data text-[8px] tracking-[0.25em]" style={{ color: 'rgba(240,238,233,0.3)' }}>{item.label}</p>
                <p className="font-data text-sm" style={{ color: 'var(--av-text)' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-8 lg:px-16 py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center" style={{ borderBottom: '1px solid var(--av-border)' }}>
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => handleTag(t)} className="font-data text-[10px] tracking-[0.15em] px-4 py-2 rounded-[4px] border transition-all flex-shrink-0" style={{ background: activeTag === t ? 'var(--av-accent)' : 'transparent', borderColor: activeTag === t ? 'var(--av-accent)' : 'rgba(255,255,255,0.08)', color: activeTag === t ? '#fff' : 'rgba(240,238,233,0.4)' }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[4px]" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'var(--av-surface)' }}>
            <span className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.3)' }}>₹</span>
            <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="bg-transparent font-data text-[11px] outline-none w-20" style={{ color: 'var(--av-text)' }} />
            <span className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.2)' }}>—</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="bg-transparent font-data text-[11px] outline-none w-20" style={{ color: 'var(--av-text)' }} />
          </div>
          <button onClick={() => { setPage(1); fetchPackages(activeTag, 1); }} className="font-data text-[10px] tracking-[0.15em] px-4 py-2 rounded-[4px] transition-all hover:brightness-110" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
            GO
          </button>
        </div>
      </div>

      {/* Package grid */}
      <div className="px-4 sm:px-8 lg:px-16 py-8 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton rounded-[6px]" style={{ height: 340 }} />)}
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-start py-20">
            <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.25)' }}>NO PACKAGES</p>
            <h3 className="font-display text-3xl mb-3" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Nothing found.</h3>
            <p className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.4)' }}>Try adjusting the filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg, i) => (
                <motion.div key={`${pkg.id}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 6) * 0.05 }} className="rounded-[6px] overflow-hidden group cursor-pointer" style={{ border: '1px solid var(--av-border)', background: 'var(--av-surface)' }}>
                  <div className="relative" style={{ height: 200 }}>
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.6) 0%, rgba(6,6,10,0) 60%)' }} />
                    <div className="grain-overlay" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="font-data text-[8px] tracking-[0.22em] px-2.5 py-1 rounded-[3px]" style={{ background: pkg.tag === 'BESTSELLER' ? 'rgba(200,241,53,0.2)' : pkg.tag === 'LUXURY' ? 'rgba(255,107,53,0.2)' : 'rgba(92,111,255,0.2)', color: pkg.tag === 'BESTSELLER' ? 'var(--av-lime)' : pkg.tag === 'LUXURY' ? 'var(--av-orange)' : 'var(--av-accent)', border: `1px solid ${pkg.tag === 'BESTSELLER' ? 'rgba(200,241,53,0.3)' : pkg.tag === 'LUXURY' ? 'rgba(255,107,53,0.3)' : 'rgba(92,111,255,0.3)'}` }}>{pkg.tag}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock size={10} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.5)' }} />
                        <span className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.6)' }}>{pkg.duration}</span>
                      </div>
                      {pkg.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={9} strokeWidth={1.5} fill="rgba(200,241,53,0.8)" style={{ color: 'var(--av-lime)' }} />
                          <span className="font-data text-[9px]" style={{ color: 'var(--av-lime)' }}>{pkg.rating}</span>
                          {pkg.reviews && <span className="font-data text-[8px]" style={{ color: 'rgba(240,238,233,0.3)' }}>({pkg.reviews})</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="font-data text-[9px] tracking-[0.2em] mb-1.5" style={{ color: 'rgba(240,238,233,0.35)' }}>{pkg.destination?.toUpperCase()}</p>
                    <h3 className="font-display mb-2" style={{ fontSize: 18, color: 'var(--av-text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{pkg.title}</h3>
                    {pkg.desc && <p className="font-body text-[12px] mb-3 line-clamp-2" style={{ color: 'rgba(240,238,233,0.45)', lineHeight: 1.6 }}>{pkg.desc}</p>}
                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {pkg.inclusions.slice(0, 4).map((inc, ii) => (
                          <span key={ii} className="font-data text-[8px] px-2 py-0.5 rounded-[3px]" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,238,233,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>{inc}</span>
                        ))}
                        {pkg.inclusions.length > 4 && <span className="font-data text-[8px] px-2 py-0.5 rounded-[3px]" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(240,238,233,0.3)' }}>+{pkg.inclusions.length - 4} more</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p className="font-data text-[8px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>FROM</p>
                        <p className="font-data text-xl" style={{ color: 'var(--av-lime)', letterSpacing: '-0.02em' }}>₹{pkg.price?.toLocaleString()}</p>
                      </div>
                      <Link
                        to={`/book?package=${pkg.id}&destName=${encodeURIComponent(pkg.destination || pkg.title)}&price=${pkg.price}&itinerary=${encodeURIComponent(pkg.title)}&image=${encodeURIComponent(pkg.image || '')}`}
                        className="font-data text-[10px] tracking-[0.2em] px-4 py-2.5 rounded-[5px] flex items-center gap-2 hover:brightness-110 transition-all"
                        style={{ background: 'var(--av-accent)', color: '#fff' }}
                      >
                        BOOK <ArrowRight size={11} strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button onClick={loadMore} disabled={loadingMore} className="font-data text-[11px] tracking-[0.22em] px-8 py-4 rounded-[6px] flex items-center gap-3 transition-all hover:brightness-110 disabled:opacity-50" style={{ background: 'var(--av-accent)', color: '#fff' }}>
                  {loadingMore && <Loader2 size={14} className="animate-spin" />}
                  {loadingMore ? 'LOADING...' : `LOAD MORE · ${(total - packages.length).toLocaleString()} LEFT`}
                  {!loadingMore && <ArrowRight size={13} strokeWidth={2} />}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 sm:px-8 lg:px-16 py-12 md:py-16" style={{ borderTop: '1px solid var(--av-border)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'rgba(240,238,233,0.3)' }}>CUSTOM PACKAGE</p>
            <h2 className="font-display text-3xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Build your own.</h2>
            <p className="font-body text-sm mt-2" style={{ color: 'rgba(240,238,233,0.4)' }}>Tell AI your budget, duration, and vibe — get a tailored package in seconds.</p>
          </div>
          <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-8 py-4 rounded-[6px] flex items-center gap-3 hover:brightness-110 transition-all flex-shrink-0" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
            ASK AI <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
