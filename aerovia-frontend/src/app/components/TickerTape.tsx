const ITEMS = [
  { label: 'Tokyo', detail: '+12°C · Now trending' },
  { label: 'Maldives', detail: '3 seats left · ₹95,000' },
  { label: 'Iceland', detail: 'Aurora season open' },
  { label: 'Morocco', detail: '₹28,000 · 7 nights' },
  { label: 'Patagonia', detail: 'New route added' },
  { label: 'Norway', detail: '48H FLASH · ₹82,000' },
  { label: 'Kyoto', detail: 'Cherry blossom window' },
  { label: 'Lisbon', detail: '₹42,000 · High season' },
  { label: 'Bali', detail: 'Under ₹30,000 possible' },
  { label: 'Iceland', detail: 'Midnight sun · June' },
];

export function TickerTape() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden py-3 relative z-10"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(14,14,22,0.7)' }}
    >
      <div className="ticker-track flex whitespace-nowrap gap-0">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-10">
            <span className="font-display text-[11px] tracking-wider" style={{ color: 'var(--av-text)' }}>
              {item.label}
            </span>
            <span className="font-data text-[10px]" style={{ color: 'rgba(240,238,233,0.4)' }}>
              {item.detail}
            </span>
            <span className="font-data text-[8px]" style={{ color: 'var(--av-accent)' }}>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
