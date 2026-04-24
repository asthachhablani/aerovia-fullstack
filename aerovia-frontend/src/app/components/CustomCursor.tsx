import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.matches('a, button, [role="button"], input, textarea, label, [data-hover]')) {
        setIsHover(true);
      }
    };

    const onOut = () => setIsHover(false);
    const onDown = () => setIsClick(true);
    const onUp = () => setIsClick(false);
    const onLeave = () => setIsHidden(true);
    const onEnter = () => setIsHidden(false);

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.11;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.11;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const ringSize = isClick ? 20 : isHover ? 44 : 30;
  const opacity = isHidden ? 0 : 1;

  return (
    <>
      {/* Small inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isClick ? 3 : isHover ? 7 : 5,
          height: isClick ? 3 : isHover ? 7 : 5,
          borderRadius: '50%',
          background: isHover ? 'var(--av-lime)' : 'var(--av-accent)',
          pointerEvents: 'none',
          zIndex: 999999,
          opacity,
          transition: 'width 0.2s ease, height 0.2s ease, background 0.2s, opacity 0.3s',
        }}
      />
      {/* Outer trailing ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1px solid ${isHover ? 'rgba(200,241,53,0.5)' : 'rgba(92,111,255,0.45)'}`,
          pointerEvents: 'none',
          zIndex: 999998,
          opacity,
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.2s, opacity 0.3s',
        }}
      />
    </>
  );
}