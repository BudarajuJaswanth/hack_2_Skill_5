import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon, trend, className }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'bg-card-white rounded-xl border border-border shadow-card p-3.5 sm:p-6',
        'hover:shadow-elevated transition-shadow duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 sm:space-y-2 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-charcoal-light truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold font-heading text-charcoal truncate">{value}</p>
          {subtitle && <p className="text-[10px] sm:text-xs text-charcoal-light truncate">{subtitle}</p>}
          {trend && (
            <div className={cn('flex items-center gap-1 text-[10px] sm:text-xs font-medium', trend.positive ? 'text-success' : 'text-error')}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="hidden sm:inline text-charcoal-light font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-terracotta/10 text-terracotta shrink-0">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
