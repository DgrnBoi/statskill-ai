import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'saffron' | 'success' | 'destructive' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary-100 text-primary-900 border-primary-200',
    saffron: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    destructive: 'bg-red-50 text-red-800 border-red-300 font-semibold',
    outline: 'bg-white text-slate-700 border-slate-300',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
