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
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
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
