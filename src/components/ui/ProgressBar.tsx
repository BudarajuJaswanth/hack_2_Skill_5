import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'terracotta' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantColors = {
  terracotta: 'bg-terracotta',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'terracotta',
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-charcoal-light">{label}</span>}
          {showLabel && <span className="text-sm font-medium text-charcoal">{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-cream rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variantColors[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
        />
      </div>
    </div>
  );
}
