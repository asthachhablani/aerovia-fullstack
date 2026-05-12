import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Loader2 } from 'lucide-react';
import { dataApi } from '../services/api';
import { TiltCard } from '../components/TiltCard';

interface Deal {
  id: string;
  destId: string;
  destName: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  tag: string;
  seatsLeft: number;
  expiresIn: number;
  desc: string;
}

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, []);
  return { h: Math.floor(seconds / 3600), m: Math.floor((seconds % 3600) / 60), s: seconds % 60 };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const timer = useCountdown(deal.expiresIn);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0"
      style={{ width: 380 }}
    >
      <TiltCard className="relative rounded-[6px] overflow-hidden" style={{ height: 500, border: '1px solid rgba(255,255,255,0.07)', background: 'var(--av-surface)' }}>
        <Link to={`/destination/${deal.destId}`} className="block w-full h-full absolute inset-0">
          <img src={deal.image} alt={deal.destName} className="absolute inset-0 w-full h-full object-cover opacity-55" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
          <div className="grain-overlay" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.96) 35%, rgba(6,6,10,0.3) 75%, transparent 100%)' }} />

          {/* Diagonal discount stamp */}
          <div className="absolute top-0 right-0 overflow-hidden z-20" style={{ width: 100, height: 100 }}>
            <div className="font-data text-[9px] tracking-[0.15em] py-1.5 text-center" style={{ background: 'var(--av-lime)', color: '#06060A', position: 'absolute', top: 24, right: -28, width: 110, transform: 'rotate(45deg)', fontWeight: 500 }}>
              {deal.discount}% OFF
            </div>
          </div>

          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="font-data text-[8px] tracking-[0.25em] px-2.5 py-1 rounded-[3px]" style={{ background: deal.tag === 'FLASH' ? 'rgba(255,107,53,0.25)' : 'rgba(92,111,255,0.2)', color: deal.tag === 'FLASH' ? 'var(--av-orange)' : 'var(--av-accent)', border: `1px solid ${deal.tag === 'FLASH' ? 'rgba(255,107,53,0.35)' : 'rgba(92,111,255,0.3)'}` }}>
              {deal.tag}
            </span>
            {deal.seatsLeft <= 10 && (
              <span className="font-data text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-[3px] flex items-center gap-1" style={{ background: 'rgba(200,241,53,0.15)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.3)' }}>
                <span className="w-1 h-1 rounded-full bg-[#C8F135] animate-pulse" />
                {deal.seatsLeft} LEFT
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="mb-4">
              <p className="font-data text-[8px] tracking-[0.3em] mb-1.5" style={{ color: 'rgba(240,238,233,0.35)' }}>DEAL EXPIRES IN</p>
              <div className="flex items-center gap-1">
                {[{ v: timer.h, label: 'H' }, { v: timer.m, label: 'M' }, { v: timer.s, label: 'S' }].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <div className="rounded-[4px] px-2.5 py-1.5 text-center" style={{ background: 'rgba(255,255,255,0.08)', minWidth: 40 }}>
                      <span className="font-data text-xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>{pad(unit.v)}</span>
                      <p className="font-data text-[8px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{unit.label}</p>
                    </div>
                    {i < 2 && <span className="font-data text-lg mx-0.5" style={{ color: 'rgba(240,238,233,0.3)' }}>:</span>}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="font-display mb-1" style={{ fontSize: 40, color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>{deal.destName}</h2>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(240,238,233,0.45)' }}>{deal.desc}</p>

            <div className="flex items-end justify-between">
              <div>
                <p className="font-data text-[9px] tracking-[0.2em] mb-0.5" style={{ color: 'rgba(240,238,233,0.35)' }}>FROM</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-data text-3xl" style={{ color: 'var(--av-lime)', letterSpacing: '-0.02em' }}>₹{deal.discountedPrice.toLocaleString()}</span>
                  <span className="font-data text-sm" style={{ color: 'rgba(240,238,233,0.3)', textDecoration: 'line-through' }}>₹{deal.originalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-[5px] flex items-center justify-center" style={{ background: 'var(--av-accent)' }}>
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
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataApi.getDeals().then((res: any) => {
      setDeals(res.data || []);
    }).catch(() => setDeals([])).finally(() => setLoading(false));
  }, []);

  const avgSavings = deals.length > 0
    ? Math.round(deals.reduce((s, d) => s + (d.originalPrice - d.discountedPrice), 0) / deals.length)
    : 0;
  const maxDiscount = deals.length > 0 ? Math.max(...deals.map(d => d.discount)) : 0;
  const cheapest = deals.slice().sort((a, b) => a.discountedPrice - b.discountedPrice)[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}>

      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-10 md:pt-16 pb-8 md:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'var(--av-lime)' }}>
              AEROVIA / FLASH DEALS
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.9 }}>
              Limited drops.<br /><span style={{ color: 'rgba(240,238,233,0.35)' }}>Zero second chances.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-body mt-4 max-w-lg" style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.7 }}>
              Like a streetwear drop, but for places. Every deal is time-boxed, seat-limited, and priced below market for exactly as long as the clock runs.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 px-5 py-3 rounded-[6px] w-fit flex-shrink-0" style={{ border: '1px solid rgba(200,241,53,0.25)', background: 'rgba(200,241,53,0.05)' }}>
            <Zap size={14} strokeWidth={1.5} style={{ color: 'var(--av-lime)' }} />
            <div>
              <p className="font-data text-[9px] tracking-[0.25em]" style={{ color: 'var(--av-lime)' }}>{loading ? '...' : `${deals.length} ACTIVE DEALS`}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
                <span className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.4)' }}>LIVE · PRICES UPDATING</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 sm:px-8 lg:px-16 py-4 overflow-x-auto" style={{ borderTop: '1px solid var(--av-border)', borderBottom: '1px solid var(--av-border)', background: 'var(--av-surface)', scrollbarWidth: 'none' }}>
        <div className="flex items-center gap-8 min-w-max">
          {[
            { label: 'AVG SAVINGS', value: avgSavings > 0 ? `₹${avgSavings.toLocaleString()}` : '…' },
            { label: 'DEALS TODAY', value: String(deals.length || '…') },
            { label: 'MAX DISCOUNT', value: maxDiscount > 0 ? `${maxDiscount}%` : '…' },
            { label: 'CHEAPEST NOW', value: cheapest ? `${cheapest.destName} ₹${cheapest.discountedPrice.toLocaleString()}` : '…' },
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

      {/* Deals scroll */}
      <div className="py-10 md:py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--av-accent)' }} />
          </div>
        ) : (
          <div className="h-scroll-container px-4 sm:px-8 lg:px-16">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {deals.map((deal, i) => <DealCard key={deal.id} deal={deal} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 sm:px-8 lg:px-16 py-12 md:py-16" style={{ borderTop: '1px solid var(--av-border)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'rgba(240,238,233,0.3)' }}>NEVER MISS A DEAL</p>
            <h2 className="font-display text-3xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Set a price alert.</h2>
            <p className="font-body text-sm mt-2" style={{ color: 'rgba(240,238,233,0.4)' }}>Tell AI which destination you&apos;re watching.</p>
          </div>
          <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-8 py-4 rounded-[6px] flex items-center gap-3 hover:brightness-110 transition-all flex-shrink-0" style={{ background: 'var(--av-accent)', color: '#fff' }}>
            SET ALERT WITH AI <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
