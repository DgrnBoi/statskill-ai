import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'saffron' | 'success' | 'destructive' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return <span className={cn('ui-badge', `ui-badge--${variant}`, className)} {...props}>{children}</span>;
}
