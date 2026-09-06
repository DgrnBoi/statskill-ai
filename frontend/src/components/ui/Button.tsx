import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'saffron' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  state?: 'default' | 'loading' | 'error' | 'success';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, state = 'default', children, disabled, type = 'button', ...props }, ref) => {
    const busy = isLoading || state === 'loading';
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || busy}
        aria-busy={busy}
        data-state={state}
        className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
        {...props}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
