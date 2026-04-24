import { useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Zap } from 'lucide-react';
import { TickerTape } from '../components/TickerTape';
import { TiltCard } from '../components/TiltCard';
import { CountUp } from '../components/CountUp';
import { destinations } from '../data/destinations';

const HERO_IMG =
  'https://images.unsplash.com/photo-1769670172608-f741dd969509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJY2VsYW5kJTIwdm9sY2FuaWMlMjBkYXJrJTIwbW9vZHklMjBkcmFtYXRpYyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzY5NTA2MDR8MA&ixlib=rb-4.1.0&q=80&w=1920';

const STATS = [
  { value: 127, suffix: '+', label: 'Destinations' },
  { value: 2.4, suffix: 'M', label: 'Travelers', decimals: 1 },
  { value: 98, suffix: '%', label: 'Satisfaction' },
  { value: 14, suffix: '', label: 'Airlines' },
];

const FEATURED = destinations.slice(0, 6);

export function Home() {
  const explorRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ background: 'var(--av-bg)' }}>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex">

        {/* Background image — always behind */}
        <motion.img
          src={HERO_IMG}
          alt="Iceland volcanic landscape"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── DESKTOP left content panel ── */}
        <div
          className="hidden md:flex relative z-10 flex-col justify-between px-10 lg:px-16 pt-32 pb-12"
          style={{ width: '46%', background: 'var(--av-bg)', flexShrink: 0 }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="font-data text-[10px] tracking-[0.3em] mb-12"
              style={{ color: 'var(--av-accent)' }}
            >
              01 / WHERE TO
            </motion.p>
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-display leading-none" style={{ fontSize: 'clamp(64px, 7.5vw, 96px)', letterSpacing: '-0.02em', lineHeight: 0.88 }}>
                  <span className="block" style={{ WebkitTextStroke: '1.5px rgba(240,238,233,0.45)', color: 'transparent' }}>WHERE</span>
                  <span className="block" style={{ color: 'var(--av-text)' }}>NEXT?</span>
                </h1>
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="font-body mt-8 max-w-xs leading-relaxed"
              style={{ fontSize: 15, color: 'rgba(240,238,233,0.5)' }}
            >
              Not a travel agency. Not a booking engine. An intelligence system that knows the difference between a destination and an experience.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="flex items-center gap-4 mt-10">
              <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-6 py-3.5 rounded-[6px] flex items-center gap-2.5 hover:brightness-110 transition-all" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
                EXPLORE <ArrowRight size={13} strokeWidth={2} />
              </Link>
              <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-6 py-3.5 rounded-[6px] flex items-center gap-2.5 border transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,238,233,0.65)' }}>
                <Zap size={12} strokeWidth={1.5} /> AI SEARCH
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="flex items-end gap-8">
            <div>
              <p className="font-data text-[10px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.3)' }}>TRENDING NOW</p>
              <div className="flex items-center gap-3">
                {['Tokyo', 'Iceland', 'Morocco'].map(d => (
                  <Link key={d} to={`/destination/${d.toLowerCase()}`} className="font-body text-[12px] px-3 py-1 rounded-[4px] border transition-colors" style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(240,238,233,0.5)' }}>{d}</Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP right image area ── */}
        <div className="hidden md:block relative flex-1 overflow-hidden">
          <div className="absolute inset-y-0 left-0 z-10" style={{ width: '35%', background: 'linear-gradient(to right, var(--av-bg), rgba(6,6,10,0))' }} />
          <div className="absolute inset-0" style={{ background: 'rgba(6,6,10,0.28)' }} />
          <div className="grain-overlay" />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="absolute bottom-10 right-10 z-20">
            <Link to="/destination/iceland" className="block text-right group">
              <p className="font-data text-[9px] tracking-[0.3em] mb-1" style={{ color: 'rgba(240,238,233,0.4)' }}>CURRENTLY FEATURED</p>
              <p className="font-display text-xl" style={{ color: 'var(--av-text)' }}>Iceland</p>
              <p className="font-data text-[10px] mt-0.5" style={{ color: 'var(--av-orange)' }}>from ₹88,000 · 6 days</p>
              <div className="flex justify-end mt-2">
                <span className="font-data text-[9px] tracking-[0.2em] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 group-hover:bg-[rgba(255,255,255,0.1)] transition-all" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(240,238,233,0.6)' }}>
                  VIEW <ArrowUpRight size={10} strokeWidth={2} />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ── MOBILE overlay content ── */}
        <div className="md:hidden absolute inset-0 flex flex-col justify-between px-6 pb-10 z-10" style={{ paddingTop: 100, background: 'linear-gradient(to top, rgba(6,6,10,0.97) 30%, rgba(6,6,10,0.55) 65%, rgba(6,6,10,0.15) 100%)' }}>
          <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="font-data text-[10px] tracking-[0.3em]" style={{ color: 'var(--av-accent)' }}>
            01 / WHERE TO
          </motion.p>

          <div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <h1 className="font-display leading-none mb-4" style={{ fontSize: 'clamp(60px, 18vw, 88px)', letterSpacing: '-0.02em', lineHeight: 0.88 }}>
                <span className="block" style={{ WebkitTextStroke: '1.5px rgba(240,238,233,0.45)', color: 'transparent' }}>WHERE</span>
                <span className="block" style={{ color: 'var(--av-text)' }}>NEXT?</span>
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="font-body mb-7 leading-relaxed max-w-xs" style={{ fontSize: 14, color: 'rgba(240,238,233,0.5)' }}>
              An intelligence system that knows the difference between a destination and an experience.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="flex items-center gap-3 mb-7">
              <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-5 py-3 rounded-[6px] flex items-center gap-2 hover:brightness-110 transition-all" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
                EXPLORE <ArrowRight size={12} strokeWidth={2} />
              </Link>
              <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-5 py-3 rounded-[6px] flex items-center gap-2 border transition-all" style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(240,238,233,0.65)' }}>
                <Zap size={11} strokeWidth={1.5} /> AI
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <p className="font-data text-[9px] tracking-[0.25em] mb-2" style={{ color: 'rgba(240,238,233,0.3)' }}>TRENDING NOW</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Tokyo', 'Iceland', 'Morocco'].map(d => (
                  <Link key={d} to={`/destination/${d.toLowerCase()}`} className="font-body text-[12px] px-3 py-1 rounded-[4px] border" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(240,238,233,0.55)' }}>{d}</Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2">
          <div className="w-[1px] h-12" style={{ background: 'linear-gradient(to bottom, rgba(6,6,10,0), rgba(240,238,233,0.25))' }} />
          <span className="font-data text-[9px] tracking-[0.3em]" style={{ color: 'rgba(240,238,233,0.3)' }}>SCROLL</span>
        </motion.div>
      </section>

      {/* ─── TICKER ───────────────────────────────────── */}
      <TickerTape />

      {/* ─── FEATURED DESTINATIONS ────────────────────── */}
      <section ref={explorRef} className="px-4 sm:px-8 lg:px-16 py-16 md:py-24">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-accent)' }}>02 / DESTINATIONS</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', color: 'var(--av-text)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Handpicked.<br />Never algorithmic.
            </h2>
          </div>
          <Link to="/search" className="font-data text-[10px] tracking-[0.2em] flex items-center gap-2 hover:text-white transition-colors pb-1" style={{ color: 'rgba(240,238,233,0.35)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            ALL <ArrowRight size={11} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Mobile: simple vertical stack */}
        <div className="flex flex-col gap-3 md:hidden">
          {FEATURED.map((dest) => (
            <div key={dest.id} className="relative rounded-[6px] overflow-hidden group" style={{ height: 220, border: '1px solid var(--av-border)', background: 'var(--av-surface)' }}>
              <Link to={`/destination/${dest.id}`} className="block w-full h-full">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.88) 0%, rgba(6,6,10,0.2) 60%, rgba(6,6,10,0) 100%)' }} />
                <div className="grain-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex items-end justify-between">
                  <div>
                    <span className="font-data text-[9px] tracking-[0.22em] block mb-1" style={{ color: 'var(--av-orange)' }}>{dest.tag}</span>
                    <h3 className="font-display text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{dest.name}</h3>
                    <p className="font-data text-[10px] mt-0.5" style={{ color: 'rgba(240,238,233,0.45)' }}>{dest.country}</p>
                  </div>
                  <span className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>₹{dest.price.toLocaleString()}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop: Asymmetric editorial grid */}
        <div className="hidden md:grid gap-3" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <TiltCard className="rounded-[6px] overflow-hidden relative cursor-pointer group" style={{ gridColumn: '1 / 6', gridRow: '1 / 3', height: 560, background: 'var(--av-surface)', border: '1px solid var(--av-border)' }}>
            <Link to={`/destination/${FEATURED[0].id}`} className="block w-full h-full">
              <img src={FEATURED[0].image} alt={FEATURED[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.85) 0%, rgba(6,6,10,0.2) 50%, rgba(6,6,10,0) 100%)' }} />
              <div className="grain-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-7 z-20">
                <span className="font-data text-[9px] tracking-[0.25em] px-2.5 py-1 rounded-[3px] mb-4 inline-block" style={{ background: 'rgba(92,111,255,0.2)', color: 'var(--av-accent)', border: '1px solid rgba(92,111,255,0.3)' }}>{FEATURED[0].tag}</span>
                <h3 className="font-display mb-1" style={{ fontSize: 36, color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{FEATURED[0].name}</h3>
                <p className="font-body text-[13px] mb-3" style={{ color: 'rgba(240,238,233,0.5)' }}>{FEATURED[0].country}</p>
                <div className="flex items-center justify-between">
                  <span className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>from ₹{FEATURED[0].price.toLocaleString()}</span>
                  <ArrowUpRight size={18} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.4)' }} />
                </div>
              </div>
            </Link>
          </TiltCard>
          {[FEATURED[1], FEATURED[2]].map((dest, idx) => (
            <TiltCard key={dest.id} className="rounded-[6px] overflow-hidden relative cursor-pointer group" style={{ gridColumn: idx === 0 ? '6 / 10' : '10 / 13', gridRow: '1 / 2', height: 270, background: 'var(--av-surface)', border: '1px solid var(--av-border)' }}>
              <Link to={`/destination/${dest.id}`} className="block w-full h-full">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.8), rgba(6,6,10,0) 60%)' }} />
                <div className="grain-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <span className="font-data text-[9px] tracking-[0.22em] block mb-1.5" style={{ color: 'var(--av-orange)' }}>{dest.tag}</span>
                  <h3 className="font-display text-xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{dest.name}</h3>
                  <p className="font-data text-[10px] mt-1" style={{ color: 'rgba(240,238,233,0.45)' }}>₹{dest.price.toLocaleString()} · {dest.bestMonth}</p>
                </div>
              </Link>
            </TiltCard>
          ))}
          {[FEATURED[3], FEATURED[4], FEATURED[5]].map((dest, idx) => (
            <TiltCard key={dest.id} className="rounded-[6px] overflow-hidden relative cursor-pointer group" style={{ gridColumn: idx === 0 ? '6 / 9' : idx === 1 ? '9 / 11' : '11 / 13', gridRow: '2 / 3', height: 280, background: 'var(--av-surface)', border: '1px solid var(--av-border)' }}>
              <Link to={`/destination/${dest.id}`} className="block w-full h-full">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.85), rgba(6,6,10,0) 55%)' }} />
                <div className="grain-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="font-display text-lg" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{dest.name}</h3>
                  <p className="font-data text-[9px] mt-1" style={{ color: 'rgba(240,238,233,0.4)' }}>₹{dest.price.toLocaleString()}</p>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ─── HORIZONTAL SCROLL ────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="px-4 sm:px-8 lg:px-16 mb-6 md:mb-8 flex items-end justify-between">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-2" style={{ color: 'var(--av-orange)' }}>03 / QUICK BROWSE</p>
            <h2 className="font-display text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Scroll the world</h2>
          </div>
          <p className="font-data text-[10px] tracking-wider pb-1 hidden sm:block" style={{ color: 'rgba(240,238,233,0.25)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>DRAG TO EXPLORE →</p>
        </div>
        <div className="h-scroll-container px-4 sm:px-8 lg:px-16">
          <div className="flex gap-3 pb-4" style={{ width: 'max-content' }}>
            {destinations.map(dest => (
              <Link key={dest.id} to={`/destination/${dest.id}`} className="relative rounded-[6px] overflow-hidden group flex-shrink-0" style={{ width: 240, height: 320, border: '1px solid var(--av-border)' }}>
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9) 0%, rgba(6,6,10,0.15) 60%, rgba(6,6,10,0) 100%)' }} />
                <div className="grain-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="font-data text-[9px] tracking-[0.25em] mb-1.5" style={{ color: 'var(--av-accent)' }}>{dest.tag}</p>
                  <h3 className="font-display text-xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{dest.name}</h3>
                  <p className="font-body text-[11px] mt-1" style={{ color: 'rgba(240,238,233,0.4)' }}>{dest.country}</p>
                  <p className="font-data text-[11px] mt-2" style={{ color: 'var(--av-lime)' }}>₹{dest.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI SEARCH PROMO ──────────────────────────── */}
      <section className="mx-4 sm:mx-8 lg:mx-16 my-6 rounded-[8px] overflow-hidden relative" style={{ border: '1px solid rgba(92,111,255,0.18)', background: 'rgba(92,111,255,0.04)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[280px] md:min-h-[340px]">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <p className="font-data text-[10px] tracking-[0.3em] mb-5" style={{ color: 'var(--av-accent)' }}>04 / AI INTELLIGENCE</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 40px)', color: 'var(--av-text)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
                Search differently.<br />
                <span style={{ color: 'rgba(240,238,233,0.4)' }}>Search intelligently.</span>
              </h2>
              <p className="font-body mt-4 max-w-sm" style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.7 }}>
                No dropdowns. No date-pickers. Just say what you want.
              </p>
            </div>
            <Link to="/search" className="font-data text-[11px] tracking-[0.2em] px-7 py-3.5 rounded-[6px] inline-flex items-center gap-3 w-fit hover:brightness-110 transition-all mt-6" style={{ background: 'var(--av-accent)', color: '#fff' }}>
              TRY AI SEARCH <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>
          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <div className="rounded-[6px] p-4 mb-3" style={{ background: 'rgba(6,6,10,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-body text-[13px]" style={{ color: 'rgba(240,238,233,0.7)' }}>
                  "I want somewhere warm in December under ₹30,000 — not crowded."
                </p>
              </div>
              <div className="rounded-[6px] p-4" style={{ background: 'rgba(92,111,255,0.1)', border: '1px solid rgba(92,111,255,0.2)' }}>
                <p className="font-data text-[9px] tracking-[0.2em] mb-2" style={{ color: 'var(--av-accent)' }}>AEROVIA INTELLIGENCE ◆</p>
                <p className="font-body text-[12px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.7)' }}>
                  Matching: <strong style={{ color: 'var(--av-text)' }}>Morocco</strong> · December avg 22°C · ₹28,000 · Low tourist density.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-16 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--av-border)' }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="p-7 md:p-10 flex flex-col gap-2"
              style={{
                borderRight: i % 2 === 0 ? '1px solid var(--av-border)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--av-border)' : 'none',
                background: i % 2 === 0 ? 'var(--av-surface)' : 'rgba(14,14,22,0.5)',
              }}
            >
              <div className="font-data" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--av-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                <CountUp end={stat.value} suffix={stat.suffix} decimals={(stat as any).decimals ?? 0} />
              </div>
              <p className="font-data text-[10px] tracking-[0.25em]" style={{ color: 'rgba(240,238,233,0.35)' }}>{stat.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DEALS TEASER ─────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-16 pb-20 md:pb-24">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-3" style={{ color: 'var(--av-lime)' }}>05 / FLASH DEALS</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>48 hours. Limited seats.</h2>
          </div>
          <Link to="/deals" className="font-data text-[10px] tracking-[0.2em] flex items-center gap-2 hover:text-white transition-colors" style={{ color: 'var(--av-lime)', borderBottom: '1px solid rgba(200,241,53,0.3)', paddingBottom: 4 }}>
            ALL <ArrowRight size={11} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { dest: destinations[3], discount: 34, deadline: '23:14:08' },
            { dest: destinations[0], discount: 22, deadline: '11:42:33' },
            { dest: destinations[6], discount: 18, deadline: '47:08:15' },
          ].map(({ dest, discount, deadline }) => (
            <TiltCard key={dest.id} className="relative rounded-[6px] overflow-hidden group cursor-pointer" style={{ height: 220, border: '1px solid var(--av-border)', background: 'var(--av-surface)' }}>
              <Link to={`/destination/${dest.id}`} className="block w-full h-full">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-[0.65] transition-opacity duration-500" />
                <div className="grain-overlay" />
                <div className="absolute top-0 right-0 overflow-hidden" style={{ width: 80, height: 80 }}>
                  <div className="deal-stamp">{discount}% OFF</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <p className="font-data text-[9px] tracking-[0.3em] mb-1" style={{ color: 'var(--av-lime)' }}>ENDS IN {deadline}</p>
                  <h3 className="font-display text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{dest.name}</h3>
                  <p className="font-data text-[11px] mt-1" style={{ color: 'rgba(240,238,233,0.5)' }}>
                    ₹{Math.round(dest.price * (1 - discount / 100)).toLocaleString()}{' '}
                    <span style={{ textDecoration: 'line-through', color: 'rgba(240,238,233,0.3)' }}>₹{dest.price.toLocaleString()}</span>
                  </p>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="px-4 sm:px-8 lg:px-16 py-10 md:py-12" style={{ borderTop: '1px solid var(--av-border)' }}>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-data text-[10px]" style={{ color: 'var(--av-accent)' }}>◆</span>
              <span className="font-data text-xs tracking-[0.28em]" style={{ color: 'var(--av-text)' }}>AEROVIA</span>
            </div>
            <p className="font-body text-[12px] max-w-xs" style={{ color: 'rgba(240,238,233,0.3)' }}>Travel intelligence for those who move with intention.</p>
          </div>
          <div className="flex gap-12 sm:gap-16">
            {[
              { title: 'PLATFORM', links: ['Explore', 'Deals', 'Dashboard', 'AI Search'] },
              { title: 'ROUTES', links: ['Asia', 'Europe', 'Americas', 'Africa'] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-data text-[9px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.3)' }}>{col.title}</p>
                {col.links.map(l => (
                  <p key={l} className="font-body text-[12px] mb-2.5 hover:text-white transition-colors" style={{ color: 'rgba(240,238,233,0.45)' }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.2)' }}>© 2026 AEROVIA. ALL RIGHTS RESERVED.</p>
          <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.2)' }}>MIDNIGHT ATLAS v1.0</p>
        </div>
      </footer>
    </div>
  );
}
