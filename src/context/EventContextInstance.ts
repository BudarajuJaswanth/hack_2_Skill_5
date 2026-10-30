import { createContext } from 'react';
import type {
  Event,
  Task,
  Activity,
  AppNotification,
  BudgetItem,
  Guest,
  GuestRsvpStatus,
  Vendor,
  VendorPaymentStatus,
  TimelineItem,
} from '@/types';

export interface EventContextType {
  events: Event[];
  tasks: Task[];
  timelineItems: TimelineItem[];
  activities: Activity[];
  notifications: AppNotification[];
  budgetItems: BudgetItem[];
  guests: Guest[];
  vendors: Vendor[];
  unreadNotificationsCount: number;
  selectedEvent: Event | null;
  editingEvent: Event | null;
  deletingEvent: Event | null;
  selectedBudgetItem: BudgetItem | null;
  selectedGuest: Guest | null;
  selectedVendor: Vendor | null;
  selectedTask: Task | null;
  selectedTimelineItem: TimelineItem | null;
  isCreateEventOpen: boolean;
  isExpenseModalOpen: boolean;
  isGuestModalOpen: boolean;
  isVendorModalOpen: boolean;
  isTaskModalOpen: boolean;
  isTimelineModalOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  hasDraft: boolean;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'spent' | 'confirmedGuests'>) => Event;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setSelectedEvent: (event: Event | null) => void;
  setEditingEvent: (event: Event | null) => void;
  setDeletingEvent: (event: Event | null) => void;
  setSelectedBudgetItem: (item: BudgetItem | null) => void;
  setSelectedGuest: (guest: Guest | null) => void;
  setSelectedVendor: (vendor: Vendor | null) => void;
  setSelectedTask: (task: Task | null) => void;
  setSelectedTimelineItem: (item: TimelineItem | null) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  setIsExpenseModalOpen: (open: boolean) => void;
  setIsGuestModalOpen: (open: boolean) => void;
  setIsVendorModalOpen: (open: boolean) => void;
  setIsTaskModalOpen: (open: boolean) => void;
  setIsTimelineModalOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  saveDraft: (draft: Partial<Event>) => void;
  loadDraft: () => Partial<Event> | null;
  clearDraft: () => void;
  getEventById: (id: string) => Event | undefined;
  // Budget operations
  addBudgetItem: (item: Omit<BudgetItem, 'id' | 'createdAt'>) => BudgetItem;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  toggleBudgetItemPaid: (id: string) => void;
  // Guest operations
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => Guest;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  updateGuestRsvp: (id: string, rsvpStatus: GuestRsvpStatus) => void;
  toggleInvitationSent: (id: string) => void;
  // Vendor operations
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => Vendor;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  toggleVendorContract: (id: string) => void;
  updateVendorPaymentStatus: (id: string, status: VendorPaymentStatus, paidAmount?: number) => void;
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (taskId: string) => void;
  // Timeline operations
  addTimelineItem: (item: Omit<TimelineItem, 'id' | 'createdAt'>) => TimelineItem;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  toggleTimelineComplete: (id: string) => void;
  // Supabase Cloud operations
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
  pushToSupabase: () => Promise<{ success: boolean; message: string }>;
  isCloudSyncing: boolean;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);
