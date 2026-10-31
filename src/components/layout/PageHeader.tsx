import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8', className)}
    >
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-charcoal leading-tight tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-charcoal-light mt-1 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 sm:gap-3 flex-wrap">{actions}</div>}
    </motion.div>
  );
}
