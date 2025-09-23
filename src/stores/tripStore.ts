import { create } from 'zustand';
import type { Trip, TripStats } from '@/types/database';
import { tripsService, tripOperations } from '@/services/database';

interface TripStore {
  trips: Trip[];
  currentTrip: Trip | null;
  tripStats: Record<string, TripStats>;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTrips: () => Promise<void>;
  createTrip: (tripData: Omit<Trip, 'id' | 'synced' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
  loadTripStats: (tripId: string) => Promise<void>;
  clearError: () => void;
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  currentTrip: null,
  tripStats: {},
  isLoading: false,
  error: null,

  loadTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Loading trips from database...');
      const trips = await tripsService.getAll();
      console.log('Loaded trips:', trips.length);
      set({ trips, isLoading: false });
      
      // Load stats for all trips
      for (const trip of trips) {
        await get().loadTripStats(trip.id);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load trips', isLoading: false });
    }
  },

  createTrip: async (tripData) => {
    set({ isLoading: true, error: null });
    try {
      const newTrip = await tripsService.create(tripData);
      set(state => ({ 
        trips: [newTrip, ...state.trips], 
        isLoading: false 
      }));
      await get().loadTripStats(newTrip.id);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create trip', isLoading: false });
    }
  },

  updateTrip: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTrip = await tripsService.update(id, updates);
      if (updatedTrip) {
        set(state => ({
          trips: state.trips.map(trip => trip.id === id ? updatedTrip : trip),
          currentTrip: state.currentTrip?.id === id ? updatedTrip : state.currentTrip,
          isLoading: false
        }));
        await get().loadTripStats(id);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update trip', isLoading: false });
    }
  },

  deleteTrip: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tripOperations.deleteTripAndRelated(id);
      set(state => ({
        trips: state.trips.filter(trip => trip.id !== id),
        currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
        tripStats: Object.fromEntries(
          Object.entries(state.tripStats).filter(([key]) => key !== id)
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete trip', isLoading: false });
    }
  },

  setCurrentTrip: (trip) => {
    set({ currentTrip: trip });
  },

  loadTripStats: async (tripId) => {
    try {
      const trip = get().trips.find(t => t.id === tripId);
      if (trip) {
        const stats = await tripOperations.getTripStats(trip);
        set(state => ({
          tripStats: { ...state.tripStats, [tripId]: stats }
        }));
      }
    } catch (error) {
      console.error('Failed to load trip stats:', error);
    }
  },

  clearError: () => set({ error: null }),
}));