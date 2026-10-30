/**
 * Event Service
 * Handles all event-related data operations.
 * Currently uses local demo data; designed for easy Supabase migration.
 */

import type { Event, Task, Guest, BudgetItem, Vendor, TimelineItem, DashboardStats, Activity, AppNotification } from '@/types';
import { demoEvents, demoTasks, demoGuests, demoBudgetItems, demoVendors, demoTimeline, demoActivities, demoNotifications } from '@/data/demo';

// Simulated async delay for realistic UX (bypassed in test mode for instant execution)
const delay = (ms: number) =>
  import.meta.env.MODE === 'test' ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, ms));

export const eventService = {
  // Events
  async getEvents(): Promise<Event[]> {
    await delay(200);
    return [...demoEvents];
  },

  async getEventById(id: string): Promise<Event | undefined> {
    await delay(150);
    return demoEvents.find(e => e.id === id);
  },

  // Tasks
  async getTasksByEventId(eventId: string): Promise<Task[]> {
    await delay(150);
    return demoTasks.filter(t => t.eventId === eventId);
  },

  async getAllTasks(): Promise<Task[]> {
    await delay(200);
    return [...demoTasks];
  },

  // Guests
  async getGuestsByEventId(eventId: string): Promise<Guest[]> {
    await delay(150);
    return demoGuests.filter(g => g.eventId === eventId);
  },

  // Budget
  async getBudgetItemsByEventId(eventId: string): Promise<BudgetItem[]> {
    await delay(150);
    return demoBudgetItems.filter(b => b.eventId === eventId);
  },

  // Vendors
  async getVendorsByEventId(eventId: string): Promise<Vendor[]> {
    await delay(150);
    return demoVendors.filter(v => v.eventId === eventId);
  },

  // Timeline
  async getTimelineByEventId(eventId: string): Promise<TimelineItem[]> {
    await delay(150);
    return demoTimeline.filter(t => t.eventId === eventId);
  },

  // Activities
  async getActivities(): Promise<Activity[]> {
    await delay(150);
    return [...demoActivities];
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    await delay(100);
    return [...demoNotifications];
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(250);
    const now = new Date();
    const upcomingEvents = demoEvents.filter(e => new Date(e.date) > now).length;
    const totalGuests = demoGuests.length;
    const totalBudget = demoEvents.reduce((sum, e) => sum + e.budget, 0);
    const totalSpent = demoEvents.reduce((sum, e) => sum + e.spent, 0);
    const completedTasks = demoTasks.filter(t => t.status === 'completed').length;
    const pendingTasks = demoTasks.filter(t => t.status === 'pending').length;
    const overdueTasks = demoTasks.filter(t => t.status === 'overdue').length;

    return {
      totalEvents: demoEvents.length,
      upcomingEvents,
      totalGuests,
      totalBudget,
      totalSpent,
      completedTasks,
      pendingTasks,
      overdueTasks,
    };
  },
};
