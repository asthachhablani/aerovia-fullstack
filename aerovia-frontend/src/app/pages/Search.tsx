import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Sliders, Search as SearchIcon, Loader2 } from 'lucide-react';
import { dataApi } from '../services/api';

const EXAMPLE_QUERIES = [
  'Warm somewhere in December under ₹30,000',
  'Hidden wilderness, no crowds',
  'Long weekend from Delhi, direct flight',
  'Cultural deep-dive, food-first destination',
  'Adventure with altitude',
];

const REGIONS = ['All', 'East Asia', 'South Asia', 'Europe', 'South America', 'Nordic', 'North Africa', 'Indian Ocean', 'Middle East', 'Americas', 'Oceania'];

interface Destination {
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
}

const PAGE_SIZE = 24;

export function Search() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [activeRegion, setActiveRegion] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchDestinations = useCallback(async (q: string, region: string, p: number, append = false) => {
    if (p === 1) setLoading(true); else setLoadingMore(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(PAGE_SIZE) };
      if (q.trim()) params.search = q;
      if (region && region !== 'All') params.region = region;
      const res = await dataApi.getDestinations(params) as any;
      setTotal(res.total ?? res.data?.length ?? 0);
      setDestinations(prev => append ? [...prev, ...(res.data || [])] : (res.data || []));
    } catch {
      if (!append) setDestinations([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchDestinations('', 'All', 1); }, [fetchDestinations]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1);
    setSubmitted(!!q.trim());
    fetchDestinations(q, activeRegion, 1);
  };

  const handleRegion = (r: string) => {
    setActiveRegion(r);
    setPage(1);
    fetchDestinations(query, r, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDestinations(query, activeRegion, nextPage, true);
  };

  const clearSearch = () => {
    setQuery('');
    setSubmitted(false);
    setPage(1);
    fetchDestinations('', activeRegion, 1);
    inputRef.current?.focus();
  };

  const hasMore = destinations.length < total;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}>

      {/* Search header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-10 md:pb-14">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
          <p className="font-data text-[10px] tracking-[0.3em]" style={{ color: 'var(--av-accent)' }}>
            AEROVIA INTELLIGENCE ◆ AI SEARCH
          </p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px]" style={{ background: 'rgba(200,241,53,0.08)', border: '1px solid rgba(200,241,53,0.2)' }}>
            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: 'var(--av-lime)' }} />
            <span className="font-data text-[8px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>GEMINI LIVE</span>
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display mb-8 md:mb-10" style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1, maxWidth: 700 }}>
          Tell us where<br /><span style={{ color: 'rgba(240,238,233,0.35)' }}>you want to go.</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative max-w-3xl">
          <div className="flex items-center rounded-[6px] overflow-hidden transition-all duration-300" style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <SearchIcon size={16} className="ml-5 flex-shrink-0" strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.3)' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
              placeholder="Warm, December, under ₹30,000..."
              className="flex-1 px-4 py-4 md:py-5 bg-transparent font-body outline-none placeholder:text-[rgba(240,238,233,0.22)]"
              style={{ color: 'var(--av-text)', fontSize: 15 }}
            />
            {query && (
              <button onClick={clearSearch} className="px-3 md:px-4" style={{ color: 'rgba(240,238,233,0.3)' }}>
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={() => handleSearch(query)}
              className="font-data text-[11px] tracking-[0.2em] px-5 py-4 md:px-7 md:py-5 transition-all hover:brightness-110 flex items-center gap-2 flex-shrink-0"
              style={{ background: 'var(--av-accent)', color: '#fff' }}
            >
              <span className="hidden sm:inline">SEARCH</span>
              <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>

          {!submitted && !loading && (
            <div className="flex flex-wrap gap-2 mt-4">
              {EXAMPLE_QUERIES.map(ex => (
                <button key={ex} onClick={() => handleSearch(ex)} className="font-body text-[11px] px-3 py-2 rounded-[4px] border transition-all hover:border-[rgba(255,255,255,0.2)] hover:text-white" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.4)', background: 'rgba(255,255,255,0.025)' }}>
                  {ex}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* AI loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 sm:px-8 lg:px-16 py-4" style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'rgba(92,111,255,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--av-accent)' }} />)}</div>
              <span className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'var(--av-accent)' }}>SEARCHING {total > 0 ? `${total.toLocaleString()} DESTINATIONS` : '...'}  </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="px-4 sm:px-8 lg:px-16 py-8 md:py-10">
        {/* Filter row */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => handleRegion(r)} className="font-data text-[10px] tracking-[0.18em] px-4 py-2 rounded-[4px] border transition-all flex-shrink-0" style={{ background: activeRegion === r ? 'var(--av-accent)' : 'transparent', borderColor: activeRegion === r ? 'var(--av-accent)' : 'rgba(255,255,255,0.08)', color: activeRegion === r ? '#fff' : 'rgba(240,238,233,0.4)' }}>
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 font-data text-[10px] tracking-[0.2em] flex-shrink-0" style={{ color: 'rgba(240,238,233,0.35)' }}>
            <Sliders size={12} strokeWidth={1.5} />
            <span className="hidden sm:inline">{loading ? '…' : `${total.toLocaleString()} RESULTS`}</span>
          </div>
        </div>

        {submitted && !loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-data text-[10px] tracking-[0.25em] mb-6" style={{ color: 'rgba(240,238,233,0.35)' }}>
            {total.toLocaleString()} RESULTS FOR &ldquo;{query}&rdquo;
          </motion.p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton rounded-[6px]" style={{ height: 280 }} />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start py-20">
            <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.25)' }}>NO RESULTS</p>
            <h3 className="font-display text-3xl mb-3" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Nothing found.</h3>
            <p className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.4)' }}>Try a different query or region filter.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {destinations.map((dest, i) => (
                <motion.div key={`${dest.id}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}>
                  <Link
                    to={`/destination/${dest.id}`}
                    className="relative rounded-[6px] overflow-hidden group block"
                    style={{ height: 280, border: '1px solid var(--av-border)' }}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.2) 55%, rgba(6,6,10,0) 100%)' }} />
                    <div className="grain-overlay" />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="font-data text-[8px] tracking-[0.25em] px-2 py-1 rounded-[3px]" style={{ background: 'rgba(92,111,255,0.2)', border: '1px solid rgba(92,111,255,0.3)', color: 'var(--av-accent)' }}>{dest.tag}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="font-display" style={{ fontSize: 22, color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        {dest.name}
                        <span className="font-body ml-2" style={{ fontSize: 12, color: 'rgba(240,238,233,0.4)', fontWeight: 400 }}>{dest.country}</span>
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>₹{dest.price?.toLocaleString()}</span>
                        {dest.temp && <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{dest.temp}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="font-data text-[11px] tracking-[0.22em] px-8 py-4 rounded-[6px] flex items-center gap-3 transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'var(--av-accent)', color: '#fff' }}
                >
                  {loadingMore && <Loader2 size={14} className="animate-spin" />}
                  {loadingMore ? 'LOADING...' : `LOAD MORE · ${(total - destinations.length).toLocaleString()} LEFT`}
                  {!loadingMore && <ArrowRight size={13} strokeWidth={2} />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
