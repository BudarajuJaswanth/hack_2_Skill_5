import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light/60" />
      <input
        type="search"
        aria-label={props['aria-label'] || 'Search'}
        className={cn(
          'w-full rounded-lg border border-border bg-card-white pl-10 pr-4 py-2 text-sm',
          'placeholder:text-charcoal-light/50',
          'focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta',
          'transition-colors duration-200',
          className
        )}
        {...props}
      />
    </div>
  );
}
