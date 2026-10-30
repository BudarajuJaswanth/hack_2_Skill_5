import React, { useState, useEffect, useCallback } from 'react';
import type {
  Event,
  Task,
  Activity,
  AppNotification,
  BudgetItem,
  Guest,
  GuestRsvpStatus,
  InvitationStatus,
  Vendor,
  VendorPaymentStatus,
  TimelineItem,
} from '@/types';
import {
  demoEvents,
  demoTasks,
  demoActivities,
  demoNotifications,
  demoBudgetItems,
  demoGuests,
  demoVendors,
  demoTimeline,
} from '@/data/demo';
import { EventContext } from './EventContextInstance';
import { supabaseSyncService, isSupabaseConfigured } from '@/services/supabaseClient';

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem('gatherglow_events');
      return saved ? JSON.parse(saved) : demoEvents;
    } catch {
      return demoEvents;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('gatherglow_tasks');
      return saved ? JSON.parse(saved) : demoTasks;
    } catch {
      return demoTasks;
    }
  });

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(() => {
    try {
      const saved = localStorage.getItem('gatherglow_timeline');
      return saved ? JSON.parse(saved) : demoTimeline;
    } catch {
      return demoTimeline;
    }
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('gatherglow_budget_items');
      return saved ? JSON.parse(saved) : demoBudgetItems;
    } catch {
      return demoBudgetItems;
    }
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem('gatherglow_guests');
      return saved ? JSON.parse(saved) : demoGuests;
    } catch {
      return demoGuests;
    }
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem('gatherglow_vendors');
      return saved ? JSON.parse(saved) : demoVendors;
    } catch {
      return demoVendors;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(demoActivities);
  const [notifications, setNotifications] = useState<AppNotification[]>(demoNotifications);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<BudgetItem | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<TimelineItem | null>(null);

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    return !!localStorage.getItem('gatherglow_event_draft');
  });

  // Background Cloud Sync on Initial Mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let isMounted = true;

    supabaseSyncService.pullAll().then((cloudData) => {
      if (!isMounted || !cloudData) return;
      if (cloudData.events.length > 0) setEvents(cloudData.events);
      if (cloudData.tasks.length > 0) setTasks(cloudData.tasks);
      if (cloudData.guests.length > 0) setGuests(cloudData.guests);
      if (cloudData.budgetItems.length > 0) setBudgetItems(cloudData.budgetItems);
      if (cloudData.vendors.length > 0) setVendors(cloudData.vendors);
      if (cloudData.timelineItems.length > 0) setTimelineItems(cloudData.timelineItems);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gatherglow_events', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to persist events to localStorage', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('gatherglow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('gatherglow_timeline', JSON.stringify(timelineItems));
    } catch (e) {
      console.error('Failed to persist timeline to localStorage', e);
    }
  }, [timelineItems]);

  useEffect(() => {
    try {
      localStorage.setItem('gatherglow_budget_items', JSON.stringify(budgetItems));
    } catch (e) {
      console.error('Failed to persist budget items to localStorage', e);
    }
  }, [budgetItems]);

  useEffect(() => {
    try {
      localStorage.setItem('gatherglow_guests', JSON.stringify(guests));
    } catch (e) {
      console.error('Failed to persist guests to localStorage', e);
    }
  }, [guests]);

  useEffect(() => {
    try {
      localStorage.setItem('gatherglow_vendors', JSON.stringify(vendors));
    } catch (e) {
      console.error('Failed to persist vendors to localStorage', e);
    }
  }, [vendors]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const getEventById = useCallback(
    (id: string) => {
      return events.find((e) => e.id === id);
    },
    [events]
  );

  const addEvent = useCallback(
    (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'spent' | 'confirmedGuests'>) => {
      const newEvent: Event = {
        ...eventData,
        id: `evt-${Date.now()}`,
        spent: 0,
        confirmedGuests: 0,
        currency: eventData.currency || 'USD',
        budgetFlexibility: eventData.budgetFlexibility || 'flexible',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImage:
          eventData.coverImage ||
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      };

      setEvents((prev) => [newEvent, ...prev]);
      supabaseSyncService.upsertEvent(newEvent);

      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        eventId: newEvent.id,
        eventName: newEvent.name,
        type: 'timeline',
        title: `New celebration created: ${newEvent.name}`,
        description: `Targeting ${newEvent.guestCount} guests (${newEvent.adultsCount || newEvent.guestCount} adults) at ${newEvent.venue || newEvent.location}.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      };

      setActivities((prev) => [newActivity, ...prev]);

      localStorage.removeItem('gatherglow_event_draft');
      setHasDraft(false);

      return newEvent;
    },
    []
  );

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const updated = {
            ...evt,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          supabaseSyncService.upsertEvent(updated);
          return updated;
        }
        return evt;
      })
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventId: id,
        eventName: updates.name,
        type: 'timeline',
        title: `Celebration updated: ${updates.name || 'Event details'}`,
        description: `Changes saved to logistics and planning parameters.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      },
      ...prev,
    ]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const target = prev.find((e) => e.id === id);
      const remaining = prev.filter((e) => e.id !== id);

      if (target) {
        setActivities((actPrev) => [
          {
            id: `act-${Date.now()}`,
            type: 'timeline',
            title: `Celebration removed: ${target.name}`,
            description: `Event deleted from active studio portfolio.`,
            timestamp: 'Just now',
            user: 'Alex Morgan',
          },
          ...actPrev,
        ]);
      }

      return remaining;
    });

    // Also remove associated items, guests, vendors, tasks & timeline items
    setBudgetItems((prev) => prev.filter((b) => b.eventId !== id));
    setGuests((prev) => prev.filter((g) => g.eventId !== id));
    setVendors((prev) => prev.filter((v) => v.eventId !== id));
    setTasks((prev) => prev.filter((t) => t.eventId !== id));
    setTimelineItems((prev) => prev.filter((tl) => tl.eventId !== id));

    setSelectedEvent((curr) => (curr?.id === id ? null : curr));
    setEditingEvent((curr) => (curr?.id === id ? null : curr));
    setDeletingEvent(null);
    supabaseSyncService.deleteEvent(id);
  }, []);

  const saveDraft = useCallback((draft: Partial<Event>) => {
    try {
      localStorage.setItem('gatherglow_event_draft', JSON.stringify(draft));
      setHasDraft(true);
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  }, []);

  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem('gatherglow_event_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('gatherglow_event_draft');
    setHasDraft(false);
  }, []);

  // Budget management
  const addBudgetItem = useCallback((itemData: Omit<BudgetItem, 'id' | 'createdAt'>) => {
    const newItem: BudgetItem = {
      ...itemData,
      id: `bgt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setBudgetItems((prev) => [newItem, ...prev]);
    supabaseSyncService.upsertBudgetItem(newItem);

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === itemData.eventId) {
          return {
            ...evt,
            spent: (evt.spent || 0) + Number(itemData.actualCost || 0),
            updatedAt: new Date().toISOString(),
          };
        }
        return evt;
      })
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventId: itemData.eventId,
        type: 'budget',
        title: `Expense logged: ${itemData.description}`,
        description: `$${Number(itemData.actualCost).toLocaleString()} allocated to ${itemData.category}.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      },
      ...prev,
    ]);

    return newItem;
  }, []);

  const updateBudgetItem = useCallback((id: string, updates: Partial<BudgetItem>) => {
    setBudgetItems((prev) => {
      const oldItem = prev.find((i) => i.id === id);
      const nextList = prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          supabaseSyncService.upsertBudgetItem(updated);
          return updated;
        }
        return item;
      });

      if (oldItem && updates.actualCost !== undefined && updates.actualCost !== oldItem.actualCost) {
        const diff = Number(updates.actualCost) - Number(oldItem.actualCost);
        setEvents((evts) =>
          evts.map((e) => (e.id === oldItem.eventId ? { ...e, spent: Math.max(0, (e.spent || 0) + diff) } : e))
        );
      }

      return nextList;
    });

    setSelectedBudgetItem(null);
  }, []);

  const deleteBudgetItem = useCallback((id: string) => {
    setBudgetItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        setEvents((evts) =>
          evts.map((e) =>
            e.id === target.eventId ? { ...e, spent: Math.max(0, (e.spent || 0) - (target.actualCost || 0)) } : e
          )
        );
      }
      return prev.filter((item) => item.id !== id);
    });

    setSelectedBudgetItem((curr) => (curr?.id === id ? null : curr));
    supabaseSyncService.deleteBudgetItem(id);
  }, []);

  const toggleBudgetItemPaid = useCallback((id: string) => {
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, paid: !item.paid } : item))
    );
  }, []);

  // Guest management
  const addGuest = useCallback((guestData: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `gst-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setGuests((prev) => [newGuest, ...prev]);
    supabaseSyncService.upsertGuest(newGuest);

    if (guestData.rsvpStatus === 'confirmed' || guestData.rsvpStatus === 'accepted') {
      const inc = 1 + (guestData.plusOne ? 1 : 0);
      setEvents((evts) =>
        evts.map((e) =>
          e.id === guestData.eventId
            ? { ...e, confirmedGuests: (e.confirmedGuests || 0) + inc, updatedAt: new Date().toISOString() }
            : e
        )
      );
    }

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventId: guestData.eventId,
        type: 'rsvp',
        title: `Guest registered: ${guestData.name}`,
        description: `Added to ${guestData.category || 'guest list'} with status '${guestData.rsvpStatus}'.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      },
      ...prev,
    ]);

    return newGuest;
  }, []);

  const updateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setGuests((prev) => {
      const oldGuest = prev.find((g) => g.id === id);
      const nextList = prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          supabaseSyncService.upsertGuest(updated);
          return updated;
        }
        return g;
      });

      if (oldGuest && updates.rsvpStatus && updates.rsvpStatus !== oldGuest.rsvpStatus) {
        const wasConfirmed = oldGuest.rsvpStatus === 'confirmed' || oldGuest.rsvpStatus === 'accepted';
        const isNowConfirmed = updates.rsvpStatus === 'confirmed' || updates.rsvpStatus === 'accepted';
        const weight = 1 + (oldGuest.plusOne ? 1 : 0);

        if (wasConfirmed && !isNowConfirmed) {
          setEvents((evts) =>
            evts.map((e) =>
              e.id === oldGuest.eventId ? { ...e, confirmedGuests: Math.max(0, (e.confirmedGuests || 0) - weight) } : e
            )
          );
        } else if (!wasConfirmed && isNowConfirmed) {
          setEvents((evts) =>
            evts.map((e) =>
              e.id === oldGuest.eventId ? { ...e, confirmedGuests: (e.confirmedGuests || 0) + weight } : e
            )
          );
        }
      }

      return nextList;
    });

    setSelectedGuest(null);
  }, []);

  const deleteGuest = useCallback((id: string) => {
    setGuests((prev) => {
      const target = prev.find((g) => g.id === id);
      if (target && (target.rsvpStatus === 'confirmed' || target.rsvpStatus === 'accepted')) {
        const weight = 1 + (target.plusOne ? 1 : 0);
        setEvents((evts) =>
          evts.map((e) =>
            e.id === target.eventId ? { ...e, confirmedGuests: Math.max(0, (e.confirmedGuests || 0) - weight) } : e
          )
        );
      }
      return prev.filter((g) => g.id !== id);
    });

    setSelectedGuest((curr) => (curr?.id === id ? null : curr));
    supabaseSyncService.deleteGuest(id);
  }, []);

  const updateGuestRsvp = useCallback((id: string, rsvpStatus: GuestRsvpStatus) => {
    updateGuest(id, {
      rsvpStatus,
      rsvpResponseDate:
        rsvpStatus !== 'pending' && rsvpStatus !== 'invited'
          ? new Date().toISOString().split('T')[0]
          : undefined,
    });
  }, [updateGuest]);

  const toggleInvitationSent = useCallback((id: string) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const isSent =
            g.invitationStatus === 'sent' ||
            g.invitationStatus === 'opened' ||
            g.invitationStatus === 'delivered';
          const nextStatus: InvitationStatus = isSent ? 'not-sent' : 'sent';
          const nextRsvp: GuestRsvpStatus =
            !isSent && g.rsvpStatus === 'pending' ? 'invited' : g.rsvpStatus;
          return {
            ...g,
            invitationStatus: nextStatus,
            rsvpStatus: nextRsvp,
            invitationSentDate: !isSent ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return g;
      })
    );
  }, []);

  // Vendor management
  const addVendor = useCallback((vendorData: Omit<Vendor, 'id' | 'createdAt'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `vnd-${Date.now()}`,
      amount: vendorData.finalPrice,
      createdAt: new Date().toISOString(),
    };

    setVendors((prev) => [newVendor, ...prev]);
    supabaseSyncService.upsertVendor(newVendor);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventId: vendorData.eventId,
        type: 'vendor',
        title: `Vendor added: ${vendorData.name}`,
        description: `Contracted under ${vendorData.category} at $${vendorData.finalPrice.toLocaleString()}.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      },
      ...prev,
    ]);

    return newVendor;
  }, []);

  const updateVendor = useCallback((id: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const updated = {
            ...v,
            ...updates,
            amount: updates.finalPrice !== undefined ? updates.finalPrice : v.finalPrice,
          };
          supabaseSyncService.upsertVendor(updated);
          return updated;
        }
        return v;
      })
    );

    setSelectedVendor(null);
  }, []);

  const deleteVendor = useCallback((id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    setSelectedVendor((curr) => (curr?.id === id ? null : curr));
    supabaseSyncService.deleteVendor(id);
  }, []);

  const toggleVendorContract = useCallback((id: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextSigned = !v.contractSigned;
          return {
            ...v,
            contractSigned: nextSigned,
            bookingStatus: nextSigned && v.bookingStatus === 'quoting' ? 'contracted' : v.bookingStatus,
          };
        }
        return v;
      })
    );
  }, []);

  const updateVendorPaymentStatus = useCallback((id: string, status: VendorPaymentStatus, paidAmount?: number) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          let calculatedPaid = paidAmount !== undefined ? paidAmount : v.paidAmount;
          if (status === 'paid') calculatedPaid = v.finalPrice;
          if (status === 'unpaid') calculatedPaid = 0;
          return {
            ...v,
            paymentStatus: status,
            paidAmount: calculatedPaid,
          };
        }
        return v;
      })
    );
  }, []);

  // Task management
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    supabaseSyncService.upsertTask(newTask);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventId: taskData.eventId,
        type: 'task',
        title: `Task created: ${taskData.title}`,
        description: `Priority ${taskData.priority.toUpperCase()} due on ${taskData.dueDate}.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      },
      ...prev,
    ]);

    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          supabaseSyncService.upsertTask(updated);
          return updated;
        }
        return t;
      })
    );
    setSelectedTask(null);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedTask((curr) => (curr?.id === id ? null : curr));
    supabaseSyncService.deleteTask(id);
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const next = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: next };
        }
        return t;
      })
    );
  }, []);

  // Timeline management
  const addTimelineItem = useCallback((itemData: Omit<TimelineItem, 'id' | 'createdAt'>) => {
    const newItem: TimelineItem = {
      ...itemData,
      id: `tl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTimelineItems((prev) => [...prev, newItem].sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    supabaseSyncService.upsertTimelineItem(newItem);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventId: itemData.eventId,
        type: 'timeline',
        title: `Milestone scheduled: ${itemData.title}`,
        description: `Timing set for ${itemData.time} under ${itemData.category || 'General'}.`,
        timestamp: 'Just now',
        user: 'Alex Morgan',
      },
      ...prev,
    ]);

    return newItem;
  }, []);

  const updateTimelineItem = useCallback((id: string, updates: Partial<TimelineItem>) => {
    setTimelineItems((prev) =>
      prev
        .map((tl) => {
          if (tl.id === id) {
            const updated = { ...tl, ...updates };
            supabaseSyncService.upsertTimelineItem(updated);
            return updated;
          }
          return tl;
        })
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    );
    setSelectedTimelineItem(null);
  }, []);

  const deleteTimelineItem = useCallback((id: string) => {
    setTimelineItems((prev) => prev.filter((tl) => tl.id !== id));
    setSelectedTimelineItem((curr) => (curr?.id === id ? null : curr));
    supabaseSyncService.deleteTimelineItem(id);
  }, []);

  const toggleTimelineComplete = useCallback((id: string) => {
    setTimelineItems((prev) =>
      prev.map((tl) => (tl.id === id ? { ...tl, completed: !tl.completed } : tl))
    );
  }, []);

  const syncWithSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase credentials not configured in .env' };
    }
    setIsCloudSyncing(true);
    try {
      const cloudData = await supabaseSyncService.pullAll();
      if (!cloudData) {
        return { success: false, message: 'Could not fetch records from Supabase.' };
      }
      if (cloudData.events.length > 0) setEvents(cloudData.events);
      if (cloudData.tasks.length > 0) setTasks(cloudData.tasks);
      if (cloudData.guests.length > 0) setGuests(cloudData.guests);
      if (cloudData.budgetItems.length > 0) setBudgetItems(cloudData.budgetItems);
      if (cloudData.vendors.length > 0) setVendors(cloudData.vendors);
      if (cloudData.timelineItems.length > 0) setTimelineItems(cloudData.timelineItems);

      return {
        success: true,
        message: `Synced ${cloudData.events.length} events, ${cloudData.guests.length} guests, and ${cloudData.tasks.length} tasks from Supabase.`,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed.' };
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  const pushToSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase credentials not configured in .env' };
    }
    setIsCloudSyncing(true);
    try {
      const res = await supabaseSyncService.pushAll({
        events,
        tasks,
        guests,
        budgetItems,
        vendors,
        timelineItems,
      });
      return res;
    } finally {
      setIsCloudSyncing(false);
    }
  }, [events, tasks, guests, budgetItems, vendors, timelineItems]);

  return (
    <EventContext.Provider
      value={{
        events,
        tasks,
        timelineItems,
        activities,
        notifications,
        budgetItems,
        guests,
        vendors,
        unreadNotificationsCount,
        selectedEvent,
        editingEvent,
        deletingEvent,
        selectedBudgetItem,
        selectedGuest,
        selectedVendor,
        selectedTask,
        selectedTimelineItem,
        isCreateEventOpen,
        isExpenseModalOpen,
        isGuestModalOpen,
        isVendorModalOpen,
        isTaskModalOpen,
        isTimelineModalOpen,
        isSearchOpen,
        searchQuery,
        hasDraft,
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedEvent,
        setEditingEvent,
        setDeletingEvent,
        setSelectedBudgetItem,
        setSelectedGuest,
        setSelectedVendor,
        setSelectedTask,
        setSelectedTimelineItem,
        setIsCreateEventOpen,
        setIsExpenseModalOpen,
        setIsGuestModalOpen,
        setIsVendorModalOpen,
        setIsTaskModalOpen,
        setIsTimelineModalOpen,
        setIsSearchOpen,
        setSearchQuery,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        saveDraft,
        loadDraft,
        clearDraft,
        getEventById,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        toggleBudgetItemPaid,
        addGuest,
        updateGuest,
        deleteGuest,
        updateGuestRsvp,
        toggleInvitationSent,
        addVendor,
        updateVendor,
        deleteVendor,
        toggleVendorContract,
        updateVendorPaymentStatus,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        toggleTimelineComplete,
        syncWithSupabase,
        pushToSupabase,
        isCloudSyncing,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
