import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Plane, ArrowRight, Filter, X, Loader2 } from 'lucide-react';
import { dataApi } from '../services/api';

interface Flight {
  id: string;
  airline: string;
  code: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  dep: string;
  arr: string;
  duration: string;
  stops: string;
  price: number;
  seatsLeft: number;
  class: string;
  tag: string;
}

interface FlightsResponse {
  success: boolean;
  data: Flight[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

const PAGE_SIZE = 18;

export function Flights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [stops, setStops] = useState<'any' | 'direct' | '1+'>('any');
  const [sortBy, setSortBy] = useState<'price' | '-price' | 'duration'>('price');

  const params = useMemo(() => {
    const p: Record<string, string> = {
      page: String(page),
      limit: String(PAGE_SIZE),
      sortBy,
    };
    if (from) p.from = from;
    if (to) p.to = to;
    if (stops === 'direct') p.stops = 'direct';
    if (stops === '1+') p.stops = 'connecting';
    return p;
  }, [from, to, stops, sortBy, page]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [from, to, stops, sortBy]);

  useEffect(() => {
    const isFirstPage = page === 1;
    if (isFirstPage) setLoading(true); else setLoadingMore(true);

    dataApi.getFlights(params)
      .then((res) => {
        const r = res as unknown as FlightsResponse;
        setTotal(r.total);
        setFlights((prev) => isFirstPage ? r.data : [...prev, ...r.data]);
      })
      .catch(() => { if (isFirstPage) setFlights([]); })
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [params, page]);

  const hasMore = flights.length < total;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-6 md:pb-10">
        <motion.p
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          className="font-data text-[10px] tracking-[0.3em] mb-4"
          style={{ color: 'var(--av-accent)' }}
        >
          AEROVIA / FLIGHTS
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display"
          style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9 }}
        >
          Every airline.<br />
          <span style={{ color: 'rgba(240,238,233,0.35)' }}>Every route. One screen.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body mt-4 max-w-xl"
          style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.7 }}
        >
          {total.toLocaleString()} live flights across 35 carriers. Filter by route, choose direct or connecting, sort by price or duration.
        </motion.p>
      </div>

      {/* ── Filter bar ───────────────────────────────────── */}
      <div
        className="px-4 sm:px-8 lg:px-16 py-4"
        style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)' }}
      >
        <div className="flex flex-wrap items-end gap-3 md:gap-5">
          <FilterText label="FROM (CITY OR CODE)" value={from} onChange={setFrom} placeholder="DEL, Mumbai…" />
          <FilterText label="TO (CITY OR CODE)" value={to} onChange={setTo} placeholder="DXB, Tokyo…" />

          <FilterSelect label="STOPS" value={stops} onChange={(v) => setStops(v as 'any' | 'direct' | '1+')} options={[
            { value: 'any', label: 'ANY' },
            { value: 'direct', label: 'DIRECT' },
            { value: '1+', label: '1+ STOP' },
          ]} />

          <FilterSelect label="SORT" value={sortBy} onChange={(v) => setSortBy(v as 'price' | '-price' | 'duration')} options={[
            { value: 'price', label: 'PRICE ↑' },
            { value: '-price', label: 'PRICE ↓' },
            { value: 'duration', label: 'DURATION' },
          ]} />

          {(from || to || stops !== 'any' || sortBy !== 'price') && (
            <button
              onClick={() => { setFrom(''); setTo(''); setStops('any'); setSortBy('price'); }}
              className="font-data text-[10px] tracking-[0.2em] px-3 py-2 rounded-[5px] flex items-center gap-2 transition-colors"
              style={{ color: 'rgba(240,238,233,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <X size={12} strokeWidth={1.5} />
              CLEAR
            </button>
          )}

          <div className="ml-auto flex items-center gap-2 font-data text-[10px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.45)' }}>
            <Filter size={12} strokeWidth={1.5} />
            {loading ? '…' : `${total.toLocaleString()} RESULTS`}
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-16 py-10 md:py-14">
        {loading ? (
          <SkeletonGrid />
        ) : flights.length === 0 ? (
          <Empty message="No flights match those filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {flights.map((f, i) => (
                <FlightCard key={f.id} flight={f} index={i % PAGE_SIZE} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loadingMore}
                  className="font-data text-[11px] tracking-[0.22em] px-8 py-4 rounded-[6px] flex items-center gap-3 transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'var(--av-accent)', color: '#fff' }}
                >
                  {loadingMore ? <Loader2 size={14} className="animate-spin" /> : null}
                  {loadingMore ? 'LOADING' : 'LOAD MORE'}
                  {!loadingMore && <ArrowRight size={13} strokeWidth={2} />}
                </button>
              </div>
            )}

            <p className="font-data text-[10px] text-center mt-6 tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>
              SHOWING {flights.length.toLocaleString()} OF {total.toLocaleString()}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Card ──────────────────────────────────────────────
function FlightCard({ flight, index }: { flight: Flight; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.4 }}
      className="rounded-[6px] p-5 transition-all hover:border-[rgba(92,111,255,0.35)]"
      style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[5px] flex items-center justify-center"
            style={{ background: 'rgba(92,111,255,0.12)', border: '1px solid rgba(92,111,255,0.25)' }}
          >
            <Plane size={13} strokeWidth={1.6} style={{ color: 'var(--av-accent)' }} />
          </div>
          <div>
            <p className="font-data text-[10px] tracking-[0.18em]" style={{ color: 'var(--av-text)' }}>{flight.airline}</p>
            <p className="font-data text-[9px] tracking-[0.18em]" style={{ color: 'rgba(240,238,233,0.4)' }}>{flight.code} · {flight.class.toUpperCase()}</p>
          </div>
        </div>
        {flight.tag ? (
          <span
            className="font-data text-[8px] tracking-[0.22em] px-2 py-1 rounded-[3px]"
            style={{ background: 'rgba(200,241,53,0.12)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}
          >
            {flight.tag}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between mb-4">
        <Stop city={flight.fromCity} code={flight.from} time={flight.dep} />
        <div className="flex-1 px-3">
          <p className="font-data text-[9px] text-center tracking-[0.2em] mb-1.5" style={{ color: 'rgba(240,238,233,0.4)' }}>{flight.duration}</p>
          <div className="relative h-px w-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="absolute -top-[3px] left-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--av-accent)' }} />
            <div className="absolute -top-[3px] right-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--av-accent)' }} />
          </div>
          <p className="font-data text-[9px] text-center tracking-[0.2em] mt-1.5" style={{ color: 'rgba(240,238,233,0.45)' }}>{flight.stops}</p>
        </div>
        <Stop city={flight.toCity} code={flight.to} time={flight.arr} align="right" />
      </div>

      <div className="flex items-end justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="font-data text-[9px] tracking-[0.2em] mb-0.5" style={{ color: 'rgba(240,238,233,0.4)' }}>FROM</p>
          <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>₹{flight.price.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-3">
          {flight.seatsLeft <= 8 && (
            <span className="font-data text-[9px] tracking-[0.18em]" style={{ color: 'var(--av-orange)' }}>
              {flight.seatsLeft} LEFT
            </span>
          )}
          <Link
            to="/book"
            className="w-9 h-9 rounded-[5px] flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--av-lime)' }}
          >
            <ArrowRight size={14} strokeWidth={2} color="#06060A" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Stop({ city, code, time, align = 'left' }: { city: string; code: string; time: string; align?: 'left' | 'right' }) {
  return (
    <div className="flex flex-col" style={{ alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <p className="font-data text-[10px] tracking-[0.18em]" style={{ color: 'rgba(240,238,233,0.5)' }}>{code}</p>
      <p className="font-data text-base mt-0.5" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{time}</p>
      <p className="font-body text-[11px] mt-0.5 max-w-[80px] truncate" style={{ color: 'rgba(240,238,233,0.4)', textAlign: align }}>{city}</p>
    </div>
  );
}

// ── Shared filter inputs ──────────────────────────────
function FilterText({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-data text-[9px] tracking-[0.22em]" style={{ color: 'rgba(240,238,233,0.4)' }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-data text-[11px] px-3 py-2 rounded-[5px] outline-none"
        style={{
          width: 180,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--av-text)',
          letterSpacing: '0.05em',
        }}
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-data text-[9px] tracking-[0.22em]" style={{ color: 'rgba(240,238,233,0.4)' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-data text-[11px] px-3 py-2 rounded-[5px] outline-none cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--av-text)',
          letterSpacing: '0.18em',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: '#0E0E16' }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-[6px] h-[200px] animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
      ))}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <p className="font-data text-[11px] tracking-[0.22em]" style={{ color: 'rgba(240,238,233,0.45)' }}>{message}</p>
    </div>
  );
}
