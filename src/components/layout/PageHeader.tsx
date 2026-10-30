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
      className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8', className)}
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-charcoal">{title}</h1>
        {description && (
          <p className="text-charcoal-light mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
