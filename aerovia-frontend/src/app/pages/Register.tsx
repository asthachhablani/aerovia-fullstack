import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BG_IMG = 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400';

const TRAVEL_STYLES = [
  'Adventure', 'Culture', 'Luxury', 'Budget', 'Solo', 'Family', 'Food & Wine', 'Wildlife',
];

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const toggleStyle = (s: string) =>
    setSelectedStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPw) return setError('Passwords do not match.');
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error ?? 'Registration failed.');
      setStep(1);
    }
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#FF6B35', '#5C6FFF', '#C8F135'];
  const strengthLabels = ['', 'WEAK', 'GOOD', 'STRONG'];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--av-bg)' }}>

      {/* Left: Form */}
      <div
        className="relative z-10 flex flex-col w-full md:w-[480px] lg:w-[540px] flex-shrink-0 px-8 sm:px-12 lg:px-16 py-12"
        style={{ background: 'var(--av-bg)', borderRight: '1px solid var(--av-border)' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-14 w-fit">
          <span className="font-data text-[11px]" style={{ color: 'var(--av-accent)' }}>◆</span>
          <span className="font-data text-sm tracking-[0.28em]" style={{ color: 'var(--av-text)' }}>AEROVIA</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-data text-[10px] tracking-[0.3em] mb-4" style={{ color: 'var(--av-lime)' }}>
            CREATE ACCOUNT · {step}/2
          </p>
          <h1 className="font-display mb-3" style={{ fontSize: 'clamp(30px, 4vw, 44px)', color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {step === 1 ? <>Join the<br />Atlas.</> : <>Your travel<br />style.</>}
          </h1>
          <p className="font-body mb-8" style={{ fontSize: 14, color: 'rgba(240,238,233,0.45)', lineHeight: 1.6 }}>
            {step === 1
              ? 'Create your account to save trips, get AI-powered recommendations, and access flash deals.'
              : 'Tell us how you like to travel. This helps the AI find better matches for you.'}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-[4px] flex items-center justify-center transition-all"
                style={{
                  background: step > s ? 'rgba(200,241,53,0.15)' : step === s ? 'var(--av-accent)' : 'var(--av-surface)',
                  border: `1px solid ${step > s ? 'rgba(200,241,53,0.4)' : step === s ? 'var(--av-accent)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {step > s
                  ? <Check size={11} strokeWidth={2.5} style={{ color: 'var(--av-lime)' }} />
                  : <span className="font-data text-[9px]" style={{ color: step === s ? '#fff' : 'rgba(240,238,233,0.3)' }}>{s}</span>
                }
              </div>
              {s < 2 && <div className="w-8 h-[1px]" style={{ background: step > 1 ? 'rgba(200,241,53,0.3)' : 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Credentials */}
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleStep1}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="font-data text-[9px] tracking-[0.28em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>FULL NAME</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Arjun Mehta"
                autoComplete="name"
                className="w-full px-5 py-4 rounded-[6px] font-body text-sm outline-none transition-all"
                style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div>
              <label className="font-data text-[9px] tracking-[0.28em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>EMAIL ADDRESS</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-5 py-4 rounded-[6px] font-body text-sm outline-none transition-all"
                style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div>
              <label className="font-data text-[9px] tracking-[0.28em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>PASSWORD</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full px-5 py-4 pr-12 rounded-[6px] font-body text-sm outline-none transition-all"
                  style={{ background: 'var(--av-surface)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--av-text)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white" style={{ color: 'rgba(240,238,233,0.3)' }}>
                  {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-[3px] flex-1 rounded-full transition-all" style={{ background: i <= pwStrength ? strengthColors[pwStrength] : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <span className="font-data text-[8px] tracking-[0.2em]" style={{ color: strengthColors[pwStrength] }}>
                    {strengthLabels[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="font-data text-[9px] tracking-[0.28em] block mb-2" style={{ color: 'rgba(240,238,233,0.35)' }}>CONFIRM PASSWORD</label>
              <input
                type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className="w-full px-5 py-4 rounded-[6px] font-body text-sm outline-none transition-all"
                style={{
                  background: 'var(--av-surface)',
                  border: `1px solid ${confirmPw && confirmPw !== password ? 'rgba(255,107,53,0.4)' : confirmPw && confirmPw === password ? 'rgba(200,241,53,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: 'var(--av-text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(92,111,255,0.5)')}
                onBlur={e => {
                  e.target.style.borderColor = confirmPw && confirmPw !== password ? 'rgba(255,107,53,0.4)' : confirmPw && confirmPw === password ? 'rgba(200,241,53,0.3)' : 'rgba(255,255,255,0.08)';
                }}
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 px-4 py-3 rounded-[6px]" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.25)' }}>
                <AlertCircle size={13} strokeWidth={1.5} style={{ color: 'var(--av-orange)', flexShrink: 0 }} />
                <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.7)' }}>{error}</p>
              </motion.div>
            )}

            <button type="submit" className="w-full font-data text-[11px] tracking-[0.2em] px-6 py-4 rounded-[6px] flex items-center justify-center gap-3 hover:brightness-110 transition-all mt-1" style={{ background: 'var(--av-lime)', color: '#06060A' }}>
              CONTINUE <ArrowRight size={13} strokeWidth={2} />
            </button>
          </motion.form>
        )}

        {/* Step 2: Travel style */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex flex-wrap gap-2 mb-8">
              {TRAVEL_STYLES.map(s => {
                const active = selectedStyles.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className="font-data text-[10px] tracking-[0.18em] px-4 py-2.5 rounded-[5px] border transition-all flex items-center gap-2"
                    style={{
                      background: active ? 'rgba(92,111,255,0.12)' : 'var(--av-surface)',
                      borderColor: active ? 'rgba(92,111,255,0.5)' : 'rgba(255,255,255,0.08)',
                      color: active ? 'var(--av-text)' : 'rgba(240,238,233,0.4)',
                    }}
                  >
                    {active && <Check size={10} strokeWidth={2.5} style={{ color: 'var(--av-accent)' }} />}
                    {s}
                  </button>
                );
              })}
            </div>

            <p className="font-body text-[12px] mb-6" style={{ color: 'rgba(240,238,233,0.3)' }}>
              Select all that apply — you can update this later in your profile.
            </p>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 px-4 py-3 rounded-[6px] mb-4" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.25)' }}>
                <AlertCircle size={13} strokeWidth={1.5} style={{ color: 'var(--av-orange)', flexShrink: 0 }} />
                <p className="font-body text-[12px]" style={{ color: 'rgba(240,238,233,0.7)' }}>{error}</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="font-data text-[10px] tracking-[0.2em] px-6 py-4 rounded-[6px] border transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,238,233,0.5)' }}
              >
                BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 font-data text-[11px] tracking-[0.2em] px-6 py-4 rounded-[6px] flex items-center justify-center gap-3 hover:brightness-110 transition-all disabled:opacity-50"
                style={{ background: 'var(--av-accent)', color: '#fff' }}
              >
                {loading ? (
                  <span className="flex gap-1">{[0,1,2].map(i => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />)}</span>
                ) : (
                  <><span>CREATE ACCOUNT</span><ArrowRight size={13} strokeWidth={2} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-body text-[13px]" style={{ color: 'rgba(240,238,233,0.4)' }}>
            Already have an account?{' '}
            <Link to="/login" className="transition-colors hover:text-white" style={{ color: 'var(--av-accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <img src={BG_IMG} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,6,10,0.55) 0%, rgba(6,6,10,0.1) 60%, rgba(6,6,10,0) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(6,6,10,0.15)' }} />
        <div className="grain-overlay" />

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="absolute bottom-12 left-12 right-12 z-10"
        >
          <p className="font-data text-[9px] tracking-[0.3em] mb-3" style={{ color: 'rgba(240,238,233,0.4)' }}>127+ DESTINATIONS</p>
          <p className="font-display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--av-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Every trip starts<br />
            <span style={{ color: 'rgba(240,238,233,0.35)' }}>with a single search.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="absolute top-12 right-12 flex flex-col gap-3"
        >
          {['Morocco', 'Iceland', 'Kyoto', 'Maldives'].map((d, i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
              className="px-4 py-2 rounded-[5px]"
              style={{ background: 'rgba(6,6,10,0.65)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
            >
              <p className="font-data text-[10px] tracking-[0.15em]" style={{ color: 'rgba(240,238,233,0.6)' }}>{d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
