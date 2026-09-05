import React, { useEffect, useState, useRef } from 'react';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatIndian?: boolean;
  className?: string;
}

export function CountUpNumber({
  end,
  duration = 1600,
  prefix = '',
  suffix = '',
  decimals = 0,
  formatIndian = true,
  className = '',
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // If reduced motion is preferred, jump straight to target
    const prefersReducedMotion =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (prefersReducedMotion) {
      setDisplayValue(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const startCounting = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * end;

        setDisplayValue(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    if (typeof IntersectionObserver !== 'undefined' && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            startCounting();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);

      return () => {
        observer.disconnect();
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } else {
      startCounting();
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [end, duration]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : formatIndian
    ? Math.round(displayValue).toLocaleString('en-IN')
    : Math.round(displayValue).toLocaleString();

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
