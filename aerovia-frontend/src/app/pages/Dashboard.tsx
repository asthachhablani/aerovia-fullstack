import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plane, Clock, TrendingUp, Sparkles, ArrowUpRight, Heart, MapPin, Loader2, PackageOpen, X, CheckCircle } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { useAuth } from '../context/AuthContext';
import { bookingsApi, wishlistApi, type Booking, type WishlistItem } from '../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildSpendingData(bookings: Booking[]) {
  const now = new Date();
  const data: { month: string; amount: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = MONTHS[d.getMonth()];
    const amount = bookings
      .filter(b => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth() && b.status !== 'cancelled';
      })
      .reduce((s, b) => s + (b.totalPrice || 0), 0);
    data.push({ month, amount });
  }
  return data;
}

const DEMO_SPENDING = [
  { month: 'Aug', amount: 22000 }, { month: 'Sep', amount: 18500 }, { month: 'Oct', amount: 42000 },
  { month: 'Nov', amount: 14000 }, { month: 'Dec', amount: 68000 }, { month: 'Jan', amount: 38500 },
  { month: 'Feb', amount: 52000 }, { month: 'Mar', amount: 28000 },
];

const DEMO_WISHLIST_ITEMS = [
  { _id: 'd1', itemType: 'destination', itemId: 'tokyo', snapshot: { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1665712638676-ff7045551805?w=800&q=80', price: 58000, country: 'Japan', tag: 'URBAN PULSE' }, createdAt: '' },
  { _id: 'd2', itemType: 'destination', itemId: 'iceland', snapshot: { name: 'Iceland', image: 'https://images.unsplash.com/photo-1769670172608-f741dd969509?w=800&q=80', price: 88000, country: 'Iceland', tag: 'OTHERWORLDLY' }, createdAt: '' },
  { _id: 'd3', itemType: 'destination', itemId: 'maldives', snapshot: { name: 'Maldives', image: 'https://images.unsplash.com/photo-1575231902188-93d58962d791?w=800&q=80', price: 95000, country: 'Maldives', tag: 'ISOLATION' }, createdAt: '' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDaysLeft(dateStr?: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  return Math.ceil(diff / 86400000);
}

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

function UpcomingTripCard({ booking }: { booking: Booking }) {
  const daysLeft = getDaysLeft(booking.travelDate);
  const image = booking.destinationImage || 'https://images.unsplash.com/photo-1665712638676-ff7045551805?w=1080&q=80';
  const name = booking.destinationName || booking.to || 'Your Trip';

  return (
    <div className="relative w-full h-full">
      <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1080&q=80'; }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,6,10,0.92) 40%, rgba(6,6,10,0.55) 100%)' }} />
      <div className="grain-overlay" />
      <div className="relative z-10 p-6 lg:p-8 flex flex-col h-full justify-between" style={{ minHeight: 'inherit' }}>
        <div className="flex items-start justify-between">
          <div>
            <span className="font-data text-[8px] tracking-[0.25em] px-2 py-1 rounded-[3px] mb-3 lg:mb-4 inline-flex items-center gap-1.5" style={{ background: 'rgba(200,241,53,0.15)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.3)', textTransform: 'uppercase' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
              {booking.status}
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>
              {name}
            </h2>
            <p className="font-body mt-1 lg:mt-2" style={{ fontSize: 13, color: 'rgba(240,238,233,0.5)' }}>
              {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              {booking.returnDate ? ` → ${new Date(booking.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
            </p>
          </div>
          {daysLeft && (
            <div className="text-right flex-shrink-0 ml-4">
              <p className="font-data text-[8px] lg:text-[9px] tracking-[0.2em] lg:tracking-[0.25em] mb-0.5" style={{ color: 'rgba(240,238,233,0.35)' }}>DEPARTING IN</p>
              <p className="font-data" style={{ fontSize: 'clamp(36px, 5vw, 52px)', color: 'var(--av-text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                <CountUp end={daysLeft} />
              </p>
              <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.35)' }}>DAYS</p>
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div className="grid grid-cols-3 gap-3 lg:gap-6">
            {[
              { label: 'TYPE', value: (booking.type || 'TRIP').toUpperCase() },
              { label: booking.flightCode ? 'FLIGHT' : 'BOOKING', value: booking.flightCode || `#${booking._id.slice(-6).toUpperCase()}` },
              { label: 'TOTAL COST', value: `₹${(booking.totalPrice || 0).toLocaleString()}` },
            ].map(item => (
              <div key={item.label}>
                <p className="font-data text-[8px] tracking-[0.2em] lg:tracking-[0.25em] mb-0.5 lg:mb-1" style={{ color: 'rgba(240,238,233,0.3)' }}>{item.label}</p>
                <p className="font-data text-[10px] lg:text-sm" style={{ color: 'var(--av-text)' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="font-data text-[10px] tracking-[0.2em] px-4 py-2.5 rounded-[5px] flex items-center gap-2 hover:brightness-110 transition-all flex-shrink-0" style={{ background: 'var(--av-accent)', color: '#fff' }}>
            VIEW <ArrowUpRight size={11} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyTripCard() {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-end p-6 lg:p-8" style={{ background: 'var(--av-surface)', minHeight: 'inherit' }}>
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1080&q=80" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="grain-overlay" />
      <div className="relative z-10">
        <PackageOpen size={28} strokeWidth={1} style={{ color: 'rgba(240,238,233,0.2)', marginBottom: 16 }} />
        <h2 className="font-display mb-2" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--av-text)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>
          No trips yet.
        </h2>
        <p className="font-body text-sm mb-5" style={{ color: 'rgba(240,238,233,0.4)', lineHeight: 1.6 }}>
          Your next adventure is one search away. Explore destinations and book your first trip.
        </p>
        <div className="flex items-center gap-3">
          <Link to="/search" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] flex items-center gap-2 hover:brightness-110 transition-all" style={{ background: 'var(--av-accent)', color: '#fff' }}>
            EXPLORE <ArrowUpRight size={11} strokeWidth={2} />
          </Link>
          <Link to="/deals" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] flex items-center gap-2 transition-all" style={{ border: '1px solid rgba(200,241,53,0.3)', color: 'var(--av-lime)' }}>
            VIEW DEALS
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    bookingsApi.getAll()
      .then(res => setBookings(res.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));
    wishlistApi.getAll()
      .then(res => setWishlist(res.items || []))
      .catch(() => setWishlist([]))
      .finally(() => setLoadingWishlist(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--av-bg)' }}>
        <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'rgba(240,238,233,0.3)' }}>AEROVIA / DASHBOARD</p>
        <h2 className="font-display text-4xl mb-3" style={{ color: 'var(--av-text)', letterSpacing: '-0.02em' }}>Sign in to continue.</h2>
        <p className="font-body text-sm mb-6" style={{ color: 'rgba(240,238,233,0.4)' }}>Your bookings and wishlist live here.</p>
        <div className="flex gap-3">
          <Link to="/login" className="font-data text-[11px] tracking-[0.2em] px-6 py-3 rounded-[6px]" style={{ background: 'var(--av-accent)', color: '#fff' }}>LOGIN</Link>
          <Link to="/register" className="font-data text-[11px] tracking-[0.2em] px-6 py-3 rounded-[6px] border" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(240,238,233,0.6)' }}>REGISTER</Link>
        </div>
      </div>
    );
  }

  const upcomingBooking = bookings.find(b => b.status === 'upcoming' || b.status === 'confirmed');
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalSpend = activeBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const uniqueCountries = new Set(activeBookings.map(b => b.to || b.destinationName || '').filter(Boolean)).size;
  const spendingData = buildSpendingData(bookings);
  const hasRealSpending = spendingData.some(d => d.amount > 0);
  const displaySpending = hasRealSpending ? spendingData : DEMO_SPENDING;
  const displayTotal = hasRealSpending ? totalSpend : 284000;
  const displayWishlist = wishlist.length > 0 ? wishlist : DEMO_WISHLIST_ITEMS;

  const QUICK_STATS = [
    { label: 'TRIPS BOOKED', value: activeBookings.length || 12, icon: Plane },
    { label: 'COUNTRIES', value: uniqueCountries || 8, icon: MapPin },
    { label: 'TOTAL SPEND', value: displayTotal, icon: TrendingUp, prefix: '₹', compact: true },
    { label: 'WISHLIST', value: wishlist.length || 15, icon: Heart },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--av-bg)', minHeight: '100vh', paddingTop: 80 }}>
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1680px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-data text-[10px] tracking-[0.3em] mb-2" style={{ color: 'var(--av-accent)' }}>AEROVIA / DASHBOARD</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--av-text)', letterSpacing: '-0.02em' }}>
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Traveller'}.
            </h1>
          </div>
          <p className="font-data text-[9px] hidden sm:block" style={{ color: 'rgba(240,238,233,0.3)' }}>
            LAST LOGIN · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()}
          </p>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col gap-3 lg:hidden">

          {/* Upcoming trip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative rounded-[6px] overflow-hidden" style={{ minHeight: 300, border: '1px solid var(--av-border)' }}>
            {loadingBookings
              ? <div className="skeleton w-full" style={{ height: 300 }} />
              : upcomingBooking
                ? <UpcomingTripCard booking={upcomingBooking} />
                : <EmptyTripCard />
            }
          </motion.div>

          {/* Quick stats 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {QUICK_STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-[6px] p-5 flex flex-col justify-between" style={{ background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 100 }}>
                <stat.icon size={13} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.3)' }} />
                <div>
                  <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {stat.compact
                      ? <span>{stat.prefix || ''}{(stat.value / 1000).toFixed(0)}k</span>
                      : <CountUp end={stat.value} />
                    }
                  </p>
                  <p className="font-data text-[8px] tracking-[0.22em] mt-1" style={{ color: 'rgba(240,238,233,0.3)' }}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Spending chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-[6px] p-5" style={{ background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 200 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-data text-[9px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>TRAVEL SPEND</p>
                <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em' }}>₹{(displayTotal / 1000).toFixed(0)}k</p>
              </div>
              {hasRealSpending && <span className="font-data text-[9px] tracking-[0.2em] px-2 py-1 rounded-[3px]" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}>REAL DATA</span>}
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displaySpending} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
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

          {/* Wishlist */}
          <div>
            <p className="font-data text-[9px] tracking-[0.3em] mb-3 px-1" style={{ color: 'rgba(240,238,233,0.3)' }}>WISHLIST {wishlist.length > 0 ? `· ${wishlist.length}` : '· DEMO'}</p>
            {loadingWishlist
              ? <div className="flex gap-3"><div className="skeleton rounded-[6px] flex-shrink-0" style={{ width: 180, height: 160 }} /><div className="skeleton rounded-[6px] flex-shrink-0" style={{ width: 180, height: 160 }} /></div>
              : (
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {displayWishlist.slice(0, 6).map((w, i) => (
                    <motion.div key={w._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }} className="rounded-[6px] overflow-hidden relative flex-shrink-0 group cursor-pointer" style={{ width: 180, height: 160, border: '1px solid var(--av-border)' }}>
                      <Link to={`/destination/${w.itemId}`} className="block w-full h-full absolute inset-0">
                        <img src={w.snapshot.image} alt={w.snapshot.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9), rgba(6,6,10,0.2))' }} />
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                          <h3 className="font-display text-base" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{w.snapshot.name}</h3>
                          <p className="font-data text-[9px] mt-0.5" style={{ color: 'rgba(240,238,233,0.4)' }}>₹{w.snapshot.price?.toLocaleString()}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  <Link to="/search" className="flex-shrink-0 rounded-[6px] flex flex-col items-center justify-center gap-2 transition-colors hover:border-[rgba(255,255,255,0.15)]" style={{ width: 180, height: 160, border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <span className="font-data text-[8px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>ADD MORE</span>
                  </Link>
                </div>
              )}
          </div>

          {/* Deals alert */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-[6px] p-5" style={{ border: '1px solid rgba(200,241,53,0.2)', background: 'rgba(200,241,53,0.04)' }}>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[5px] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.3)' }}>
                <Clock size={14} strokeWidth={1.5} style={{ color: 'var(--av-lime)' }} />
              </div>
              <div className="flex-1">
                <p className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>FLASH DEALS EXPIRING SOON</p>
                <p className="font-body text-[12px] mt-1 mb-4" style={{ color: 'rgba(240,238,233,0.45)' }}>Morocco, Iceland & Tokyo — up to 34% off limited seats.</p>
                <Link to="/deals" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] hover:brightness-110 transition-all inline-block" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
                  VIEW DEALS
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Recent bookings list */}
          {bookings.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--av-border)', background: 'var(--av-surface)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="font-data text-[9px] tracking-[0.3em]" style={{ color: 'rgba(240,238,233,0.3)' }}>BOOKING HISTORY · {bookings.length}</p>
              </div>
              {bookings.slice(0, 5).map((b, i) => (
                <div key={b._id} className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: i < Math.min(bookings.length, 5) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-[4px] flex items-center justify-center flex-shrink-0" style={{ background: b.status === 'cancelled' ? 'rgba(255,107,53,0.1)' : 'rgba(92,111,255,0.1)', border: `1px solid ${b.status === 'cancelled' ? 'rgba(255,107,53,0.2)' : 'rgba(92,111,255,0.2)'}` }}>
                      <Plane size={11} strokeWidth={1.5} style={{ color: b.status === 'cancelled' ? 'var(--av-orange)' : 'var(--av-accent)' }} />
                    </div>
                    <div>
                      <p className="font-data text-[11px]" style={{ color: 'var(--av-text)' }}>{b.destinationName || b.to || 'Trip'}</p>
                      <p className="font-data text-[9px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-data text-[11px]" style={{ color: 'var(--av-lime)' }}>₹{b.totalPrice?.toLocaleString()}</p>
                    <span className="font-data text-[8px] tracking-[0.15em] px-1.5 py-0.5 rounded-[3px]" style={{ background: b.status === 'cancelled' ? 'rgba(255,107,53,0.1)' : b.status === 'confirmed' ? 'rgba(200,241,53,0.1)' : 'rgba(92,111,255,0.1)', color: b.status === 'cancelled' ? 'var(--av-orange)' : b.status === 'confirmed' ? 'var(--av-lime)' : 'var(--av-accent)' }}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
              {bookings.length > 5 && (
                <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.3)' }}>+{bookings.length - 5} MORE BOOKINGS</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden lg:grid gap-3" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'auto' }}>

          {/* Upcoming trip — spans 8 cols, 2 rows */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative rounded-[6px] overflow-hidden" style={{ gridColumn: '1 / 9', gridRow: '1 / 3', minHeight: 360, border: '1px solid var(--av-border)' }}>
            {loadingBookings
              ? <div className="skeleton w-full h-full" style={{ minHeight: 360 }} />
              : upcomingBooking
                ? <UpcomingTripCard booking={upcomingBooking} />
                : <EmptyTripCard />
            }
          </motion.div>

          {/* Quick stats — 4 cols, 1 row each */}
          {QUICK_STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-[6px] p-5 flex flex-col justify-between" style={{ gridColumn: `${9 + i} / ${10 + i}`, gridRow: '1', background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 120 }}>
              <stat.icon size={14} strokeWidth={1.5} style={{ color: 'rgba(240,238,233,0.3)' }} />
              <div>
                <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {stat.compact ? <span>{stat.prefix || ''}{(stat.value / 1000).toFixed(0)}k</span> : <CountUp end={stat.value} />}
                </p>
                <p className="font-data text-[8px] tracking-[0.22em] mt-1" style={{ color: 'rgba(240,238,233,0.3)' }}>{stat.label}</p>
              </div>
            </motion.div>
          ))}

          {/* Spending chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-[6px] p-6 flex flex-col" style={{ gridColumn: '9 / 13', gridRow: '2', background: 'var(--av-surface)', border: '1px solid var(--av-border)', minHeight: 240 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-data text-[9px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>TRAVEL SPEND</p>
                <p className="font-data text-2xl" style={{ color: 'var(--av-text)', letterSpacing: '-0.03em' }}>₹{(displayTotal / 1000).toFixed(0)}k</p>
              </div>
              {hasRealSpending && <span className="font-data text-[9px] tracking-[0.2em] px-2 py-1 rounded-[3px]" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--av-lime)', border: '1px solid rgba(200,241,53,0.25)' }}>REAL DATA</span>}
            </div>
            <div className="flex-1" style={{ minHeight: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displaySpending} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
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
          {loadingWishlist
            ? [0,1,2].map(i => <div key={i} className="skeleton rounded-[6px]" style={{ gridColumn: `${1 + i * 3} / ${4 + i * 3}`, gridRow: '3', minHeight: 180 }} />)
            : displayWishlist.slice(0, 3).map((w, i) => (
              <motion.div key={w._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }} className="rounded-[6px] overflow-hidden relative group cursor-pointer" style={{ gridColumn: `${1 + i * 3} / ${4 + i * 3}`, gridRow: '3', minHeight: 180, border: '1px solid var(--av-border)' }}>
                <Link to={`/destination/${w.itemId}`} className="block w-full h-full absolute inset-0">
                  <img src={w.snapshot.image} alt={w.snapshot.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,10,0.9), rgba(6,6,10,0.2))' }} />
                  <div className="grain-overlay" />
                  <div className="absolute top-3 right-3 z-10">
                    <Heart size={13} strokeWidth={1.5} style={{ color: 'var(--av-orange)' }} fill="rgba(255,107,53,0.5)" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-display text-lg" style={{ color: 'var(--av-text)', letterSpacing: '-0.01em' }}>{w.snapshot.name}</h3>
                    <p className="font-data text-[9px] mt-0.5" style={{ color: 'rgba(240,238,233,0.4)' }}>₹{w.snapshot.price?.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          }

          {/* AI panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-[6px] p-5 flex flex-col" style={{ gridColumn: '10 / 13', gridRow: '3', minHeight: 180, background: 'rgba(92,111,255,0.05)', border: '1px solid rgba(92,111,255,0.18)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} strokeWidth={1.5} style={{ color: 'var(--av-accent)' }} />
              <span className="font-data text-[9px] tracking-[0.25em]" style={{ color: 'var(--av-accent)' }}>AI CONCIERGE</span>
            </div>
            <p className="font-body text-[12px] leading-relaxed flex-1" style={{ color: 'rgba(240,238,233,0.5)' }}>
              Ask me anything — &ldquo;Best beach under ₹40k&rdquo;, &ldquo;October cold-weather trip&rdquo;, or &ldquo;Surprise me&rdquo;.
            </p>
            <Link to="/search" className="font-data text-[9px] tracking-[0.2em] mt-4 pt-3 border-t text-left hover:text-white transition-colors flex items-center gap-1" style={{ color: 'var(--av-accent)', borderColor: 'rgba(92,111,255,0.2)' }}>
              OPEN AI CHAT <ArrowUpRight size={10} strokeWidth={2} />
            </Link>
          </motion.div>

          {/* Deals alert */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-[6px] p-5 flex items-center justify-between gap-4" style={{ gridColumn: '1 / 10', gridRow: '4', border: '1px solid rgba(200,241,53,0.2)', background: 'rgba(200,241,53,0.04)' }}>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[5px] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.3)' }}>
                <Clock size={14} strokeWidth={1.5} style={{ color: 'var(--av-lime)' }} />
              </div>
              <div>
                <p className="font-data text-[10px] tracking-[0.2em]" style={{ color: 'var(--av-lime)' }}>FLASH DEALS EXPIRING SOON</p>
                <p className="font-body text-[12px] mt-1" style={{ color: 'rgba(240,238,233,0.45)' }}>Morocco, Iceland & Tokyo — up to 34% off for limited seats.</p>
              </div>
            </div>
            <Link to="/deals" className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[5px] hover:brightness-110 transition-all flex-shrink-0" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
              VIEW DEALS
            </Link>
          </motion.div>

          {/* Booking history */}
          {bookings.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-[6px] overflow-hidden" style={{ gridColumn: '10 / 13', gridRow: '4', border: '1px solid var(--av-border)', background: 'var(--av-surface)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="font-data text-[8px] tracking-[0.3em]" style={{ color: 'rgba(240,238,233,0.3)' }}>RECENT · {bookings.length}</p>
              </div>
              {bookings.slice(0, 3).map((b, i) => (
                <div key={b._id} className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div>
                    <p className="font-data text-[10px]" style={{ color: 'var(--av-text)' }}>{b.destinationName || b.to || 'Trip'}</p>
                    <p className="font-data text-[8px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className="font-data text-[9px]" style={{ color: b.status === 'cancelled' ? 'var(--av-orange)' : 'var(--av-lime)' }}>₹{b.totalPrice?.toLocaleString()}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
