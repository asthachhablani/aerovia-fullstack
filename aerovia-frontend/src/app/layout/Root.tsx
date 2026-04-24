import { useState } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CustomCursor } from '../components/CustomCursor';
import { AIChat } from '../components/AIChat';
import { AuthProvider } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function Root() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      <div
        className="font-body relative"
        style={{ background: 'var(--av-bg)', minHeight: '100vh', color: 'var(--av-text)' }}
      >
        <CustomCursor />
        <Navbar onChatOpen={() => setChatOpen(true)} chatOpen={chatOpen} />
        <Outlet />
        <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

        {/* Floating AI concierge button */}
        <motion.button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-2.5 px-5 py-3 rounded-[6px] border"
          style={{ background: 'var(--av-surface)', borderColor: 'rgba(92,111,255,0.25)', color: 'var(--av-accent)' }}
          whileHover={{ scale: 1.03, borderColor: 'rgba(92,111,255,0.6)' }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Sparkles size={14} strokeWidth={1.5} />
          <span className="font-data text-[11px] tracking-[0.2em] hidden sm:inline">AI CONCIERGE</span>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--av-lime)' }} />
        </motion.button>
      </div>
    </AuthProvider>
  );
}