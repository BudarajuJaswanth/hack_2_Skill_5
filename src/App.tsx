import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from '@/context/EventContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailsPage } from '@/pages/EventDetailsPage';
import { TasksPage } from '@/pages/TasksPage';
import { GuestsPage } from '@/pages/GuestsPage';
import { BudgetPage } from '@/pages/BudgetPage';
import { VendorsPage } from '@/pages/VendorsPage';
import { TimelinePage } from '@/pages/TimelinePage';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authenticated Application Workspace */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Convenience Redirects */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EventProvider>
  );
}
