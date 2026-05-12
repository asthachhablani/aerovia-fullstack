import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { wishlistApi, type WishlistSnapshot } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SaveButtonProps {
  itemType: 'flight' | 'hotel' | 'package';
  itemId: string;
  snapshot: WishlistSnapshot;
  size?: 'sm' | 'md';
  tooltip?: string;
}

export function SaveButton({ itemType, itemId, snapshot, size = 'sm', tooltip }: SaveButtonProps) {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  const iconSize = size === 'md' ? 14 : 12;
  const btnSize = size === 'md' ? 36 : 30;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowNudge(true);
      setTimeout(() => setShowNudge(false), 2200);
      return;
    }

    if (saved || loading) return;
    setLoading(true);

    try {
      await wishlistApi.add(itemType, itemId, snapshot);
      setSaved(true);
    } catch {
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <motion.button
        onClick={handleSave}
        title={tooltip || (saved ? 'Saved' : 'Save to wishlist')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.88 }}
        className="flex items-center justify-center rounded-[5px] transition-all"
        style={{
          width: btnSize,
          height: btnSize,
          background: saved
            ? 'rgba(255,107,53,0.18)'
            : 'rgba(6,6,10,0.55)',
          border: `1px solid ${saved ? 'rgba(255,107,53,0.45)' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(8px)',
          cursor: saved ? 'default' : 'pointer',
        }}
      >
        {loading ? (
          <Loader2 size={iconSize} strokeWidth={2} className="animate-spin" style={{ color: 'rgba(240,238,233,0.5)' }} />
        ) : (
          <motion.div
            animate={saved ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.35 }}
          >
            <Heart
              size={iconSize}
              strokeWidth={saved ? 0 : 1.8}
              fill={saved ? 'var(--av-orange)' : 'none'}
              style={{ color: saved ? 'var(--av-orange)' : 'rgba(240,238,233,0.55)' }}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Not logged-in nudge */}
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="absolute font-data text-[9px] tracking-[0.15em] px-3 py-2 rounded-[5px] whitespace-nowrap z-50"
            style={{
              bottom: 'calc(100% + 8px)',
              right: 0,
              background: 'rgba(6,6,10,0.92)',
              border: '1px solid rgba(92,111,255,0.35)',
              color: 'var(--av-accent)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            SIGN IN TO SAVE
            <div
              className="absolute"
              style={{
                top: '100%',
                right: 10,
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid rgba(92,111,255,0.35)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved confirmation burst */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute inset-0 rounded-[5px] pointer-events-none"
            style={{ background: 'rgba(255,107,53,0.25)', border: '1px solid rgba(255,107,53,0.4)' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
