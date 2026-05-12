import { useState } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CustomCursor } from '../components/CustomCursor';
import { AIChat } from '../components/AIChat';
import { Footer } from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

export function Root() {
  const [chatOpen, setChatOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <AuthProvider>
      <div
        className="font-body relative"
        style={{ background: 'var(--av-bg)', minHeight: '100vh', color: 'var(--av-text)' }}
      >
        <CustomCursor />

        {/* Gemini live banner */}
        <AnimatePresence>
          {!bannerDismissed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-[60] overflow-hidden"
              style={{ background: 'rgba(92,111,255,0.08)', borderBottom: '1px solid rgba(92,111,255,0.18)' }}
            >
              <div className="flex items-center justify-center gap-3 px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--av-lime)' }} />
                <p className="font-data text-[9px] tracking-[0.22em] text-center" style={{ color: 'rgba(240,238,233,0.65)' }}>
                  AEROVIA INTELLIGENCE NOW LIVE · POWERED BY GOOGLE GEMINI AI
                </p>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="ml-2 transition-colors hover:text-white flex-shrink-0"
                  style={{ color: 'rgba(240,238,233,0.3)' }}
                >
                  <X size={11} strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Navbar onChatOpen={() => setChatOpen(true)} chatOpen={chatOpen} />
        <Outlet />
        <Footer />
        <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

        {/* Floating AI concierge button */}
        {!chatOpen && (
          <motion.button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-5 py-3.5 rounded-[8px]"
            style={{
              background: 'rgba(6,6,10,0.85)',
              border: '1px solid rgba(92,111,255,0.4)',
              color: 'var(--av-accent)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(92,111,255,0.15), 0 0 0 1px rgba(92,111,255,0.08)',
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(92,111,255,0.25), 0 0 0 1px rgba(92,111,255,0.15)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="relative">
              <Sparkles size={15} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--av-lime)', boxShadow: '0 0 6px var(--av-lime)' }} />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="font-data text-[10px] tracking-[0.22em]">AI CONCIERGE</span>
              <span className="font-data text-[8px] tracking-[0.15em]" style={{ color: 'var(--av-lime)' }}>GEMINI LIVE</span>
            </div>
          </motion.button>
        )}
      </div>
    </AuthProvider>
  );
}