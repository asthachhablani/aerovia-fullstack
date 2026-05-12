import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import { chatApi, type ChatMessage } from '../services/api';

interface Message extends ChatMessage {
  id: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "Hello. I'm your Aerovia concierge.\n\nTell me where you want to go — a feeling, a season, a budget. I'll take it from there.",
    time: 'Now',
  },
];

const SUGGESTED = [
  'Warm, under ₹30k, December',
  'Hidden gems, SE Asia',
  'Solo adventure, off-season',
  'Beaches not on Instagram',
  'Long weekend from Delhi',
];

function formatContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--av-text)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br />}</span>
    ));
  });
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: 'Now',
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build chat history for API (only role + content)
      const history: ChatMessage[] = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await chatApi.send(history);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: res.reply,
        time: 'Now',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Signal lost for a moment. Try again — I'll have a recommendation ready.",
        time: 'Now',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(6,6,10,0.5)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ x: 440, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 440, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: 420, background: '#09090F', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(92,111,255,0.25), rgba(92,111,255,0.08))', border: '1px solid rgba(92,111,255,0.3)' }}>
                  <Sparkles size={14} strokeWidth={1.5} style={{ color: 'var(--av-accent)' }} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 animate-pulse" style={{ background: 'var(--av-lime)', borderColor: '#09090F' }} />
                </div>
                <div>
                  <p className="font-data text-[11px] tracking-[0.2em]" style={{ color: 'var(--av-text)' }}>AI CONCIERGE</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--av-lime)' }} />
                    <p className="font-body text-[10px]" style={{ color: 'rgba(240,238,233,0.4)' }}>Live · Gemini AI</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} style={{ color: 'rgba(240,238,233,0.35)' }} className="hover:text-white transition-colors p-1 rounded-[4px] hover:bg-[rgba(255,255,255,0.05)]">
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>

            {/* Suggested prompts */}
            <div className="px-5 pt-4 pb-3 flex flex-wrap gap-2">
              {SUGGESTED.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="font-body text-[10px] px-3 py-1.5 rounded-[4px] border transition-all hover:border-[rgba(92,111,255,0.5)]"
                  style={{ background: 'rgba(92,111,255,0.06)', borderColor: 'rgba(92,111,255,0.2)', color: 'rgba(240,238,233,0.6)' }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' ? (
                    <div className="ai-message-glow rounded-[6px] p-4 max-w-[88%]" style={{ background: 'rgba(92,111,255,0.07)', borderLeft: '2px solid rgba(92,111,255,0.5)' }}>
                      <p className="font-body text-[13px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.85)' }}>
                        {formatContent(msg.content)}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-[6px] p-4 max-w-[80%]" style={{ background: 'rgba(255,107,53,0.12)', borderRight: '2px solid rgba(255,107,53,0.5)' }}>
                      <p className="font-body text-[13px] leading-relaxed" style={{ color: 'rgba(240,238,233,0.9)' }}>
                        {msg.content}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-[6px] px-5 py-4" style={{ background: 'rgba(92,111,255,0.07)', borderLeft: '2px solid rgba(92,111,255,0.4)' }}>
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--av-accent)' }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 rounded-[6px] px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Tell me where you want to go..."
                  className="flex-1 bg-transparent font-body text-[13px] outline-none placeholder:text-[rgba(240,238,233,0.25)]"
                  style={{ color: 'var(--av-text)' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 rounded-[5px] flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: 'var(--av-accent)' }}
                >
                  <Send size={12} strokeWidth={2} color="#fff" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: 'var(--av-lime)' }} />
                <p className="font-data text-[9px] tracking-wider" style={{ color: 'rgba(240,238,233,0.2)' }}>
                  AEROVIA INTELLIGENCE · GOOGLE GEMINI
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
