import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'w-full rounded-lg border bg-card-white px-3 py-2 text-base sm:text-sm text-charcoal',
              'placeholder:text-charcoal-light/50',
              'focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta',
              'transition-colors duration-200',
              icon && 'pl-10',
              error ? 'border-error' : 'border-border',
              className
            )}
            {...props}
          />
        </div>
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
