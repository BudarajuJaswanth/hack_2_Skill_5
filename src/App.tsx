import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from '@/context/EventContext';
import { AppLayout } from '@/components/layout/AppLayout';

// Lazy loaded page modules for optimal bundle code-splitting and lighthouse performance
const LandingPage = lazy(() => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const EventsPage = lazy(() => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailsPage = lazy(() => import('@/pages/EventDetailsPage').then((m) => ({ default: m.EventDetailsPage })));
const TasksPage = lazy(() => import('@/pages/TasksPage').then((m) => ({ default: m.TasksPage })));
const GuestsPage = lazy(() => import('@/pages/GuestsPage').then((m) => ({ default: m.GuestsPage })));
const BudgetPage = lazy(() => import('@/pages/BudgetPage').then((m) => ({ default: m.BudgetPage })));
const VendorsPage = lazy(() => import('@/pages/VendorsPage').then((m) => ({ default: m.VendorsPage })));
const TimelinePage = lazy(() => import('@/pages/TimelinePage').then((m) => ({ default: m.TimelinePage })));
const AIAssistantPage = lazy(() => import('@/pages/AIAssistantPage').then((m) => ({ default: m.AIAssistantPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

function PageLoadingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse"
    >
      <div className="h-8 w-64 bg-cream rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 bg-cream rounded-xl" />
        <div className="h-28 bg-cream rounded-xl" />
        <div className="h-28 bg-cream rounded-xl" />
      </div>
      <div className="h-80 bg-cream rounded-xl" />
      <span className="sr-only">Loading page...</span>
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </EventProvider>
  );
}
