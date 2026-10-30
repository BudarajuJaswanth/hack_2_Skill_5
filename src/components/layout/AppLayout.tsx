import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
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
  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Skip to Main Content Link for Screen Readers and Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-terracotta focus:text-white focus:rounded-lg focus:shadow-md focus:outline-none"
      >
        Skip to main content
      </a>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto focus:outline-none"
        >
          <Outlet />
        </main>
      </div>

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
