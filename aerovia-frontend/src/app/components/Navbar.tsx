import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth, getInitials } from '../context/AuthContext';

interface NavbarProps {
  onChatOpen: () => void;
  chatOpen: boolean;
}

const navLinks = [
  { label: 'EXPLORE',   path: '/search' },
  { label: 'FLIGHTS',   path: '/flights' },
  { label: 'HOTELS',    path: '/hotels' },
  { label: 'PACKAGES',  path: '/packages' },
  { label: 'DEALS',     path: '/deals' },
  { label: 'DASHBOARD', path: '/dashboard' },
];

export function Navbar({ onChatOpen, chatOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
      animate={{ backgroundColor: scrolled ? 'rgba(14,14,22,0.88)' : 'rgba(0,0,0,0)' }}
      style={{
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 max-w-[1680px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-data text-[11px]" style={{ color: 'var(--av-accent)' }}>◆</span>
          <span className="font-data text-sm tracking-[0.28em]" style={{ color: 'var(--av-text)' }}>AEROVIA</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="font-data text-[10px] tracking-[0.22em] transition-colors duration-200"
              style={{ color: location.pathname === link.path ? 'var(--av-text)' : 'rgba(240,238,233,0.35)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={onChatOpen}
            className="flex items-center gap-2 transition-colors"
            style={{ color: chatOpen ? 'var(--av-lime)' : 'var(--av-accent)' }}
          >
            <Sparkles size={14} strokeWidth={1.5} />
            <span className="font-data text-[10px] tracking-[0.2em]">AI</span>
          </button>

          {isAuthenticated && user ? (
            /* ── Authenticated: avatar dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] border transition-all hover:border-[rgba(92,111,255,0.4)]"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'var(--av-surface)' }}
              >
                {/* Avatar */}
                <div
                  className="w-6 h-6 rounded-[4px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(92,111,255,0.4), rgba(92,111,255,0.1))', border: '1px solid rgba(92,111,255,0.3)' }}
                >
                  <span className="font-data text-[9px]" style={{ color: 'var(--av-accent)' }}>{getInitials(user.name)}</span>
                </div>
                <span className="font-data text-[10px] tracking-[0.15em]" style={{ color: 'var(--av-text)' }}>
                  {user.name.split(' ')[0].toUpperCase()}
                </span>
                <ChevronDown
                  size={11} strokeWidth={1.5}
                  style={{ color: 'rgba(240,238,233,0.4)', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-52 rounded-[8px] overflow-hidden"
                    style={{ background: '#0E0E16', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="font-data text-[10px] tracking-[0.15em]" style={{ color: 'var(--av-text)' }}>{user.name}</p>
                      <p className="font-body text-[11px] mt-0.5 truncate" style={{ color: 'rgba(240,238,233,0.35)' }}>{user.email}</p>
                    </div>

                    {/* Links */}
                    {[
                      { to: '/profile', icon: User, label: 'MY PROFILE' },
                      { to: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                        style={{ color: 'rgba(240,238,233,0.55)' }}
                      >
                        <item.icon size={12} strokeWidth={1.5} />
                        <span className="font-data text-[10px] tracking-[0.18em]">{item.label}</span>
                      </Link>
                    ))}

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-[rgba(255,107,53,0.08)]"
                        style={{ color: 'rgba(255,107,53,0.65)' }}
                      >
                        <LogOut size={12} strokeWidth={1.5} />
                        <span className="font-data text-[10px] tracking-[0.18em]">SIGN OUT</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Not authenticated ── */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="font-data text-[10px] tracking-[0.2em] px-4 py-2.5 rounded-[6px] border transition-all hover:border-[rgba(255,255,255,0.2)]"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.55)' }}
              >
                LOGIN
              </Link>
              <Link
                to="/book"
                className="font-data text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-[6px] transition-all hover:brightness-110"
                style={{ background: 'var(--av-lime)', color: '#06060A' }}
              >
                BOOK
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" style={{ color: 'var(--av-text)' }} onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(9,9,15,0.99)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {/* User info if logged in */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-9 h-9 rounded-[6px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(92,111,255,0.3), rgba(92,111,255,0.08))', border: '1px solid rgba(92,111,255,0.3)' }}>
                    <span className="font-data text-[11px]" style={{ color: 'var(--av-accent)' }}>{getInitials(user.name)}</span>
                  </div>
                  <div>
                    <p className="font-data text-[11px] tracking-[0.15em]" style={{ color: 'var(--av-text)' }}>{user.name}</p>
                    <p className="font-body text-[11px]" style={{ color: 'rgba(240,238,233,0.35)' }}>{user.email}</p>
                  </div>
                </div>
              )}

              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="font-data text-[11px] tracking-[0.22em] px-3 py-3 rounded-[5px] transition-colors" style={{ color: location.pathname === link.path ? 'var(--av-text)' : 'rgba(240,238,233,0.5)', background: location.pathname === link.path ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0)' }}>
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link to="/profile" className="font-data text-[11px] tracking-[0.22em] px-3 py-3 rounded-[5px] transition-colors" style={{ color: 'rgba(240,238,233,0.5)' }}>
                  MY PROFILE
                </Link>
              )}

              <button onClick={onChatOpen} className="font-data text-[11px] tracking-[0.2em] text-left px-3 py-3 rounded-[5px]" style={{ color: 'var(--av-accent)' }}>
                AI CONCIERGE
              </button>

              <div className="flex gap-3 mt-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {isAuthenticated ? (
                  <button onClick={logout} className="font-data text-[10px] tracking-[0.2em] px-5 py-3 rounded-[6px] flex-1 transition-all" style={{ border: '1px solid rgba(255,107,53,0.2)', color: 'rgba(255,107,53,0.65)' }}>
                    SIGN OUT
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="font-data text-[10px] tracking-[0.2em] px-5 py-3 rounded-[6px] text-center flex-1 border" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.55)' }}>
                      LOGIN
                    </Link>
                    <Link to="/register" className="font-data text-[10px] tracking-[0.2em] px-5 py-3 rounded-[6px] text-center flex-1" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
                      REGISTER
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
