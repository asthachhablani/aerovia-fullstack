import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Sliders } from 'lucide-react';
import { destinations } from '../data/destinations';
import { TiltCard } from '../components/TiltCard';

const EXAMPLE_QUERIES = [
  'Warm somewhere in December under ₹30,000',
  'Hidden wilderness, no crowds',
  'Long weekend from Delhi, direct flight',
  'Cultural deep-dive, food-first destination',
  'Adventure with altitude',
];

const TAGS = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Nordic', 'Islands'];

function parseQuery(q: string) {
  const lower = q.toLowerCase();
  if (!q.trim()) return destinations;
  if (lower.includes('warm') || lower.includes('morocco') || lower.includes('beach') || lower.includes('under'))
    return destinations.filter(d => ['morocco', 'maldives', 'lisbon'].includes(d.id));
  if (lower.includes('adventure') || lower.includes('wild') || lower.includes('trek') || lower.includes('altitude'))
    return destinations.filter(d => ['patagonia', 'iceland', 'norway'].includes(d.id));
  if (lower.includes('japan') || lower.includes('asia') || lower.includes('culture'))
    return destinations.filter(d => ['tokyo', 'kyoto'].includes(d.id));
  if (lower.includes('budget') || lower.includes('cheap') || lower.includes('₹2') || lower.includes('₹3'))
    return destinations.filter(d => d.price < 50000);
  return destinations.slice(0, 6);
}

export function Search() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(destinations.slice(0, 6));
  const [activeTag, setActiveTag] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setSubmitted(false);
    setTimeout(() => {
      setResults(parseQuery(q));
      setLoading(false);
      setSubmitted(true);
    }, 1600);
  };

  const clearSearch = () => {
    setQuery('');
    setSubmitted(false);
    setResults(destinations.slice(0, 6));
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}
    >
      {/* Search header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-10 md:pb-14">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-data text-[10px] tracking-[0.3em] mb-5"
          style={{ color: 'var(--av-accent)' }}
        >
          AEROVIA INTELLIGENCE ◆ AI SEARCH
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display mb-8 md:mb-10"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            color: 'var(--av-text)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            maxWidth: 700,
          }}
        >
          Tell us where<br />
          <span style={{ color: 'rgba(240,238,233,0.35)' }}>you want to go.</span>
        </motion.h1>

        {/* Big conversational input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-3xl"
        >
          <div
            className="flex items-center rounded-[6px] overflow-hidden transition-all duration-300"
            style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
              placeholder="Warm, December, under ₹30,000..."
              className="flex-1 px-5 py-4 md:px-7 md:py-5 bg-transparent font-body outline-none placeholder:text-[rgba(240,238,233,0.22)]"
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

          {/* Example queries */}
          {!submitted && !loading && (
            <div className="flex flex-wrap gap-2 mt-4">
              {EXAMPLE_QUERIES.map(ex => (
                <button
                  key={ex}
                  onClick={() => handleSearch(ex)}
                  className="font-body text-[11px] px-3 py-2 rounded-[4px] border transition-all hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.4)', background: 'rgba(255,255,255,0.025)' }}
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Status bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 sm:px-8 lg:px-16 py-4"
            style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'rgba(92,111,255,0.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--av-accent)' }} />
                ))}
              </div>
              <span className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'var(--av-accent)' }}>
                PARSING QUERY...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results section */}
      <div className="px-4 sm:px-8 lg:px-16 py-8 md:py-10">
        {/* Filter row */}
        <div className="flex items-center justify-between mb-8 md:mb-10 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="font-data text-[10px] tracking-[0.18em] px-4 py-2 rounded-[4px] border transition-all flex-shrink-0"
                style={{
                  background: activeTag === tag ? 'var(--av-accent)' : 'rgba(0,0,0,0)',
                  borderColor: activeTag === tag ? 'var(--av-accent)' : 'rgba(255,255,255,0.08)',
                  color: activeTag === tag ? '#fff' : 'rgba(240,238,233,0.4)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 font-data text-[10px] tracking-[0.2em] flex-shrink-0" style={{ color: 'rgba(240,238,233,0.35)' }}>
            <Sliders size={12} strokeWidth={1.5} />
            <span className="hidden sm:inline">FILTER</span>
          </button>
        </div>

        {/* Result label */}
        {submitted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 md:mb-8">
            <p className="font-data text-[10px] tracking-[0.25em]" style={{ color: 'rgba(240,238,233,0.35)' }}>
              {results.length} RESULTS FOR "{query}"
            </p>
          </motion.div>
        )}

        {/* Skeleton loaders */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[320, 320, 320, 240, 240, 240].map((h, i) => (
                <div key={i} className="skeleton rounded-[6px]" style={{ height: h }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile results: simple responsive grid */}
        {!loading && (
          <>
            {/* Mobile grid */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden"
            >
              {results.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="relative rounded-[6px] overflow-hidden group cursor-pointer w-full"
                    style={{ height: 260, border: '1px solid var(--av-border)' }}
                  >
                    <Link to={`/destination/${dest.id}`} className="block w-full h-full">
                      <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9) 0%, rgba(6,6,10,0) 55%)' }} />
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
                          <span className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>₹{dest.price.toLocaleString()}</span>
                          <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{dest.temp}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Desktop: editorial magazine grid */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              className="hidden md:grid gap-4"
              style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
            >
              {results.map((dest, i) => {
                const layouts = [
                  { col: '1 / 7', row: '1', h: 400 },
                  { col: '7 / 10', row: '1', h: 400 },
                  { col: '10 / 13', row: '1', h: 400 },
                  { col: '1 / 5', row: '2', h: 280 },
                  { col: '5 / 9', row: '2', h: 280 },
                  { col: '9 / 13', row: '2', h: 280 },
                ];
                const layout = layouts[i] || { col: `${(i % 3) * 4 + 1} / ${(i % 3) * 4 + 5}`, row: `${Math.floor(i / 3) + 1}`, h: 280 };
                return (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ gridColumn: layout.col }}
                  >
                    <TiltCard
                      className="relative rounded-[6px] overflow-hidden group cursor-pointer w-full"
                      style={{ height: layout.h, border: '1px solid var(--av-border)' }}
                    >
                      <Link to={`/destination/${dest.id}`} className="block w-full h-full">
                        <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9) 0%, rgba(6,6,10,0) 55%)' }} />
                        <div className="grain-overlay" />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="font-data text-[8px] tracking-[0.25em] px-2 py-1 rounded-[3px]" style={{ background: 'rgba(92,111,255,0.2)', border: '1px solid rgba(92,111,255,0.3)', color: 'var(--av-accent)' }}>{dest.tag}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                          <h3 className="font-display" style={{ fontSize: layout.h > 350 ? 32 : 22, color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            {dest.name}
                            <span className="font-body ml-2" style={{ fontSize: layout.h > 350 ? 14 : 12, color: 'rgba(240,238,233,0.4)', fontWeight: 400 }}>{dest.country}</span>
                          </h3>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4">
                              <span className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>₹{dest.price.toLocaleString()}</span>
                              <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{dest.temp} · {dest.bestMonth}</span>
                            </div>
                            <ArrowRight size={14} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.35)' }} />
                          </div>
                        </div>
                      </Link>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {/* Empty state */}
        {!loading && submitted && results.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start py-20">
            <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.25)' }}>NO RESULTS</p>
            <h3 className="font-display text-3xl mb-3" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Nothing found.</h3>
            <p className="font-body text-sm" style={{ color: 'rgba(240,238,233,0.4)' }}>Try a different query — be more descriptive.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}