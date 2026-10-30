import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cream mb-4 text-terracotta">
        {icon}
      </div>
      <h3 className="text-lg font-heading font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-sm text-charcoal-light max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
