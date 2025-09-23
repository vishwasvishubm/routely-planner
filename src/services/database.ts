import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import type { Trip, ItineraryItem, Expense, Memory, Reminder } from '@/types/database';

// Configure localforage instances
const tripsDB = localforage.createInstance({ name: 'routex-trips' });
const itineraryDB = localforage.createInstance({ name: 'routex-itinerary' });
const expensesDB = localforage.createInstance({ name: 'routex-expenses' });
const memoriesDB = localforage.createInstance({ name: 'routex-memories' });
const remindersDB = localforage.createInstance({ name: 'routex-reminders' });

// Generic CRUD operations
class DatabaseService<T extends { id: string; synced: boolean; createdAt: number; updatedAt: number }> {
  constructor(private store: LocalForage) {}

  async create(data: Omit<T, 'id' | 'synced' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = Date.now();
    const item = {
      ...data,
      id: uuidv4(),
      synced: false,
      createdAt: now,
      updatedAt: now,
    } as T;

    await this.store.setItem(item.id, item);
    return item;
  }

  async getById(id: string): Promise<T | null> {
    return await this.store.getItem(id);
  }

  async getAll(): Promise<T[]> {
    const items: T[] = [];
    await this.store.iterate((value: T) => {
      items.push(value);
    });
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }

  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      synced: false,
    };

    await this.store.setItem(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.store.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }

  async getByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
    const items: T[] = [];
    await this.store.iterate((item: T) => {
      if (item[field] === value) {
        items.push(item);
      }
    });
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }
}

// Service instances
export const tripsService = new DatabaseService<Trip>(tripsDB);
export const itineraryService = new DatabaseService<ItineraryItem>(itineraryDB);
export const expensesService = new DatabaseService<Expense>(expensesDB);
export const memoriesService = new DatabaseService<Memory>(memoriesDB);
export const remindersService = new DatabaseService<Reminder>(remindersDB);

// Trip-specific methods
export const tripOperations = {
  async getTripWithDetails(tripId: string) {
    const [trip, itinerary, expenses, memories] = await Promise.all([
      tripsService.getById(tripId),
      itineraryService.getByField('tripId', tripId),
      expensesService.getByField('tripId', tripId),
      memoriesService.getByField('tripId', tripId),
    ]);

    return {
      trip,
      itinerary,
      expenses,
      memories,
    };
  },

  async deleteTripAndRelated(tripId: string) {
    // Get all related data
    const [itinerary, expenses, memories] = await Promise.all([
      itineraryService.getByField('tripId', tripId),
      expensesService.getByField('tripId', tripId),
      memoriesService.getByField('tripId', tripId),
    ]);

    // Delete all related reminders
    const reminders = await Promise.all(
      itinerary.map(item => remindersService.getByField('itemId', item.id))
    );
    const allReminders = reminders.flat();

    // Delete everything
    await Promise.all([
      tripsService.delete(tripId),
      ...itinerary.map(item => itineraryService.delete(item.id)),
      ...expenses.map(expense => expensesService.delete(expense.id)),
      ...memories.map(memory => memoriesService.delete(memory.id)),
      ...allReminders.map(reminder => remindersService.delete(reminder.id)),
    ]);

    return true;
  },

  async getExpenseSummary(tripId: string) {
    const expenses = await expensesService.getByField('tripId', tripId);
    
    const summary = {
      total: 0,
      byCategory: {
        food: 0,
        hotel: 0,
        transport: 0,
        entertainment: 0,
        shopping: 0,
        misc: 0,
      },
      currency: expenses[0]?.currency || 'USD',
    };

    expenses.forEach(expense => {
      summary.total += expense.amount;
      summary.byCategory[expense.category] += expense.amount;
    });

    return summary;
  },

  async getTripStats(trip: Trip) {
    const now = Date.now();
    const [itinerary, expenses, memories] = await Promise.all([
      itineraryService.getByField('tripId', trip.id),
      expensesService.getByField('tripId', trip.id),
      memoriesService.getByField('tripId', trip.id),
    ]);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    let status: 'upcoming' | 'active' | 'completed';
    let daysUntilStart: number | undefined;
    let daysRemaining: number | undefined;

    if (now < trip.startDate) {
      status = 'upcoming';
      daysUntilStart = Math.ceil((trip.startDate - now) / (1000 * 60 * 60 * 24));
    } else if (now <= trip.endDate) {
      status = 'active';
      daysRemaining = Math.ceil((trip.endDate - now) / (1000 * 60 * 60 * 24));
    } else {
      status = 'completed';
    }

    return {
      totalExpenses,
      totalItineraryItems: itinerary.length,
      totalMemories: memories.length,
      daysUntilStart,
      daysRemaining,
      status,
    };
  },
};

// Initialize demo data
export const initializeDemoData = async () => {
  const existingTrips = await tripsService.getAll();
  if (existingTrips.length > 0) return; // Don't create demo data if trips exist

  const now = Date.now();
  const demoTrip = await tripsService.create({
    title: 'Kerala Backwaters Adventure',
    destination: 'Alleppey & Kumarakom, Kerala',
    startDate: now + (7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: now + (14 * 24 * 60 * 60 * 1000), // 14 days from now
    notes: 'Explore the serene backwaters, traditional houseboats, and lush green landscapes of Kerala. Experience local culture, spice plantations, and Ayurvedic treatments.',
  });

  // Add some demo itinerary items
  await Promise.all([
    itineraryService.create({
      tripId: demoTrip.id,
      title: 'Arrive in Kochi',
      location: 'Cochin International Airport',
      startTime: now + (7 * 24 * 60 * 60 * 1000),
      endTime: now + (7 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000),
      notes: 'Land in Kochi, transfer to hotel and explore Fort Kochi in the evening',
    }),
    itineraryService.create({
      tripId: demoTrip.id,
      title: 'Houseboat Experience',
      location: 'Alleppey Backwaters',
      startTime: now + (8 * 24 * 60 * 60 * 1000),
      endTime: now + (8 * 24 * 60 * 60 * 1000) + (6 * 60 * 60 * 1000),
      notes: 'Full day houseboat cruise through the backwaters with traditional Kerala meals',
    }),
    itineraryService.create({
      tripId: demoTrip.id,
      title: 'Spice Plantation Tour',
      location: 'Thekkady, Periyar',
      startTime: now + (10 * 24 * 60 * 60 * 1000),
      endTime: now + (10 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000),
      notes: 'Guided tour of cardamom, pepper, and cinnamon plantations',
    }),
  ]);

  // Add some demo expenses
  await Promise.all([
    expensesService.create({
      tripId: demoTrip.id,
      amount: 15000,
      currency: 'INR',
      category: 'hotel',
      date: now,
      note: 'Houseboat booking for 2 nights in Alleppey',
    }),
    expensesService.create({
      tripId: demoTrip.id,
      amount: 2500,
      currency: 'INR',
      category: 'transport',
      date: now,
      note: 'Taxi from Kochi to Alleppey',
    }),
    expensesService.create({
      tripId: demoTrip.id,
      amount: 1200,
      currency: 'INR',
      category: 'food',
      date: now,
      note: 'Traditional Kerala Sadhya lunch',
    }),
  ]);
};