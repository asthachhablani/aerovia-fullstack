import { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxDeg?: number;
}

export function TiltCard({ children, className = '', style, maxDeg = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    setRot({ x: -dy * maxDeg, y: dx * maxDeg });
    setGlow({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const handleLeave = () => {
    setRot({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  return (
    <div className="tilt-container" style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        animate={{ rotateX: rot.x, rotateY: rot.y }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className={`relative overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', ...style }}
      >
        {/* Subtle glare */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
            transition: 'background 0.1s',
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
