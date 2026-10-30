import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  Users,
  Store,
  Clock,
  ClipboardList,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/events', icon: Calendar, label: 'My Events' },
  { path: '/budget', icon: Wallet, label: 'Budget Planner' },
  { path: '/guests', icon: Users, label: 'Guest Management' },
  { path: '/vendors', icon: Store, label: 'Vendors' },
  { path: '/timeline', icon: Clock, label: 'Timeline' },
  { path: '/tasks', icon: ClipboardList, label: 'Tasks' },
  { path: '/ai-assistant', icon: Sparkles, label: 'AI Event Assistant' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col h-screen bg-card-white border-r border-border sticky top-0 shrink-0 z-20"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-4 h-18 border-b border-border-light">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-terracotta/10 shrink-0 shadow-sm">
          <PartyPopper className="h-5 w-5 text-terracotta" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="font-heading font-bold text-charcoal text-lg leading-tight tracking-tight">
                Gather & Glow
              </h1>
              <p className="text-[11px] text-terracotta font-medium tracking-wide">
                Luxury Event Studio
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-terracotta/10 text-terracotta font-semibold shadow-xs'
                  : 'text-charcoal-light hover:bg-cream hover:text-charcoal'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                  isActive ? 'text-terracotta' : 'text-charcoal-light group-hover:text-terracotta'
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-terracotta" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border-light bg-ivory/40">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl text-charcoal-light hover:bg-card-white hover:text-charcoal hover:shadow-xs transition-all border border-transparent hover:border-border-light cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
