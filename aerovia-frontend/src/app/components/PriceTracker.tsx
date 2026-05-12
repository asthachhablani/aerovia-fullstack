import { useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export function generatePriceSeries(
  basePrice: number,
  seed: number,
  points: number,
  variance = 0.1
): number[] {
  const rng = seededRandom(seed);
  let price = basePrice;
  return Array.from({ length: points }, () => {
    const drift = (rng() - 0.48) * variance * basePrice;
    price = Math.max(basePrice * 0.75, price + drift);
    return Math.round(price);
  });
}

export function getPriceSeed(flightId: string, routeKey?: string): number {
  return hashString(routeKey ? `${flightId}-${routeKey}` : flightId);
}

function buildPolyline(
  prices: number[],
  w: number,
  h: number,
  padding = 3
): { points: string; fillPath: string } {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = padding + (1 - (p - min) / range) * (h - padding * 2);
    return [x, y] as [number, number];
  });
  const points = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const fillPath =
    `M${pts[0][0]},${h} ` +
    pts.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ') +
    ` L${pts[pts.length - 1][0]},${h} Z`;
  return { points, fillPath };
}

interface SparklineProps {
  flightId: string;
  basePrice: number;
  width?: number;
  height?: number;
}

export function PriceSparkline({ flightId, basePrice, width = 80, height = 28 }: SparklineProps) {
  const seed = getPriceSeed(flightId);
  const prices = useMemo(() => generatePriceSeries(basePrice, seed, 7, 0.08), [basePrice, seed]);

  const first = prices[0];
  const last = prices[prices.length - 1];
  const pct = ((last - first) / first) * 100;
  const rising = pct > 0.5;
  const dropping = pct < -0.5;

  const color = dropping ? '#C8F135' : rising ? '#FF6B35' : 'rgba(240,238,233,0.35)';
  const { points, fillPath } = useMemo(() => buildPolyline(prices, width, height), [prices, width, height]);

  const gradId = `spark-grad-${flightId.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <div className="flex flex-col items-end gap-0.5">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#${gradId})`} />
        <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex items-center gap-0.5">
        {dropping ? (
          <TrendingDown size={9} strokeWidth={2} style={{ color }} />
        ) : rising ? (
          <TrendingUp size={9} strokeWidth={2} style={{ color }} />
        ) : (
          <Minus size={9} strokeWidth={2} style={{ color }} />
        )}
        <span className="font-data text-[8px]" style={{ color }}>
          {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

interface RoutePricePanelProps {
  from: string;
  to: string;
  fromCity?: string;
  toCity?: string;
  currentAvgPrice: number;
}

export function RoutePricePanel({ from, to, fromCity, toCity, currentAvgPrice }: RoutePricePanelProps) {
  const routeKey = `${from}-${to}`;
  const seed = hashString(routeKey);
  const prices = useMemo(() => generatePriceSeries(currentAvgPrice, seed, 14, 0.09), [currentAvgPrice, seed]);

  const first = prices[0];
  const last = prices[prices.length - 1];
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const pct = ((last - first) / first) * 100;
  const dropping = pct < -1;
  const rising = pct > 1;

  const W = 600;
  const H = 72;
  const { points, fillPath } = useMemo(() => buildPolyline(prices, W, H, 4), [prices]);

  const accentColor = dropping ? '#C8F135' : rising ? '#FF6B35' : 'rgba(92,111,255,0.8)';
  const today = new Date();
  const days = prices.map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  });

  return (
    <div
      className="mx-0 mb-6 rounded-[8px] overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'var(--av-surface)' }}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 pt-5 pb-3 gap-3">
        <div>
          <p className="font-data text-[9px] tracking-[0.28em] mb-1" style={{ color: 'rgba(240,238,233,0.35)' }}>
            14-DAY PRICE TRACKER
          </p>
          <p className="font-data text-[13px]" style={{ color: 'var(--av-text)', letterSpacing: '0.02em' }}>
            {(fromCity || from).toUpperCase()} <span style={{ color: 'rgba(240,238,233,0.3)' }}>→</span> {(toCity || to).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Stat label="AVG" value={`₹${avg.toLocaleString('en-IN')}`} />
          <Stat label="LOWEST" value={`₹${minP.toLocaleString('en-IN')}`} accent="var(--av-lime)" />
          <Stat label="HIGHEST" value={`₹${maxP.toLocaleString('en-IN')}`} accent="var(--av-orange)" />
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[5px]"
            style={{
              background: dropping
                ? 'rgba(200,241,53,0.08)'
                : rising
                ? 'rgba(255,107,53,0.08)'
                : 'rgba(92,111,255,0.08)',
              border: `1px solid ${dropping ? 'rgba(200,241,53,0.25)' : rising ? 'rgba(255,107,53,0.25)' : 'rgba(92,111,255,0.25)'}`,
            }}
          >
            {dropping ? (
              <TrendingDown size={12} strokeWidth={2} style={{ color: accentColor }} />
            ) : rising ? (
              <TrendingUp size={12} strokeWidth={2} style={{ color: accentColor }} />
            ) : (
              <AlertTriangle size={12} strokeWidth={1.5} style={{ color: accentColor }} />
            )}
            <span className="font-data text-[9px] tracking-[0.18em]" style={{ color: accentColor }}>
              {dropping
                ? 'PRICES DROPPING · BOOK NOW'
                : rising
                ? 'PRICES RISING · ACT FAST'
                : 'PRICES STABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pb-3 relative" style={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: H, display: 'block', minWidth: 300 }}
        >
          <defs>
            <linearGradient id="route-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((r) => (
            <line
              key={r}
              x1="0" y1={H * r} x2={W} y2={H * r}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1"
            />
          ))}
          <path d={fillPath} fill="url(#route-grad)" />
          <polyline
            points={points}
            stroke={accentColor}
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Last point dot */}
          {(() => {
            const lastX = W;
            const minV = Math.min(...prices);
            const maxV = Math.max(...prices);
            const lastY = 4 + (1 - (last - minV) / (maxV - minV || 1)) * (H - 8);
            return (
              <circle cx={lastX} cy={lastY} r="4" fill={accentColor} stroke="var(--av-surface)" strokeWidth="2" />
            );
          })()}
        </svg>
      </div>

      {/* Date labels */}
      <div className="px-5 pb-4 flex justify-between">
        <span className="font-data text-[8px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.2)' }}>{days[0]}</span>
        <span className="font-data text-[8px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.2)' }}>{days[6]}</span>
        <span className="font-data text-[8px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.2)' }}>TODAY</span>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="text-right">
      <p className="font-data text-[8px] tracking-[0.2em] mb-0.5" style={{ color: 'rgba(240,238,233,0.3)' }}>{label}</p>
      <p className="font-data text-[12px]" style={{ color: accent || 'var(--av-text)' }}>{value}</p>
    </div>
  );
}
