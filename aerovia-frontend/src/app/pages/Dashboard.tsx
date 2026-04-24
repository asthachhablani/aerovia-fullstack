import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plane, Clock, TrendingUp, Sparkles, ArrowUpRight, Heart, MapPin } from 'lucide-react';
import { destinations } from '../data/destinations';
import { CountUp } from '../components/CountUp';

const SPENDING_DATA = [
  { month: 'Aug', amount: 22000 },
  { month: 'Sep', amount: 18500 },
  { month: 'Oct', amount: 42000 },
  { month: 'Nov', amount: 14000 },
  { month: 'Dec', amount: 68000 },
  { month: 'Jan', amount: 38500 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 28000 },
];

const AI_PREVIEW = [
  { role: 'user', text: 'Somewhere cold and dramatic in October' },
  { role: 'ai', text: 'Iceland ticks every box — dark season, aurora window opens, flights are off-peak. ₹88,000 return.' },
];

const WISHLIST = [
  { dest: destinations[0], added: '3 days ago' },
  { dest: destinations[2], added: '1 week ago' },
  { dest: destinations[4], added: '2 weeks ago' },
];

const UPCOMING = {
  dest: destinations[6],
  departure: '14 Jan 2025',
  returnDate: '19 Jan 2025',
  daysLeft: 83,
  flightCode: 'AI-307',
  hotel: 'Gion Hatanaka Ryokan',
  totalCost: 62000,
  status: 'CONFIRMED',
};

