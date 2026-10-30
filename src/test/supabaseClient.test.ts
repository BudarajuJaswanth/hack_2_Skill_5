import { describe, it, expect } from 'vitest';
import {
  mapEventToDb,
  mapEventFromDb,
  mapTaskToDb,
  mapTaskFromDb,
  mapGuestToDb,
  mapGuestFromDb,
  mapBudgetItemToDb,
  mapBudgetItemFromDb,
  mapVendorToDb,
  mapVendorFromDb,
  mapTimelineItemToDb,
  mapTimelineItemFromDb,
} from '@/services/supabaseClient';
import type { Event, Task, Guest, BudgetItem, Vendor, TimelineItem } from '@/types';

describe('Supabase Entity Mappers & Data Integrity', () => {
  it('correctly maps Event between camelCase and snake_case', () => {
    const event: Event = {
      id: 'evt-test-1',
      name: 'Elena & Julian Vineyard Wedding',
      type: 'wedding',
      status: 'planning',
      date: '2027-06-12',
      time: '16:00',
      location: 'Napa Valley, CA',
      venue: 'Rosewood Estate',
      description: 'Sunset vineyard wedding celebration',
      guestCount: 150,
      confirmedGuests: 120,
      budget: 65000,
      spent: 32000,
      theme: 'Terracotta Harvest & Tuscan Glow',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-02T00:00:00Z',
    };

    const dbRow = mapEventToDb(event);
    expect(dbRow.id).toBe(event.id);
    expect(dbRow.guest_count).toBe(150);
    expect(dbRow.confirmed_guests).toBe(120);

    const reconstructed = mapEventFromDb(dbRow);
    expect(reconstructed.id).toBe(event.id);
    expect(reconstructed.guestCount).toBe(150);
    expect(reconstructed.name).toBe(event.name);
  });

  it('correctly maps Task between camelCase and snake_case', () => {
    const task: Task = {
      id: 'tsk-test-1',
      eventId: 'evt-test-1',
      title: 'Review floral compote centerpieces',
      description: 'Confirm garden rose color palette',
      status: 'pending',
      priority: 'high',
      dueDate: '2026-11-20',
      category: 'Decor',
      createdAt: '2026-10-01T00:00:00Z',
    };

    const dbRow = mapTaskToDb(task);
    expect(dbRow.event_id).toBe(task.eventId);
    expect(dbRow.due_date).toBe(task.dueDate);

    const reconstructed = mapTaskFromDb(dbRow);
    expect(reconstructed.eventId).toBe(task.eventId);
    expect(reconstructed.dueDate).toBe(task.dueDate);
  });

  it('correctly maps Guest between camelCase and snake_case', () => {
    const guest: Guest = {
      id: 'gst-test-1',
      eventId: 'evt-test-1',
      name: 'Claire Dupont',
      email: 'claire@example.com',
      rsvpStatus: 'confirmed',
      category: 'vip',
      plusOne: true,
      plusOneName: 'Henri Dupont',
      dietaryRestrictions: 'Gluten-Free',
    };

    const dbRow = mapGuestToDb(guest);
    expect(dbRow.rsvp_status).toBe('confirmed');
    expect(dbRow.plus_one).toBe(true);

    const reconstructed = mapGuestFromDb(dbRow);
    expect(reconstructed.rsvpStatus).toBe('confirmed');
    expect(reconstructed.plusOne).toBe(true);
    expect(reconstructed.plusOneName).toBe('Henri Dupont');
  });

  it('correctly maps BudgetItem between camelCase and snake_case', () => {
    const item: BudgetItem = {
      id: 'bgt-test-1',
      eventId: 'evt-test-1',
      category: 'venue',
      description: 'Estate Courtyard Rental Fee',
      estimatedCost: 20000,
      actualCost: 19500,
      paid: true,
    };

    const dbRow = mapBudgetItemToDb(item);
    expect(dbRow.estimated_cost).toBe(20000);
    expect(dbRow.actual_cost).toBe(19500);

    const reconstructed = mapBudgetItemFromDb(dbRow);
    expect(reconstructed.estimatedCost).toBe(20000);
    expect(reconstructed.actualCost).toBe(19500);
    expect(reconstructed.paid).toBe(true);
  });

  it('correctly maps Vendor between camelCase and snake_case', () => {
    const vendor: Vendor = {
      id: 'vnd-test-1',
      eventId: 'evt-test-1',
      name: 'Bloom & Petal Co.',
      category: 'decoration',
      contactPerson: 'Elena Rose',
      phone: '(415) 555-0199',
      email: 'elena@bloompetal.com',
      quotedPrice: 9500,
      finalPrice: 8500,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      contractSigned: true,
    };

    const dbRow = mapVendorToDb(vendor);
    expect(dbRow.quoted_price).toBe(9500);
    expect(dbRow.final_price).toBe(8500);
    expect(dbRow.contract_signed).toBe(true);

    const reconstructed = mapVendorFromDb(dbRow);
    expect(reconstructed.quotedPrice).toBe(9500);
    expect(reconstructed.finalPrice).toBe(8500);
    expect(reconstructed.contractSigned).toBe(true);
  });

  it('correctly maps TimelineItem between camelCase and snake_case', () => {
    const tl: TimelineItem = {
      id: 'tl-test-1',
      eventId: 'evt-test-1',
      time: '16:00',
      title: 'Sunset Ceremony Exchange of Vows',
      description: 'Processional and ring exchange under ancient oaks',
      completed: false,
    };

    const dbRow = mapTimelineItemToDb(tl);
    expect(dbRow.time).toBe('16:00');
    expect(dbRow.title).toBe(tl.title);

    const reconstructed = mapTimelineItemFromDb(dbRow);
    expect(reconstructed.time).toBe('16:00');
    expect(reconstructed.title).toBe(tl.title);
  });
});
