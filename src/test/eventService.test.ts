import { describe, it, expect } from 'vitest';
import { eventService } from '@/services/eventService';
import { demoEvents } from '@/data/demo';

describe('Event Service Data Operations', () => {
  it('retrieves all managed events', async () => {
    const events = await eventService.getEvents();
    expect(events).toBeDefined();
    expect(events.length).toBe(demoEvents.length);
  });

  it('retrieves a single event by valid ID', async () => {
    const target = demoEvents[0];
    const event = await eventService.getEventById(target.id);
    expect(event).toBeDefined();
    expect(event?.id).toBe(target.id);
    expect(event?.name).toBe(target.name);
  });

  it('returns undefined for nonexistent event ID', async () => {
    const event = await eventService.getEventById('nonexistent-id');
    expect(event).toBeUndefined();
  });

  it('retrieves tasks filtered by event ID', async () => {
    const target = demoEvents[0];
    const tasks = await eventService.getTasksByEventId(target.id);
    expect(Array.isArray(tasks)).toBe(true);
    tasks.forEach((t) => expect(t.eventId).toBe(target.id));
  });

  it('retrieves all global tasks', async () => {
    const tasks = await eventService.getAllTasks();
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('retrieves guests for a celebration', async () => {
    const target = demoEvents[0];
    const guests = await eventService.getGuestsByEventId(target.id);
    expect(Array.isArray(guests)).toBe(true);
  });

  it('retrieves budget items for a celebration', async () => {
    const target = demoEvents[0];
    const items = await eventService.getBudgetItemsByEventId(target.id);
    expect(Array.isArray(items)).toBe(true);
  });

  it('retrieves vendors for a celebration', async () => {
    const target = demoEvents[0];
    const vendors = await eventService.getVendorsByEventId(target.id);
    expect(Array.isArray(vendors)).toBe(true);
  });

  it('retrieves timeline schedule items', async () => {
    const target = demoEvents[0];
    const timeline = await eventService.getTimelineByEventId(target.id);
    expect(Array.isArray(timeline)).toBe(true);
  });

  it('retrieves activities and notifications', async () => {
    const activities = await eventService.getActivities();
    const notifications = await eventService.getNotifications();
    expect(activities.length).toBeGreaterThan(0);
    expect(notifications.length).toBeGreaterThan(0);
  });

  it('calculates comprehensive dashboard aggregate metrics', async () => {
    const stats = await eventService.getDashboardStats();
    expect(stats.totalEvents).toBe(demoEvents.length);
    expect(stats.totalBudget).toBeGreaterThan(0);
    expect(stats.totalSpent).toBeGreaterThanOrEqual(0);
    expect(typeof stats.completedTasks).toBe('number');
    expect(typeof stats.pendingTasks).toBe('number');
  });
});

