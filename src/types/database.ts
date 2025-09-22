// RouteX Database Types
export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: number; // epoch ms
  endDate: number; // epoch ms
  notes?: string;
  coverImage?: string;
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  title: string;
  location?: string;
  startTime: number; // epoch ms
  endTime: number; // epoch ms
  notes?: string;
  reminderId?: string;
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  category: 'food' | 'hotel' | 'transport' | 'entertainment' | 'shopping' | 'misc';
  date: number; // epoch ms
  note?: string;
  receiptPath?: string;
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Memory {
  id: string;
  tripId: string;
  type: 'photo' | 'note';
  content: string; // text content or file path
  title?: string;
  date: number; // epoch ms
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Reminder {
  id: string;
  itemId: string; // itinerary item ID
  notifyTime: number; // epoch ms
  repeatRule?: string;
  isActive: boolean;
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export type ExpenseCategory = Expense['category'];

export interface ExpenseSummary {
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  currency: string;
}

export interface TripStats {
  totalExpenses: number;
  totalItineraryItems: number;
  totalMemories: number;
  daysUntilStart?: number;
  daysRemaining?: number;
  status: 'upcoming' | 'active' | 'completed';
}