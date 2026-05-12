import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';

const LINKS = [
  {
    title: 'PLATFORM',
    items: [
      { label: 'Explore', to: '/search' },
      { label: 'Flights', to: '/flights' },
      { label: 'Hotels', to: '/hotels' },
      { label: 'Packages', to: '/packages' },
    ],
  },
  {
    title: 'DISCOVER',
    items: [
      { label: 'Flash Deals', to: '/deals' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'My Profile', to: '/profile' },
      { label: 'AI Search', to: '/search' },
    ],
  },
  {
    title: 'DESTINATIONS',
    items: [
      { label: 'Asia', to: '/search' },
      { label: 'Europe', to: '/search' },
      { label: 'Americas', to: '/search' },
      { label: 'Africa', to: '/search' },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--av-border)', background: 'var(--av-bg)' }}>
      <div className="px-4 sm:px-8 lg:px-16 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 md:gap-20">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-5 w-fit group">
              <span className="font-data text-[10px] transition-colors group-hover:text-[var(--av-lime)]" style={{ color: 'var(--av-accent)' }}>◆</span>
              <span className="font-data text-sm tracking-[0.28em]" style={{ color: 'var(--av-text)' }}>AEROVIA</span>
            </Link>
            <p className="font-body text-[13px] leading-relaxed mb-6" style={{ color: 'rgba(240,238,233,0.35)' }}>
              Travel intelligence for those who move with intention. Not a booking engine — a system.
            </p>
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-[5px]"
              style={{ background: 'rgba(92,111,255,0.08)', border: '1px solid rgba(92,111,255,0.18)' }}
            >
              <Sparkles size={11} strokeWidth={1.5} style={{ color: 'var(--av-accent)' }} />
              <span className="font-data text-[9px] tracking-[0.22em]" style={{ color: 'var(--av-accent)' }}>POWERED BY GEMINI AI</span>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--av-lime)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            {LINKS.map(col => (
              <div key={col.title}>
                <p className="font-data text-[9px] tracking-[0.3em] mb-5" style={{ color: 'rgba(240,238,233,0.25)' }}>
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.items.map(item => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="font-body text-[13px] transition-colors hover:text-white"
                        style={{ color: 'rgba(240,238,233,0.45)' }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-14 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.18)' }}>
            © 2026 AEROVIA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.18)' }}>
              MIDNIGHT ATLAS v1.0
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(200,241,53,0.6)' }} />
              <p className="font-data text-[9px] tracking-[0.18em]" style={{ color: 'rgba(240,238,233,0.18)' }}>
                ALL SYSTEMS OPERATIONAL
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
