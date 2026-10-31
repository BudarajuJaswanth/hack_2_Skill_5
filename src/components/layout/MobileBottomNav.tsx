import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  ClipboardList,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useEventContext } from '@/context/EventContext';
import { cn } from '@/utils/cn';

interface MobileBottomNavProps {
  onOpenMoreMenu?: () => void;
}

export function MobileBottomNav({ onOpenMoreMenu }: MobileBottomNavProps) {
  const { unreadNotificationsCount } = useEventContext();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/events', icon: Calendar, label: 'Events' },
    {
      path: '/ai-assistant',
      icon: Sparkles,
      label: 'AI Architect',
      isCenterHighlight: true,
    },
    { path: '/budget', icon: Wallet, label: 'Budget' },
    { path: '/tasks', icon: ClipboardList, label: 'Tasks' },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card-white/95 backdrop-blur-lg border-t border-border-light shadow-[0_-4px_16px_rgba(45,45,45,0.06)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          if (item.isCenterHighlight) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'relative -top-3 flex flex-col items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-full p-1',
                    isActive ? 'scale-105' : 'hover:scale-105 transition-transform'
                  )
                }
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-terracotta to-[#E29272] text-white shadow-md shadow-terracotta/30 group-active:scale-95 transition-all"
                  aria-hidden="true"
                >
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-terracotta tracking-tight mt-0.5">
                  AI Plan
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta',
                  isActive
                    ? 'text-terracotta font-semibold'
                    : 'text-charcoal-light hover:text-charcoal'
                )
              }
            >
              <item.icon className="w-5 h-5 transition-transform active:scale-90" />
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
            </NavLink>
          );
        })}

        {/* More Menu Trigger (for Guests, Vendors, Timeline, Settings) */}
        {onOpenMoreMenu && (
          <button
            type="button"
            onClick={onOpenMoreMenu}
            aria-label="Open more navigation options"
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] text-charcoal-light hover:text-charcoal active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-terracotta" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">More</span>
          </button>
        )}
      </div>
    </nav>
  );
}
