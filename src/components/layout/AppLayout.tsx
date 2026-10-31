import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { EventFormModal } from '@/components/modals/EventFormModal';
import { DeleteEventModal } from '@/components/modals/DeleteEventModal';
import { GlobalSearchModal } from '@/components/modals/GlobalSearchModal';
import { EventDetailsModal } from '@/components/modals/EventDetailsModal';
import { ExpenseModal } from '@/components/modals/ExpenseModal';
import { GuestModal } from '@/components/modals/GuestModal';
import { VendorModal } from '@/components/modals/VendorModal';
import { TaskModal } from '@/components/modals/TaskModal';
import { TimelineModal } from '@/components/modals/TimelineModal';

export function AppLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Skip to Main Content Link for Screen Readers and Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-terracotta focus:text-white focus:rounded-lg focus:shadow-md focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar with Header Navigation & Mobile Drawer Trigger */}
        <TopBar
          mobileMenuOpenExternal={mobileDrawerOpen}
          setMobileMenuOpenExternal={setMobileDrawerOpen}
        />

        {/* Main Content Area with Safe Bottom Padding for Mobile Nav */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-3 sm:p-5 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto focus:outline-none overflow-x-hidden"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Thumb-Friendly Bottom Navigation Bar */}
      <MobileBottomNav onOpenMoreMenu={() => setMobileDrawerOpen(true)} />

      {/* Global Interactive Modals */}
      <EventFormModal />
      <DeleteEventModal />
      <GlobalSearchModal />
      <EventDetailsModal />
      <ExpenseModal />
      <GuestModal />
      <VendorModal />
      <TaskModal />
      <TimelineModal />
    </div>
  );
}
