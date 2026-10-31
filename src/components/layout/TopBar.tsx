import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Plus,
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Wallet,
  Users,
  Store,
  Clock,
  ClipboardList,
  Sparkles,
  Settings,
  PartyPopper,
  CheckCircle2,
  Clock3,
  LogOut,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useEventContext } from '@/context/EventContext';
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

interface TopBarProps {
  mobileMenuOpenExternal?: boolean;
  setMobileMenuOpenExternal?: (open: boolean) => void;
}

export function TopBar({ mobileMenuOpenExternal, setMobileMenuOpenExternal }: TopBarProps = {}) {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsCreateEventOpen,
    setIsSearchOpen,
  } = useEventContext();

  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = mobileMenuOpenExternal !== undefined ? mobileMenuOpenExternal : internalMobileMenuOpen;
  const setMobileMenuOpen = (open: boolean) => {
    setInternalMobileMenuOpen(open);
    setMobileMenuOpenExternal?.(open);
  };

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-card-white/90 backdrop-blur-md border-b border-border-light">
      <div className="flex items-center justify-between h-16 sm:h-18 px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* Mobile: Logo + Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-charcoal-light hover:bg-cream transition-colors cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-terracotta/10">
              <PartyPopper className="h-4 w-4 text-terracotta" />
            </div>
            <span className="font-heading font-bold text-charcoal text-base">Gather & Glow</span>
          </div>
        </div>

        {/* Global Search Bar (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-border bg-ivory/60 hover:bg-ivory hover:border-terracotta/30 text-charcoal-light text-sm transition-all shadow-xs cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-charcoal-light/70 group-hover:text-terracotta transition-colors" />
              <span className="text-charcoal-light/70 group-hover:text-charcoal text-xs sm:text-sm">
                Search celebrations, tasks, guests...
              </span>
            </span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-charcoal-light/70 bg-card-white rounded-md border border-border-light">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Section: Mobile search trigger, Notifications, Profile, Create Event */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-1.5 rounded-xl text-charcoal-light hover:bg-cream transition-colors cursor-pointer"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications Dropdown Container */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-2.5 rounded-xl text-charcoal-light hover:bg-cream hover:text-charcoal transition-colors cursor-pointer"
              aria-label="Notifications"
              aria-expanded={notifDropdownOpen}
              aria-haspopup="dialog"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span
                  role="status"
                  aria-live="polite"
                  aria-label={`${unreadNotificationsCount} unread notifications`}
                  className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-terracotta rounded-full flex items-center justify-center animate-pulse"
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-card-white rounded-2xl shadow-modal border border-border overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-border-light flex items-center justify-between bg-ivory/40">
                    <div>
                      <h4 className="font-heading font-semibold text-charcoal text-sm">
                        Notifications
                      </h4>
                      <p className="text-[11px] text-charcoal-light">
                        {unreadNotificationsCount} unread celebration updates
                      </p>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-terracotta hover:text-terracotta-dark font-medium transition-colors cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border-light">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                        className={cn(
                          'p-3.5 hover:bg-cream/40 transition-colors cursor-pointer flex gap-3 text-left',
                          !item.read ? 'bg-cream/20' : ''
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === 'alert' ? (
                            <Clock3 className="h-4 w-4 text-warning" />
                          ) : item.type === 'milestone' ? (
                            <Sparkles className="h-4 w-4 text-terracotta" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'text-xs font-semibold text-charcoal truncate',
                              !item.read ? 'text-charcoal font-bold' : 'text-charcoal-light'
                            )}
                          >
                            {item.title}
                          </p>
                          <p className="text-[11px] text-charcoal-light line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                          <span className="text-[10px] text-charcoal-light/60 mt-1 block">
                            {item.time}
                          </span>
                        </div>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-terracotta mt-1 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border-light text-center bg-ivory/30">
                    <button
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        navigate('/events');
                      }}
                      className="text-xs text-charcoal-light hover:text-terracotta font-medium transition-colors"
                    >
                      View all celebration alerts
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown Container */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-xl hover:bg-cream transition-colors cursor-pointer border border-transparent hover:border-border-light"
              aria-label="User profile menu"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="menu"
            >
              <Avatar name="Alex Morgan" size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-charcoal leading-none">Alex Morgan</p>
                <p className="text-[10px] text-charcoal-light leading-none mt-1">Lead Architect</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-charcoal-light" />
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-card-white rounded-2xl shadow-modal border border-border overflow-hidden z-50 p-2"
                >
                  <div className="p-3 bg-ivory/60 rounded-xl mb-1.5">
                    <p className="text-xs font-bold text-charcoal">Alex Morgan</p>
                    <p className="text-[11px] text-charcoal-light truncate">
                      alex.morgan@gatherglow.com
                    </p>
                    <Badge variant="rose" size="sm" className="mt-2 text-[10px]">
                      Enterprise Planner
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-charcoal hover:bg-cream transition-colors text-left"
                    >
                      <Settings className="h-4 w-4 text-charcoal-light" />
                      Studio Preferences & Settings
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/events');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-charcoal hover:bg-cream transition-colors text-left"
                    >
                      <Calendar className="h-4 w-4 text-charcoal-light" />
                      Active Celebrations (5)
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/ai-assistant');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-charcoal hover:bg-cream transition-colors text-left"
                    >
                      <Sparkles className="h-4 w-4 text-terracotta" />
                      AI Event Architect Hub
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-charcoal hover:bg-cream transition-colors text-left"
                    >
                      <Globe className="h-4 w-4 text-charcoal-light" />
                      Public Landing Page
                    </button>
                  </div>

                  <div className="pt-1 mt-1 border-t border-border-light">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-error hover:bg-error/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 text-error" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Primary Create Event Action Button */}
          <Button
            variant="primary"
            onClick={() => setIsCreateEventOpen(true)}
            className="shadow-sm font-medium text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shrink-0"
          >
            <Plus className="h-4 w-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Create Event</span>
            <span className="sm:hidden">Event</span>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              id="mobile-navigation-menu"
              aria-label="Mobile Navigation"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-card-white border-r border-border p-5 space-y-2 overflow-y-auto lg:hidden shadow-modal flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-light">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-terracotta/10">
                      <PartyPopper className="h-4 w-4 text-terracotta" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-charcoal text-base">Gather & Glow</h2>
                      <p className="text-[10px] text-terracotta font-medium">Luxury Studio</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-1 rounded-lg text-charcoal-light hover:bg-cream"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-terracotta/10 text-terracotta font-semibold'
                            : 'text-charcoal-light hover:bg-cream hover:text-charcoal'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-light">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCreateEventOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Celebration
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
