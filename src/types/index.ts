export type EventType = 'wedding' | 'birthday' | 'anniversary' | 'corporate' | 'community' | 'other';

export type EventStatus = 'planning' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export type BudgetFlexibility = 'strict' | 'flexible' | 'approximate' | 'fixed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'entertainment'
  | 'transportation'
  | 'gifts'
  | 'miscellaneous';

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  venue?: string;
  description: string;
  guestCount: number;
  adultsCount?: number;
  childrenCount?: number;
  confirmedGuests: number;
  budget: number;
  currency?: string;
  budgetFlexibility?: BudgetFlexibility;
  spent: number;
  theme?: string;
  eventStyle?: string;
  preferredColors?: string[];
  specialRequirements?: string;
  coverImage?: string;
  isDraft?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee?: string;
  category: string;
  createdAt: string;
}

export type GuestRsvpStatus = 'invited' | 'confirmed' | 'declined' | 'pending' | 'accepted' | 'maybe';

export type GuestCategory = 'family' | 'friends' | 'vip' | 'wedding-party' | 'colleagues' | 'general';

export type InvitationStatus = 'not-sent' | 'sent' | 'delivered' | 'opened';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: GuestRsvpStatus;
  category?: GuestCategory | string;
  familyGroup?: string;
  invitationStatus?: InvitationStatus;
  invitationSentDate?: string;
  rsvpResponseDate?: string;
  tableAssignment?: string;
  dietaryRestrictions?: string;
  specialRequirements?: string;
  plusOne: boolean;
  plusOneName?: string;
  notes?: string;
  createdAt?: string;
}

export interface BudgetItem {
  id: string;
  eventId: string;
  category: BudgetCategory;
  description: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  vendor?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
}

export type VendorCategory =
  | 'venue'
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'videography'
  | 'music'
  | 'makeup'
  | 'transportation'
  | 'invitations'
  | 'other';

export type VendorBookingStatus =
  | 'inquired'
  | 'quoting'
  | 'contracted'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type VendorPaymentStatus =
  | 'paid'
  | 'partial'
  | 'pending'
  | 'unpaid';

export interface Vendor {
  id: string;
  eventId: string;
  name: string; // Business name
  category: VendorCategory | string;
  contactPerson: string;
  phone: string;
  email: string;
  quotedPrice: number;
  finalPrice: number; // Final agreed price
  bookingDate?: string;
  bookingStatus: VendorBookingStatus;
  paymentStatus: VendorPaymentStatus;
  paidAmount?: number;
  contractSigned: boolean;
  notes?: string;
  website?: string;
  rating?: number;
  amount?: number; // Backwards compatibility for amount
  createdAt?: string;
}

export type TimelineCategory =
  | 'preparation'
  | 'booking'
  | 'invitation'
  | 'payment'
  | 'decoration'
  | 'day-of'
  | 'general';

export interface TimelineItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  description: string;
  responsible?: string;
  category?: TimelineCategory | string;
  date?: string;
  location?: string;
  completed: boolean;
  createdAt?: string;
}

export interface Activity {
  id: string;
  eventId?: string;
  eventName?: string;
  type: 'vendor' | 'rsvp' | 'task' | 'budget' | 'timeline';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'alert' | 'update' | 'milestone';
  eventId?: string;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalGuests: number;
  totalBudget: number;
  totalSpent: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}
