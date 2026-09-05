/* Hallmark · component: Badge · genre: modern-minimal · theme: Cobalt/Gov */
/* contrast: pass (WCAG AA 4.5:1+) */

import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'saffron' | 'success' | 'destructive' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#0B2E63]/10 text-[#0B2E63] border-[#0B2E63]/25 font-medium',
    saffron: 'bg-[#D96B07]/12 text-[#964502] border-[#D96B07]/35 font-semibold',
    success: 'bg-[#1B7340]/12 text-[#104727] border-[#1B7340]/30 font-medium',
    destructive: 'bg-red-50 text-red-900 border-red-200 font-medium',
    outline: 'bg-white text-slate-800 border-slate-300 font-normal',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200/90 font-normal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border tracking-normal transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