const QUICK_STATS = [
  { label: 'TRIPS TAKEN', value: 12, suffix: '', icon: Plane },
  { label: 'COUNTRIES', value: 8, suffix: '', icon: MapPin },
  { label: 'KM TRAVELED', value: 47200, suffix: '', icon: TrendingUp },
  { label: 'WISHLIST', value: 15, suffix: '', icon: Heart },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-[5px] px-4 py-3" style={{ background: '#0E0E16', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="font-data text-[9px] tracking-[0.2em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>{label}</p>
        <p className="font-data text-base" style={{ color: 'var(--av-lime)' }}>₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const [aiInput, setAiInput] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}
    >
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1680px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-2" style={{ color: 'var(--av-accent)' }}>AEROVIA / DASHBOARD</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>
              Good evening, Arjun.
            </h1>
          </div>
          <p className="font-data text-[9px] hidden sm:block" style={{ color: 'rgba(240,238,233,0.3)' }}>LAST LOGIN · TODAY 14:32</p>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col gap-3 lg:hidden">

          {/* Upcoming trip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="relative rounded-[6px] overflow-hidden"
            style={{ minHeight: 300, border: '1px solid var(--av-border)' }}
          >
            <img src={UPCOMING.dest.image} alt={UPCOMING.dest.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,6,10,0.92) 40%, rgba(6,6,10,0.55) 100%)' }} />
            <div className="grain-overlay" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-between" style={{ minHeight: 300 }}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-data text-[8px] tracking-[0.25em] px-2 py-1 rounded-[3px] mb-3 inline-flex items-center gap-1.5" style={{ background: 'rgba(200,241,53,0.15)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.3)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
                    {UPCOMING.status}
                  </span>
                  <h2 className="font-display" style={{ fontSize: 'clamp(28px, 8vw, 44px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>
                    {UPCOMING.dest.name}
                  </h2>
                  <p className="font-body mt-1" style={{ fontSize: 13, color: 'rgba(240,238,233,0.5)' }}>
                    {UPCOMING.dest.country} · {UPCOMING.departure}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-data text-[8px] tracking-[0.2em] mb-0.5" style={{ color: 'rgba(240,238,233,0.35)' }}>IN</p>
                  <p className="font-data" style={{ fontSize: 40, color: 'var(--av-text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    <CountUp end={UPCOMING.daysLeft} />
                  </p>
                  <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.35)' }}>DAYS</p>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'FLIGHT', value: UPCOMING.flightCode },
                    { label: 'HOTEL', value: 'Gion Hatanaka' },
                    { label: 'TOTAL', value: `₹${UPCOMING.totalCost.toLocaleString()}` },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="font-data text-[8px] tracking-[0.2em] mb-0.5" style={{ color: 'rgba(240,238,233,0.3)' }}>{item.label}</p>
                      <p className="font-data text-[11px]" style={{ color: 'var(--av-text)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <Link to="/book" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] flex items-center gap-2 hover:brightness-110 transition-all w-fit" style={{ background: 'var(--av-accent)', color: '#fff' }}>
                  MANAGE TRIP <ArrowUpRight size={11} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick stats 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {QUICK_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-[6px] p-5 flex flex-col justify-between"
                style={{ background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 100 }}
              >
                <stat.icon size={13} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.3)' }} />
                <div>
                  <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-data text-[8px] tracking-[0.22em] mt-1" style={{ color: 'rgba(240,238,233,0.3)' }}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Spending chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-[6px] p-5 flex flex-col"
            style={{ background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 200 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-data text-[9px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>TRAVEL SPEND</p>
                <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em' }}>₹<CountUp end={284000} /></p>
              </div>
              <span className="font-data text-[9px] tracking-[0.2em] px-2 py-1 rounded-[3px]" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}>+18% YOY</span>
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPENDING_DATA} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="spendGradM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8F135" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C8F135" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: 'rgba(240,238,233,0.3)', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(240,238,233,0.25)', fontSize: 8, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#C8F135" strokeWidth={1.5} fill="url(#spendGradM)" dot={false} activeDot={{ r: 4, fill: '#C8F135', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Wishlist — horizontal scroll */}
          <div>
            <p className="font-data text-[9px] tracking-[0.3em] mb-3 px-1" style={{ color: 'rgba(240,238,233,0.3)' }}>WISHLIST</p>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {WISHLIST.map((w, i) => (
                <motion.div
                  key={w.dest.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                  className="rounded-[6px] overflow-hidden relative flex-shrink-0 group cursor-pointer"
                  style={{ width: 180, height: 160, border: '1px solid var(--av-border)' }}
                >
                  <Link to={`/destination/${w.dest.id}`} className="block w-full h-full absolute inset-0">
                    <img src={w.dest.image} alt={w.dest.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9), rgba(6,6,10,0.2))' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <h3 className="font-display text-base" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{w.dest.name}</h3>
                      <p className="font-data text-[9px] mt-0.5" style={{ color: 'rgba(240,238,233,0.4)' }}>₹{w.dest.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-[6px] p-5 flex flex-col"
            style={{ background: 'rgba(92,111,255,0.05)', border: '1px solid rgba(92,111,255,0.18)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} strokeWidth={1.5} style={{ color: 'var(--av-accent)' }} />
              <span className="font-data text-[9px] tracking-[0.25em]" style={{ color: 'var(--av-accent)' }}>LAST CONVERSATION</span>
            </div>
            <div className="space-y-2">
              {AI_PREVIEW.map((msg, i) => (
                <div key={i} className="rounded-[4px] px-3 py-2" style={{ background: msg.role === 'ai' ? 'rgba(92,111,255,0.1)' : 'rgba(255,107,53,0.08)', borderLeft: msg.role === 'ai' ? '2px solid rgba(92,111,255,0.4)' : 'none', borderRight: msg.role === 'user' ? '2px solid rgba(255,107,53,0.4)' : 'none', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  <p className="font-body text-[11px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.65)' }}>{msg.text}</p>
                </div>
              ))}
            </div>
            <button className="font-data text-[9px] tracking-[0.2em] mt-4 pt-3 border-t text-left hover:text-white transition-colors" style={{ color: 'var(--av-accent)', borderColor: 'rgba(92,111,255,0.2)' }}>
              CONTINUE CHAT →
            </button>
          </motion.div>

          {/* Deals alert */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-[6px] p-5"
            style={{ border: '1px solid rgba(200,241,53,0.2)', background: 'rgba(200,241,53,0.04)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[5px] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.3)' }}>
                <Clock size={14} strokeWidth={1.5} style={{ color: 'var(--av-lime)' }} />
              </div>
              <div className="flex-1">
                <p className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>3 FLASH DEALS EXPIRING SOON</p>
                <p className="font-body text-[12px] mt-1 mb-4" style={{ color: 'rgba(240,238,233,0.45)' }}>Morocco, Iceland & Tokyo — up to 34% off</p>
                <Link to="/deals" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] hover:brightness-110 transition-all inline-block" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
                  VIEW DEALS
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP LAYOUT (12-col bento grid) ── */}
        <div className="hidden lg:grid gap-3" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'auto' }}>

          {/* Upcoming trip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="relative rounded-[6px] overflow-hidden"
            style={{ gridColumn: '1 / 9', gridRow: '1 / 3', minHeight: 360, border: '1px solid var(--av-border)' }}
          >
            <img src={UPCOMING.dest.image} alt={UPCOMING.dest.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,6,10,0.88) 40%, rgba(6,6,10,0.5) 100%)' }} />
            <div className="grain-overlay" />
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-data text-[8px] tracking-[0.25em] px-2 py-1 rounded-[3px] mb-4 inline-flex items-center gap-1.5" style={{ background: 'rgba(200,241,53,0.15)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.3)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
                    {UPCOMING.status}
                  </span>
                  <h2 className="font-display" style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>
                    {UPCOMING.dest.name}
                  </h2>
                  <p className="font-body mt-2" style={{ fontSize: 14, color: 'rgba(240,238,233,0.5)' }}>
                    {UPCOMING.dest.country} · {UPCOMING.departure} → {UPCOMING.returnDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-data text-[9px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>DEPARTING IN</p>
                  <p className="font-data" style={{ fontSize: 52, color: 'var(--av-text)', lineHeight: 1, letterSpacing: '-0.03em' }}><CountUp end={UPCOMING.daysLeft} /></p>
                  <p className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.35)' }}>DAYS</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'FLIGHT', value: UPCOMING.flightCode },
                    { label: 'HOTEL', value: UPCOMING.hotel },
                    { label: 'TOTAL COST', value: `₹${UPCOMING.totalCost.toLocaleString()}` },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="font-data text-[8px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.3)' }}>{item.label}</p>
                      <p className="font-data text-sm" style={{ color: 'var(--av-text)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <Link to="/book" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] flex items-center gap-2 hover:brightness-110 transition-all" style={{ background: 'var(--av-accent)', color: '#fff' }}>
                  MANAGE TRIP <ArrowUpRight size={11} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick stats */}
          {QUICK_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-[6px] p-5 flex flex-col justify-between"
              style={{ gridColumn: `${9 + i} / ${10 + i}`, gridRow: '1', background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 120 }}
            >
              <stat.icon size={14} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.3)' }} />
              <div>
                <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em', lineHeight: 1 }}><CountUp end={stat.value} suffix={stat.suffix} /></p>
                <p className="font-data text-[8px] tracking-[0.22em] mt-1" style={{ color: 'rgba(240,238,233,0.3)' }}>{stat.label}</p>
              </div>
            </motion.div>
          ))}

          {/* Spending chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-[6px] p-6 flex flex-col"
            style={{ gridColumn: '9 / 13', gridRow: '2', background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 240 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-data text-[9px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>TRAVEL SPEND</p>
                <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em' }}>₹<CountUp end={284000} /></p>
              </div>
              <span className="font-data text-[9px] tracking-[0.2em] px-2 py-1 rounded-[3px]" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}>+18% YOY</span>
            </div>
            <div className="flex-1" style={{ minHeight: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPENDING_DATA} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8F135" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C8F135" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: 'rgba(240,238,233,0.3)', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(240,238,233,0.25)', fontSize: 8, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#C8F135" strokeWidth={1.5} fill="url(#spendGrad)" dot={false} activeDot={{ r: 4, fill: '#C8F135', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Wishlist items */}
          {WISHLIST.map((w, i) => (
            <motion.div
              key={w.dest.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
              className="rounded-[6px] overflow-hidden relative group cursor-pointer"
              style={{ gridColumn: `${1 + i * 3} / ${4 + i * 3}`, gridRow: '3', minHeight: 180, border: '1px solid var(--av-border)' }}
            >
              <Link to={`/destination/${w.dest.id}`} className="block w-full h-full absolute inset-0">
                <img src={w.dest.image} alt={w.dest.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9), rgba(6,6,10,0.2))' }} />
                <div className="grain-overlay" />
                <div className="absolute top-3 right-3 z-10">
                  <Heart size={13} strokeWidth={1.5} style={{ color: 'var(--av-orange)' }} fill="rgba(255,107,53,0.5)" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="font-display text-lg" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{w.dest.name}</h3>
                  <p className="font-data text-[9px] mt-0.5" style={{ color: 'rgba(240,238,233,0.4)' }}>Added {w.added} · ₹{w.dest.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* AI preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-[6px] p-5 flex flex-col"
            style={{ gridColumn: '10 / 13', gridRow: '3', minHeight: 180, background: 'rgba(92,111,255,0.05)', border: '1px solid rgba(92,111,255,0.18)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} strokeWidth={1.5} style={{ color: 'var(--av-accent)' }} />
              <span className="font-data text-[9px] tracking-[0.25em]" style={{ color: 'var(--av-accent)' }}>LAST CONVERSATION</span>
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
              {AI_PREVIEW.map((msg, i) => (
                <div key={i} className="rounded-[4px] px-3 py-2" style={{ background: msg.role === 'ai' ? 'rgba(92,111,255,0.1)' : 'rgba(255,107,53,0.08)', borderLeft: msg.role === 'ai' ? '2px solid rgba(92,111,255,0.4)' : 'none', borderRight: msg.role === 'user' ? '2px solid rgba(255,107,53,0.4)' : 'none', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  <p className="font-body text-[11px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.65)' }}>{msg.text}</p>
                </div>
              ))}
            </div>
            <button className="font-data text-[9px] tracking-[0.2em] mt-4 pt-3 border-t text-left hover:text-white transition-colors" style={{ color: 'var(--av-accent)', borderColor: 'rgba(92,111,255,0.2)' }}>
              CONTINUE CHAT →
            </button>
          </motion.div>

          {/* Deals alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-[6px] p-5 flex items-center justify-between"
            style={{ gridColumn: '1 / 13', gridRow: '4', border: '1px solid rgba(200,241,53,0.2)', background: 'rgba(200,241,53,0.04)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-[5px] flex items-center justify-center" style={{ background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.3)' }}>
                <Clock size={14} strokeWidth={1.5} style={{ color: 'var(--av-lime)' }} />
              </div>
              <div>
                <p className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>3 FLASH DEALS EXPIRING SOON</p>
                <p className="font-body text-[12px] mt-0.5" style={{ color: 'rgba(240,238,233,0.45)' }}>Morocco, Iceland, and Tokyo — prices drop by up to 34% in the next 48 hours</p>
              </div>
            </div>
            <Link to="/deals" className="font-data text-[10px] tracking-[0.2em] px-6 py-2.5 rounded-[5px] hover:brightness-110 transition-all" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
              VIEW DEALS
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
