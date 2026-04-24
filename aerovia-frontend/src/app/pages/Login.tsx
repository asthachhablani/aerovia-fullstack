import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BG_IMG = 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Please fill in all fields.');
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error ?? 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--av-bg)' }}>

      {/* Left: Form panel */}
      <div
        className="relative z-10 flex flex-col justify-between w-full md:w-[480px] lg:w-[520px] flex-shrink-0 px-8 sm:px-12 lg:px-16 py-12"
        style={{ background: 'var(--av-bg)', borderRight: '1px solid var(--av-border)' }}
      >
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-16 w-fit">
            <span className="font-data text-[11px]" style={{ color: 'var(--av-accent)' }}>◆</span>
            <span className="font-data text-sm tracking-[0.28em]" style={{ color: 'var(--av-text)' }}>AEROVIA</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'var(--av-accent)' }}>
              MEMBER ACCESS
            </p>
            <h1 className="font-display mb-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Welcome<br />back.
            </h1>
            <p className="font-body" style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.6 }}>
              Sign in to access your trips, watchlist, and travel intelligence.
            </p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 flex flex-col justify-center py-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-data text-[9px] tracking-[0.28em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-5 py-4 rounded-[6px] font-body text-sm outline-none transition-all"
                style={{
                  background: 'var(--av-surface)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--av-text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-data text-[9px] tracking-[0.28em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-5 py-4 pr-12 rounded-[6px] font-body text-sm outline-none transition-all"
                  style={{
                    background: 'var(--av-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--av-text)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: 'rgba(240,238,233,0.3)' }}
                >
                  {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-[6px]"
                style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.25)' }}
              >
                <AlertCircle size={13} strokeWidth={1.5} style={{ color: 'var(--av-orange)', flexShrink: 0 }} />
                <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.7)' }}>{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-data text-[11px] tracking-[0.2em] px-6 py-4 rounded-[6px] flex items-center justify-center gap-3 hover:brightness-110 transition-all disabled:opacity-50 mt-2"
              style={{ background: 'var(--av-accent)', color: '#fff' }}
            >
              {loading ? (
                <span className="flex gap-1">
                  {[0,1,2].map(i => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />)}
                </span>
              ) : (
                <><span>SIGN IN</span><ArrowRight size={13} strokeWidth={2} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="font-body text-[13px]" style={{ color: 'rgba(240,238,233,0.4)' }}>
              New to Aerovia?{' '}
              <Link to="/register" className="transition-colors hover:text-white" style={{ color: 'var(--av-accent)' }}>
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer note */}
        <p className="font-data text-[9px] tracking-[0.2em]" style={{ color: 'rgba(240,238,233,0.2)' }}>
          AEROVIA / MIDNIGHT ATLAS PLATFORM
        </p>
      </div>

      {/* Right: Image panel */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <img src={BG_IMG} alt="Travel destination" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,6,10,0.6) 0%, rgba(6,6,10,0.1) 60%, rgba(6,6,10,0) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(6,6,10,0.2)' }} />
        <div className="grain-overlay" />

        {/* Quote overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="absolute bottom-12 left-12 right-12 z-10"
        >
          <p className="font-data text-[9px] tracking-[0.3em] mb-3" style={{ color: 'rgba(240,238,233,0.4)' }}>
            AEROVIA INTELLIGENCE
          </p>
          <p className="font-display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            "Not a booking engine.<br />
            <span style={{ color: 'rgba(240,238,233,0.35)' }}>An intelligence system."</span>
          </p>
        </motion.div>

        {/* Corner stat */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="absolute top-12 right-12"
        >
          <div className="px-4 py-3 rounded-[6px]" style={{ background: 'rgba(6,6,10,0.7)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
            <p className="font-data text-[8px] tracking-[0.25em] mb-1" style={{ color: 'rgba(240,238,233,0.3)' }}>ACTIVE TRAVELERS</p>
            <p className="font-data text-2xl" style={{ color: 'var(--av-lime)', letterSpacing: '-0.03em' }}>2.4M</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
