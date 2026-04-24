import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Zap } from 'lucide-react';
import { destinations } from '../data/destinations';
import { TiltCard } from '../components/TiltCard';

interface DealTimer {
  h: number;
  m: number;
  s: number;
}

const DEALS = [
  { dest: destinations[3], discount: 34, baseTime: 23 * 3600 + 14 * 60 + 8, tag: 'FLASH', seats: 3 },
  { dest: destinations[0], discount: 22, baseTime: 11 * 3600 + 42 * 60 + 33, tag: 'LIMITED', seats: 7 },
  { dest: destinations[6], discount: 18, baseTime: 47 * 3600 + 8 * 60 + 15, tag: 'WEEKEND', seats: 12 },
  { dest: destinations[2], discount: 28, baseTime: 6 * 3600 + 55 * 60 + 40, tag: 'FLASH', seats: 2 },
  { dest: destinations[4], discount: 15, baseTime: 35 * 3600 + 22 * 60 + 7, tag: 'SEASONAL', seats: 18 },
  { dest: destinations[5], discount: 21, baseTime: 19 * 3600 + 3 * 60 + 55, tag: 'LIMITED', seats: 5 },
];

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function DealCard({ deal, index }: { deal: typeof DEALS[0], index: number }) {
  const timer = useCountdown(deal.baseTime);
  const discountedPrice = Math.round(deal.dest.price * (1 - deal.discount / 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0"
      style={{ width: 400 }}
    >
      <TiltCard
        className="relative rounded-[6px] overflow-hidden"
        style={{ height: 520, border: '1px solid rgba(255,255,255,0.07)', background: 'var(--av-surface)' }}
      >
        <Link to={`/destination/${deal.dest.id}`} className="block w-full h-full absolute inset-0">
          {/* BG image */}
          <img
            src={deal.dest.image}
            alt={deal.dest.name}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
          {/* Noise texture */}
          <div className="grain-overlay" />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.96) 35%, rgba(6,6,10,0.3) 75%, transparent 100%)' }} />

          {/* Diagonal DEAL stamp */}
          <div className="absolute top-0 right-0 overflow-hidden z-20" style={{ width: 100, height: 100 }}>
            <div
              className="font-data text-[9px] tracking-[0.15em] py-1.5 text-center"
              style={{
                background: 'var(--av-lime)',
                color: '#06060A',
                position: 'absolute',
                top: 24,
                right: -28,
                width: 110,
                transform: 'rotate(45deg)',
                fontWeight: 500,
              }}
            >
              {deal.discount}% OFF
            </div>
          </div>

          {/* Top tags */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span
              className="font-data text-[8px] tracking-[0.25em] px-2.5 py-1 rounded-[3px]"
              style={{
                background: deal.tag === 'FLASH' ? 'rgba(255,107,53,0.25)' : 'rgba(92,111,255,0.2)',
                color: deal.tag === 'FLASH' ? 'var(--av-orange)' : 'var(--av-accent)',
                border: `1px solid ${deal.tag === 'FLASH' ? 'rgba(255,107,53,0.35)' : 'rgba(92,111,255,0.3)'}`,
              }}
            >
              {deal.tag}
            </span>
            {deal.seats <= 5 && (
              <span
                className="font-data text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-[3px] flex items-center gap-1"
                style={{ background: 'rgba(200,241,53,0.15)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.3)' }}
              >
                <span className="w-1 h-1 rounded-full bg-[#C8F135] animate-pulse" />
                {deal.seats} LEFT
              </span>
            )}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
            {/* Countdown */}
            <div className="mb-5">
              <p className="font-data text-[8px] tracking-[0.3em] mb-1.5" style={{ color: 'rgba(240,238,233,0.35)' }}>
                DEAL EXPIRES IN
              </p>
              <div className="flex items-center gap-1">
                {[
                  { v: timer.h, label: 'H' },
                  { v: timer.m, label: 'M' },
                  { v: timer.s, label: 'S' },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <div
                      className="rounded-[4px] px-2.5 py-1.5 text-center"
                      style={{ background: 'rgba(255,255,255,0.08)', minWidth: 40 }}
                    >
                      <span className="font-data text-xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>
                        {pad(unit.v)}
                      </span>
                      <p className="font-data text-[8px]" style={{ color: 'rgba(240,238,233,0.35)' }}>
                        {unit.label}
                      </p>
                    </div>
                    {i < 2 && <span className="font-data text-lg mx-0.5" style={{ color: 'rgba(240,238,233,0.3)' }}>:</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Destination name */}
            <h2
              className="font-display mb-1"
              style={{ fontSize: 44, color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.95 }}
            >
              {deal.dest.name}
            </h2>
            <p className="font-body text-sm mb-5" style={{ color: 'rgba(240,238,233,0.45)' }}>
              {deal.dest.country} · {deal.dest.region}
            </p>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                <p className="font-data text-[9px] tracking-[0.2em] mb-0.5" style={{ color: 'rgba(240,238,233,0.35)' }}>
                  FROM
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-data text-3xl" style={{ color: 'var(--av-lime)', letterSpacing: '-0.02em' }}>
                    ₹{discountedPrice.toLocaleString()}
                  </span>
                  <span
                    className="font-data text-sm"
                    style={{ color: 'rgba(240,238,233,0.3)', textDecoration: 'line-through' }}
                  >
                    ₹{deal.dest.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-[5px] flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'var(--av-accent)', border: '1px solid rgba(92,111,255,0.4)' }}
              >
                <ArrowRight size={16} strokeWidth={2} color="#fff" />
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}

export function Deals() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}
    >
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-8 md:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-data text-[10px] tracking-[0.3em] mb-4"
              style={{ color: 'var(--av-lime)' }}
            >
              AEROVIA / FLASH DEALS
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1
                className="font-display"
                style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9 }}
              >
                Limited drops.<br />
                <span style={{ color: 'rgba(240,238,233,0.35)' }}>Zero second chances.</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body mt-4 max-w-lg"
              style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.7 }}
            >
              Like a streetwear drop, but for places. Every deal is time-boxed, seat-limited, and priced below market for exactly as long as the clock runs.
            </motion.p>
          </div>

          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 px-5 py-3 rounded-[6px] w-fit flex-shrink-0"
            style={{ border: '1px solid rgba(200,241,53,0.25)', background: 'rgba(200,241,53,0.05)' }}
          >
            <Zap size={14} strokeWidth={1.5} style={{ color: 'var(--av-lime)' }} />
            <div>
              <p className="font-data text-[9px] tracking-[0.25em]" style={{ color: 'var(--av-lime)' }}>{DEALS.length} ACTIVE DEALS</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
                <span className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.4)' }}>LIVE · PRICES UPDATING</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="px-4 sm:px-8 lg:px-16 py-4 overflow-x-auto"
        style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)', scrollbarWidth: 'none' }}
      >
        <div className="flex items-center gap-8 min-w-max">
          {[
            { label: 'AVG SAVINGS', value: '₹12,400' },
            { label: 'DEALS TODAY', value: '6' },
            { label: 'SEATS SOLD', value: '127' },
            { label: 'CHEAPEST NOW', value: 'Morocco ₹18,480' },
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

      {/* Horizontal scroll deals */}
      <div className="py-10 md:py-12">
        <div className="h-scroll-container px-4 sm:px-8 lg:px-16">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {DEALS.map((deal, i) => (
              <DealCard key={`${deal.dest.id}-${i}`} deal={deal} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 sm:px-8 lg:px-16 py-12 md:py-16" style={{ borderTop: '1px solid var(--av-border)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'rgba(240,238,233,0.3)' }}>NEVER MISS A DEAL</p>
            <h2 className="font-display text-3xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Set a price alert.</h2>
            <p className="font-body text-sm mt-2" style={{ color: 'rgba(240,238,233,0.4)' }}>Tell AI which destination you're watching.</p>
          </div>
          <Link
            to="/search"
            className="font-data text-[11px] tracking-[0.2em] px-8 py-4 rounded-[6px] flex items-center gap-3 hover:brightness-110 transition-all flex-shrink-0"
            style={{ background: 'var(--av-accent)', color: '#fff' }}
          >
            SET ALERT WITH AI
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}