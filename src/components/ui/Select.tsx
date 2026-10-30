import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
              'w-full appearance-none rounded-lg border bg-card-white px-3 py-2 pr-10 text-sm text-charcoal',
              'focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta',
              'transition-colors duration-200',
              error ? 'border-error' : 'border-border',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light pointer-events-none" />
        </div>
        {error && <p id={`${selectId}-error`} role="alert" className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
