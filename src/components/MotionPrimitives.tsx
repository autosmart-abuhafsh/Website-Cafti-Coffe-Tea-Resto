import React, { useRef, useState } from 'react';

export const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface StaggeredHeadlineProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  reducedMotion?: boolean;
  delayOffset?: number;
  triggerOnce?: boolean;
}

export const StaggeredHeadline: React.FC<StaggeredHeadlineProps> = ({
  text,
  as: Tag = 'h2',
  className = '',
  reducedMotion = false,
  delayOffset = 0,
}) => {
  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => {
        const delayMs = Math.round((delayOffset + index * 0.045) * 1000);
        return (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
          >
            <span
              className="animate-word-rise inline-block"
              style={{
                animationDelay: `${delayMs}ms`,
              }}
            >
              {word}
              {index < words.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        );
      })}
    </Tag>
  );
};

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  reducedMotion?: boolean;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className = 'inline-block',
  strength = 4,
  reducedMotion = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / Math.max(rect.width / 2, 1)) * strength;
    const dy = ((e.clientY - cy) / Math.max(rect.height / 2, 1)) * strength;
    setOffset({
      x: Math.max(-strength, Math.min(strength, dx)),
      y: Math.max(-strength, Math.min(strength, dy)),
    });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
};
