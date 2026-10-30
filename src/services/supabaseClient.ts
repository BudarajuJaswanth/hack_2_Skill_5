/**
 * Supabase Client & Synchronization Service
 *
 * Provides real-time and on-demand cloud sync between Gather & Glow's
 * high-performance client state and your remote Supabase PostgreSQL database.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Event, Task, Guest, BudgetItem, Vendor, TimelineItem } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ==============================================================================
// MAPPER HELPERS (CamelCase <-> SnakeCase)
// ==============================================================================

export function mapEventToDb(event: Event) {
  return {
    id: event.id,
    name: event.name,
    type: event.type,
    status: event.status,
    date: event.date,
    time: event.time || '12:00',
    end_time: event.endTime || null,
    location: event.location,
    venue: event.venue || null,
    description: event.description || '',
    guest_count: event.guestCount || 0,
    adults_count: event.adultsCount || null,
    children_count: event.childrenCount || null,
    confirmed_guests: event.confirmedGuests || 0,
    budget: event.budget || 0,
    currency: event.currency || 'USD',
    budget_flexibility: event.budgetFlexibility || 'flexible',
    spent: event.spent || 0,
    theme: event.theme || null,
    event_style: event.eventStyle || null,
    preferred_colors: event.preferredColors || null,
    special_requirements: event.specialRequirements || null,
    cover_image: event.coverImage || null,
    is_draft: Boolean(event.isDraft),
    created_at: event.createdAt || new Date().toISOString(),
    updated_at: event.updatedAt || new Date().toISOString(),
  };
}

export function mapEventFromDb(row: any): Event {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    date: row.date,
    time: row.time,
    endTime: row.end_time || undefined,
    location: row.location,
    venue: row.venue || undefined,
    description: row.description || '',
    guestCount: Number(row.guest_count) || 0,
    adultsCount: row.adults_count ? Number(row.adults_count) : undefined,
    childrenCount: row.children_count ? Number(row.children_count) : undefined,
    confirmedGuests: Number(row.confirmed_guests) || 0,
    budget: Number(row.budget) || 0,
    currency: row.currency || 'USD',
    budgetFlexibility: row.budget_flexibility || 'flexible',
    spent: Number(row.spent) || 0,
    theme: row.theme || undefined,
    eventStyle: row.event_style || undefined,
    preferredColors: row.preferred_colors || [],
    specialRequirements: row.special_requirements || undefined,
    coverImage: row.cover_image || undefined,
    isDraft: Boolean(row.is_draft),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapTaskToDb(task: Task) {
  return {
    id: task.id,
    event_id: task.eventId,
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    due_date: task.dueDate,
    assignee: task.assignee || null,
    category: task.category || 'General',
    created_at: task.createdAt || new Date().toISOString(),
  };
}

export function mapTaskFromDb(row: any): Task {
  return {
    id: row.id,
    eventId: row.event_id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    assignee: row.assignee || undefined,
    category: row.category || 'General',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapGuestToDb(guest: Guest) {
  return {
    id: guest.id,
    event_id: guest.eventId,
    name: guest.name,
    email: guest.email || null,
    phone: guest.phone || null,
    rsvp_status: guest.rsvpStatus,
    category: guest.category || 'general',
    family_group: guest.familyGroup || null,
    invitation_status: guest.invitationStatus || 'not-sent',
    invitation_sent_date: guest.invitationSentDate || null,
    rsvp_response_date: guest.rsvpResponseDate || null,
    table_assignment: guest.tableAssignment || null,
    dietary_restrictions: guest.dietaryRestrictions || null,
    special_requirements: guest.specialRequirements || null,
    plus_one: Boolean(guest.plusOne),
    plus_one_name: guest.plusOneName || null,
    notes: guest.notes || null,
    created_at: guest.createdAt || new Date().toISOString(),
  };
}

export function mapGuestFromDb(row: any): Guest {
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    email: row.email || '',
    phone: row.phone || undefined,
    rsvpStatus: row.rsvp_status,
    category: row.category || 'general',
    familyGroup: row.family_group || undefined,
    invitationStatus: row.invitation_status || 'not-sent',
    invitationSentDate: row.invitation_sent_date || undefined,
    rsvpResponseDate: row.rsvp_response_date || undefined,
    tableAssignment: row.table_assignment || undefined,
    dietaryRestrictions: row.dietary_restrictions || undefined,
    specialRequirements: row.special_requirements || undefined,
    plusOne: Boolean(row.plus_one),
    plusOneName: row.plus_one_name || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at || undefined,
  };
}

export function mapBudgetItemToDb(item: BudgetItem) {
  return {
    id: item.id,
    event_id: item.eventId,
    category: item.category,
    description: item.description,
    estimated_cost: item.estimatedCost || 0,
    actual_cost: item.actualCost || 0,
    paid: Boolean(item.paid),
    vendor: item.vendor || null,
    due_date: item.dueDate || null,
    notes: item.notes || null,
    created_at: item.createdAt || new Date().toISOString(),
  };
}

export function mapBudgetItemFromDb(row: any): BudgetItem {
  return {
    id: row.id,
    eventId: row.event_id,
    category: row.category,
    description: row.description,
    estimatedCost: Number(row.estimated_cost) || 0,
    actualCost: Number(row.actual_cost) || 0,
    paid: Boolean(row.paid),
    vendor: row.vendor || undefined,
    dueDate: row.due_date || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at || undefined,
  };
}

export function mapVendorToDb(vendor: Vendor) {
  return {
    id: vendor.id,
    event_id: vendor.eventId,
    name: vendor.name,
    category: vendor.category,
    contact_person: vendor.contactPerson || null,
    phone: vendor.phone || null,
    email: vendor.email || null,
    quoted_price: vendor.quotedPrice || 0,
    final_price: vendor.finalPrice || 0,
    booking_date: vendor.bookingDate || null,
    booking_status: vendor.bookingStatus || 'inquired',
    payment_status: vendor.paymentStatus || 'unpaid',
    paid_amount: vendor.paidAmount || 0,
    contract_signed: Boolean(vendor.contractSigned),
    notes: vendor.notes || null,
    website: vendor.website || null,
    rating: vendor.rating || 5.0,
    amount: vendor.finalPrice || vendor.amount || 0,
    created_at: vendor.createdAt || new Date().toISOString(),
  };
}

export function mapVendorFromDb(row: any): Vendor {
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    category: row.category,
    contactPerson: row.contact_person || '',
    phone: row.phone || '',
    email: row.email || '',
    quotedPrice: Number(row.quoted_price) || 0,
    finalPrice: Number(row.final_price) || 0,
    bookingDate: row.booking_date || undefined,
    bookingStatus: row.booking_status || 'inquired',
    paymentStatus: row.payment_status || 'unpaid',
    paidAmount: Number(row.paid_amount) || 0,
    contractSigned: Boolean(row.contract_signed),
    notes: row.notes || undefined,
    website: row.website || undefined,
    rating: row.rating ? Number(row.rating) : 5.0,
    amount: Number(row.final_price) || 0,
    createdAt: row.created_at || undefined,
  };
}

export function mapTimelineItemToDb(item: TimelineItem) {
  return {
    id: item.id,
    event_id: item.eventId,
    time: item.time,
    title: item.title,
    description: item.description || '',
    responsible: item.responsible || null,
    category: item.category || 'general',
    date: item.date || null,
    location: item.location || null,
    completed: Boolean(item.completed),
    created_at: item.createdAt || new Date().toISOString(),
  };
}

export function mapTimelineItemFromDb(row: any): TimelineItem {
  return {
    id: row.id,
    eventId: row.event_id,
    time: row.time,
    title: row.title,
    description: row.description || '',
    responsible: row.responsible || undefined,
    category: row.category || 'general',
    date: row.date || undefined,
    location: row.location || undefined,
    completed: Boolean(row.completed),
    createdAt: row.created_at || undefined,
  };
}

// ==============================================================================
// SUPABASE SERVICE METHODS
// ==============================================================================

export const supabaseSyncService = {
  /**
   * Health check: Tests if tables are reachable
   */
  async testConnection(): Promise<{ success: boolean; message: string; tablesExist: boolean }> {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase credentials are not configured in .env',
        tablesExist: false,
      };
    }

    try {
      const { data, error } = await supabase.from('events').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          // Relation does not exist
          return {
            success: true,
            message: 'Connected to Supabase project! Schema tables need to be created using schema.sql.',
            tablesExist: false,
          };
        }
        return {
          success: false,
          message: `Supabase error: ${error.message} (${error.code || 'unknown'})`,
          tablesExist: false,
        };
      }

      return {
        success: true,
        message: `Connected to Supabase PostgreSQL database (${data?.length ?? 0} events indexed).`,
        tablesExist: true,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network failure connecting to Supabase: ${err.message}`,
        tablesExist: false,
      };
    }
  },

  /**
   * Pulls all portfolio celebrations and associated records from Supabase
   */
  async pullAll(): Promise<{
    events: Event[];
    tasks: Task[];
    guests: Guest[];
    budgetItems: BudgetItem[];
    vendors: Vendor[];
    timelineItems: TimelineItem[];
  } | null> {
    if (!supabase) return null;

    try {
      const [eventsRes, tasksRes, guestsRes, budgetRes, vendorsRes, timelineRes] =
        await Promise.all([
          supabase.from('events').select('*').order('date', { ascending: true }),
          supabase.from('tasks').select('*'),
          supabase.from('guests').select('*'),
          supabase.from('budget_items').select('*'),
          supabase.from('vendors').select('*'),
          supabase.from('timeline_items').select('*'),
        ]);

      if (eventsRes.error) throw eventsRes.error;

      return {
        events: (eventsRes.data || []).map(mapEventFromDb),
        tasks: (tasksRes.data || []).map(mapTaskFromDb),
        guests: (guestsRes.data || []).map(mapGuestFromDb),
        budgetItems: (budgetRes.data || []).map(mapBudgetItemFromDb),
        vendors: (vendorsRes.data || []).map(mapVendorFromDb),
        timelineItems: (timelineRes.data || []).map(mapTimelineItemFromDb),
      };
    } catch (err) {
      console.warn('Failed to pull from Supabase; using local cache', err);
      return null;
    }
  },

  /**
   * Pushes entire current local dataset to Supabase PostgreSQL
   */
  async pushAll(dataset: {
    events: Event[];
    tasks: Task[];
    guests: Guest[];
    budgetItems: BudgetItem[];
    vendors: Vendor[];
    timelineItems: TimelineItem[];
  }): Promise<{ success: boolean; message: string }> {
    if (!supabase) {
      return { success: false, message: 'Supabase credentials missing.' };
    }

    try {
      if (dataset.events.length > 0) {
        const { error } = await supabase.from('events').upsert(dataset.events.map(mapEventToDb));
        if (error) throw error;
      }

      if (dataset.tasks.length > 0) {
        const { error } = await supabase.from('tasks').upsert(dataset.tasks.map(mapTaskToDb));
        if (error) throw error;
      }

      if (dataset.guests.length > 0) {
        const { error } = await supabase.from('guests').upsert(dataset.guests.map(mapGuestToDb));
        if (error) throw error;
      }

      if (dataset.budgetItems.length > 0) {
        const { error } = await supabase.from('budget_items').upsert(dataset.budgetItems.map(mapBudgetItemToDb));
        if (error) throw error;
      }

      if (dataset.vendors.length > 0) {
        const { error } = await supabase.from('vendors').upsert(dataset.vendors.map(mapVendorToDb));
        if (error) throw error;
      }

      if (dataset.timelineItems.length > 0) {
        const { error } = await supabase.from('timeline_items').upsert(dataset.timelineItems.map(mapTimelineItemToDb));
        if (error) throw error;
      }

      return { success: true, message: 'Successfully synchronized all portfolio records to Supabase!' };
    } catch (err: any) {
      return { success: false, message: `Sync failed: ${err.message || err}` };
    }
  },

  /**
   * Real-time Single Entity Operations
   */
  async upsertEvent(event: Event) {
    if (!supabase) return;
    try {
      await supabase.from('events').upsert(mapEventToDb(event));
    } catch (e) {
      console.warn('Failed to sync event to Supabase', e);
    }
  },

  async deleteEvent(id: string) {
    if (!supabase) return;
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete event from Supabase', e);
    }
  },

  async upsertTask(task: Task) {
    if (!supabase) return;
    try {
      await supabase.from('tasks').upsert(mapTaskToDb(task));
    } catch (e) {
      console.warn('Failed to sync task to Supabase', e);
    }
  },

  async deleteTask(id: string) {
    if (!supabase) return;
    try {
      await supabase.from('tasks').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete task from Supabase', e);
    }
  },

  async upsertGuest(guest: Guest) {
    if (!supabase) return;
    try {
      await supabase.from('guests').upsert(mapGuestToDb(guest));
    } catch (e) {
      console.warn('Failed to sync guest to Supabase', e);
    }
  },

  async deleteGuest(id: string) {
    if (!supabase) return;
    try {
      await supabase.from('guests').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete guest from Supabase', e);
    }
  },

  async upsertBudgetItem(item: BudgetItem) {
    if (!supabase) return;
    try {
      await supabase.from('budget_items').upsert(mapBudgetItemToDb(item));
    } catch (e) {
      console.warn('Failed to sync budget item to Supabase', e);
    }
  },

  async deleteBudgetItem(id: string) {
    if (!supabase) return;
    try {
      await supabase.from('budget_items').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete budget item from Supabase', e);
    }
  },

  async upsertVendor(vendor: Vendor) {
    if (!supabase) return;
    try {
      await supabase.from('vendors').upsert(mapVendorToDb(vendor));
    } catch (e) {
      console.warn('Failed to sync vendor to Supabase', e);
    }
  },

  async deleteVendor(id: string) {
    if (!supabase) return;
    try {
      await supabase.from('vendors').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete vendor from Supabase', e);
    }
  },

  async upsertTimelineItem(item: TimelineItem) {
    if (!supabase) return;
    try {
      await supabase.from('timeline_items').upsert(mapTimelineItemToDb(item));
    } catch (e) {
      console.warn('Failed to sync timeline item to Supabase', e);
    }
  },

  async deleteTimelineItem(id: string) {
    if (!supabase) return;
    try {
      await supabase.from('timeline_items').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete timeline item from Supabase', e);
    }
  },
};

