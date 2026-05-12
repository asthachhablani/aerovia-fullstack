import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Star, MapPin, ArrowRight, Filter, X, Loader2, BedDouble } from 'lucide-react';
import { dataApi } from '../services/api';

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  rating: number;
  reviews: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  tag: string;
  desc: string;
}

interface HotelsResponse {
  success: boolean;
  data: Hotel[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

const PAGE_SIZE = 18;

export function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [city, setCity] = useState('');
  const [stars, setStars] = useState<'any' | '4' | '5'>('any');
  const [maxPrice, setMaxPrice] = useState<'any' | '10000' | '20000' | '40000'>('any');
  const [sortBy, setSortBy] = useState<'price' | '-price' | 'rating'>('rating');

  const params = useMemo(() => {
    const p: Record<string, string> = {
      page: String(page),
      limit: String(PAGE_SIZE),
      sortBy,
    };
    if (city) p.city = city;
    if (stars !== 'any') p.minStars = stars;
    if (maxPrice !== 'any') p.maxPrice = maxPrice;
    return p;
  }, [city, stars, maxPrice, sortBy, page]);

  useEffect(() => { setPage(1); }, [city, stars, maxPrice, sortBy]);

  useEffect(() => {
    const isFirstPage = page === 1;
    if (isFirstPage) setLoading(true); else setLoadingMore(true);

    dataApi.getHotels(params)
      .then((res) => {
        const r = res as unknown as HotelsResponse;
        setTotal(r.total);
        setHotels((prev) => isFirstPage ? r.data : [...prev, ...r.data]);
      })
      .catch(() => { if (isFirstPage) setHotels([]); })
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [params, page]);

  const hasMore = hotels.length < total;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-6 md:pb-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
          <p className="font-data text-[10px] tracking-[0.3em]" style={{ color: 'var(--av-lime)' }}>AEROVIA / HOTELS</p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px]" style={{ background: 'rgba(200,241,53,0.06)', border: '1px solid rgba(200,241,53,0.18)' }}>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--av-lime)' }} />
            <span className="font-data text-[8px] tracking-[0.18em]" style={{ color: 'rgba(240,238,233,0.4)' }}>10,020 PROPERTIES</span>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display"
          style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9 }}
        >
          A bed in every<br />
          <span style={{ color: 'rgba(240,238,233,0.35)' }}>great city you can name.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body mt-4 max-w-xl"
          style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.7 }}
        >
          {total.toLocaleString()} stays — boutique riads to overwater villas, ryokans to design hotels. Filter by city, star rating, or budget.
        </motion.p>
      </div>

      {/* ── Filter bar ───────────────────────────────────── */}
      <div
        className="px-4 sm:px-8 lg:px-16 py-4"
        style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)' }}
      >
        <div className="flex flex-wrap items-end gap-3 md:gap-5">
          <FilterText label="CITY OR COUNTRY" value={city} onChange={setCity} placeholder="Tokyo, Bali, Greece…" />

          <FilterSelect label="MIN STARS" value={stars} onChange={(v) => setStars(v as 'any' | '4' | '5')} options={[
            { value: 'any', label: 'ANY' },
            { value: '4', label: '4★ +' },
            { value: '5', label: '5★ ONLY' },
          ]} />

          <FilterSelect label="MAX / NIGHT" value={maxPrice} onChange={(v) => setMaxPrice(v as 'any' | '10000' | '20000' | '40000')} options={[
            { value: 'any', label: 'ANY' },
            { value: '10000', label: '< ₹10K' },
            { value: '20000', label: '< ₹20K' },
            { value: '40000', label: '< ₹40K' },
          ]} />

          <FilterSelect label="SORT" value={sortBy} onChange={(v) => setSortBy(v as 'price' | '-price' | 'rating')} options={[
            { value: 'rating', label: 'TOP RATED' },
            { value: 'price', label: 'PRICE ↑' },
            { value: '-price', label: 'PRICE ↓' },
          ]} />

          {(city || stars !== 'any' || maxPrice !== 'any' || sortBy !== 'rating') && (
            <button
              onClick={() => { setCity(''); setStars('any'); setMaxPrice('any'); setSortBy('rating'); }}
              className="font-data text-[10px] tracking-[0.2em] px-3 py-2 rounded-[5px] flex items-center gap-2 transition-colors"
              style={{ color: 'rgba(240,238,233,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <X size={12} strokeWidth={1.5} />
              CLEAR
            </button>
          )}

          <div className="ml-auto flex items-center gap-2 font-data text-[10px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.45)' }}>
            <Filter size={12} strokeWidth={1.5} />
            {loading ? '…' : `${total.toLocaleString()} STAYS`}
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-16 py-10 md:py-14">
        {loading ? (
          <SkeletonGrid />
        ) : hotels.length === 0 ? (
          <Empty message="No stays match those filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotels.map((h, i) => (
                <HotelCard key={h.id} hotel={h} index={i % PAGE_SIZE} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loadingMore}
                  className="font-data text-[11px] tracking-[0.22em] px-8 py-4 rounded-[6px] flex items-center gap-3 transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'var(--av-lime)', color: '#06060A' }}
                >
                  {loadingMore ? <Loader2 size={14} className="animate-spin" /> : null}
                  {loadingMore ? 'LOADING' : 'LOAD MORE'}
                  {!loadingMore && <ArrowRight size={13} strokeWidth={2} />}
                </button>
              </div>
            )}

            <p className="font-data text-[10px] text-center mt-6 tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>
              SHOWING {hotels.length.toLocaleString()} OF {total.toLocaleString()}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Card ──────────────────────────────────────────────
function HotelCard({ hotel, index }: { hotel: Hotel; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.45 }}
      className="rounded-[6px] overflow-hidden flex flex-col transition-all hover:border-[rgba(200,241,53,0.3)]"
      style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="relative" style={{ aspectRatio: '4/3' }}>
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.7) 0%, transparent 50%)' }} />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="font-data text-[8px] tracking-[0.22em] px-2 py-1 rounded-[3px] backdrop-blur-md"
            style={{ background: 'rgba(6,6,10,0.65)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.3)' }}
          >
            {hotel.tag}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-[3px] backdrop-blur-md"
          style={{ background: 'rgba(6,6,10,0.65)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} size={9} fill="var(--av-lime)" strokeWidth={0} style={{ color: 'var(--av-lime)' }} />
          ))}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 font-data text-[10px]" style={{ color: 'var(--av-text)' }}>
          <MapPin size={10} strokeWidth={1.6} />
          <span style={{ letterSpacing: '0.1em' }}>{hotel.city.toUpperCase()}, {hotel.country.toUpperCase()}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl mb-1 line-clamp-1" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>
          {hotel.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>{hotel.rating.toFixed(1)}</span>
          <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.4)' }}>· {hotel.reviews.toLocaleString()} reviews</span>
        </div>

        <p className="font-body text-[12px] mb-4 line-clamp-2" style={{ color: 'rgba(240,238,233,0.55)', lineHeight: 1.55 }}>
          {hotel.desc}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="font-data text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-[3px]" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(240,238,233,0.5)' }}>
              {a.toUpperCase()}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="font-data text-[9px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.35)' }}>+{hotel.amenities.length - 3}</span>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.4)' }}>FROM</p>
            <div className="flex items-baseline gap-1">
              <span className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
              <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.4)' }}>/ NIGHT</span>
            </div>
          </div>
          <Link
            to="/book"
            className="w-9 h-9 rounded-[5px] flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--av-accent)' }}
          >
            <BedDouble size={14} strokeWidth={2} color="#fff" />
          </Link>
        </div>
      </div>
    </motion.div>
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
          width: 200,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-[6px] h-[420px] animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
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
