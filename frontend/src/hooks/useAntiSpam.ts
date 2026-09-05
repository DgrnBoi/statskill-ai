import { useState, useRef, useEffect, useCallback } from 'react';

export interface AntiSpamOptions {
  threshold?: number;
  windowMs?: number;
  cooldownSeconds?: number;
}

export function useAntiSpam(options: AntiSpamOptions = {}) {
  const { threshold = 5, windowMs = 2000, cooldownSeconds = 5 } = options;
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [spamMessage, setSpamMessage] = useState<string | null>(null);

  const clickTimestampsRef = useRef<number[]>([]);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanupTimer = useCallback(() => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanupTimer;
  }, [cleanupTimer]);

  const triggerLockout = useCallback((remainingSecs: number = cooldownSeconds) => {
    setIsLocked(true);
    setLockoutRemaining(remainingSecs);
    setSpamMessage(`Spam click shield active. Actions temporarily locked for ${remainingSecs} seconds.`);

    cleanupTimer();

    cooldownTimerRef.current = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          cleanupTimer();
          setIsLocked(false);
          setSpamMessage(null);
          clickTimestampsRef.current = [];
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [cooldownSeconds, cleanupTimer]);

  const guardAction = useCallback(
    <T extends (...args: any[]) => any>(callback: T) => {
      return (...args: Parameters<T>): ReturnType<T> | undefined => {
        if (isLocked) {
          return undefined;
        }

        const now = Date.now();
        clickTimestampsRef.current = clickTimestampsRef.current.filter(
          (t) => now - t < windowMs
        );
        clickTimestampsRef.current.push(now);

        if (clickTimestampsRef.current.length > threshold) {
          triggerLockout();
          return undefined;
        }

        return callback(...args);
      };
    },
    [isLocked, windowMs, threshold, triggerLockout]
  );

  return {
    isLocked,
    lockoutRemaining,
    spamMessage,
    guardAction,
    triggerLockout,
    resetLock: () => {
      cleanupTimer();
      setIsLocked(false);
      setLockoutRemaining(0);
      setSpamMessage(null);
      clickTimestampsRef.current = [];
    },
  };
}

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
