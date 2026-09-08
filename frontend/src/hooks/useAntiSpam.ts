import { useState, useRef, useEffect, useCallback } from 'react';

export interface AntiSpamOptions {
  threshold?: number;
  windowMs?: number;
  cooldownSeconds?: number;
}

export function useAntiSpam(options: AntiSpamOptions = {}) {
  const guardAction = useCallback(
    <T extends (...args: any[]) => any>(callback: T) => {
      return (...args: Parameters<T>): ReturnType<T> => {
        return callback(...args);
      };
    },
    []
  );

  return {
    isLocked: false,
    lockoutRemaining: 0,
    spamMessage: null,
    guardAction,
    triggerLockout: (_cooldownSeconds?: number) => {},
    resetLock: () => {},
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
