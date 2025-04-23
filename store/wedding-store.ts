import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeddingState, Couple, Venue, Event, CommitteeMember, Vendor, Coordinator, MoodboardItem, MoodboardCategory, WeddingTheme, EventSummary } from '@/types';
import { mockWeddingData } from '@/constants/mockData';

// Helper function to create a storage with error handling
const createAsyncStorage = (name: string) => createJSONStorage(() => ({
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(`${name}-${key}`);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${name} from storage:`, error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      // Convert to string first to check size
      const jsonValue = JSON.stringify(value);
      // Log size for debugging
      console.log(`Storing ${name}-${key}, size: ${jsonValue.length} bytes`);
      
      // Check if the value is too large (AsyncStorage has a limit of ~6MB total)
      if (jsonValue.length > 500000) { // ~500KB limit per key to be safe
        console.warn(`${name}-${key} is very large (${Math.round(jsonValue.length/1024)}KB). This may cause storage issues.`);
        // For very large objects, we might want to skip persisting
        if (jsonValue.length > 1000000) { // 1MB
          console.error(`${name}-${key} exceeds 1MB and will not be persisted to prevent storage errors.`);
          throw new Error('Storage quota would be exceeded');
        }
      }
      
      await AsyncStorage.setItem(`${name}-${key}`, jsonValue);
    } catch (error) {
      console.error(`Error setting ${name} in storage:`, error);
      // Continue without persisting
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(`${name}-${key}`);
    } catch (error) {
      console.error(`Error removing ${name} from storage:`, error);
    }
  },
}));

// Core wedding data store (couple, date, venue, theme)
export const useWeddingCoreStore = create<{
  couple: Couple;
  date: string;
  venue: Venue;
  theme: WeddingTheme;
  updateCouple: (couple: Couple) => void;
  updateVenue: (venue: Venue) => void;
  updateTheme: (theme: WeddingTheme) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      couple: mockWeddingData.couple,
      date: mockWeddingData.date,
      venue: mockWeddingData.venue,
      theme: mockWeddingData.theme,
      updateCouple: (couple: Couple) => {
        console.log('Updating couple data');
        set({ couple });
      },
      updateVenue: (venue: Venue) => set({ venue }),
      updateTheme: (theme: WeddingTheme) => {
        console.log('Updating theme data');
        set({ theme });
      },
      resetToDefault: () => set({
        couple: mockWeddingData.couple,
        date: mockWeddingData.date,
        venue: mockWeddingData.venue,
        theme: mockWeddingData.theme,
      }),
    }),
    {
      name: 'core',
      storage: createAsyncStorage('core'),
      partialize: (state) => ({
        couple: state.couple,
        date: state.date,
        venue: state.venue,
        theme: state.theme,
      }),
    }
  )
);

// Schedule store
export const useWeddingScheduleStore = create<{
  schedule: Event[];
  updateSchedule: (schedule: Event[]) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      schedule: mockWeddingData.schedule,
      updateSchedule: (schedule: Event[]) => {
        console.log('Updating schedule data');
        set({ schedule });
      },
      resetToDefault: () => set({ schedule: mockWeddingData.schedule }),
    }),
    {
      name: 'schedule',
      storage: createAsyncStorage('schedule'),
      partialize: (state) => ({
        schedule: state.schedule,
      }),
    }
  )
);

// Committee store
export const useWeddingCommitteeStore = create<{
  committee: CommitteeMember[];
  updateCommittee: (committee: CommitteeMember[]) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      committee: mockWeddingData.committee,
      updateCommittee: (committee: CommitteeMember[]) => {
        console.log('Updating committee data');
        set({ committee });
      },
      resetToDefault: () => set({ committee: mockWeddingData.committee }),
    }),
    {
      name: 'committee',
      storage: createAsyncStorage('committee'),
      partialize: (state) => ({
        committee: state.committee,
      }),
    }
  )
);

// Vendors store
export const useWeddingVendorsStore = create<{
  vendors: Vendor[];
  updateVendors: (vendors: Vendor[]) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      vendors: mockWeddingData.vendors,
      updateVendors: (vendors: Vendor[]) => {
        console.log('Updating vendors data');
        set({ vendors });
      },
      resetToDefault: () => set({ vendors: mockWeddingData.vendors }),
    }),
    {
      name: 'vendors',
      storage: createAsyncStorage('vendors'),
      partialize: (state) => ({
        vendors: state.vendors,
      }),
    }
  )
);

// Coordinators store
export const useWeddingCoordinatorsStore = create<{
  coordinators: Coordinator[];
  updateCoordinators: (coordinators: Coordinator[]) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      coordinators: mockWeddingData.coordinators,
      updateCoordinators: (coordinators: Coordinator[]) => {
        console.log('Updating coordinators data');
        set({ coordinators });
      },
      resetToDefault: () => set({ coordinators: mockWeddingData.coordinators }),
    }),
    {
      name: 'coordinators',
      storage: createAsyncStorage('coordinators'),
      partialize: (state) => ({
        coordinators: state.coordinators,
      }),
    }
  )
);

// Moodboard store
export const useWeddingMoodboardStore = create<{
  moodboard: MoodboardItem[];
  updateMoodboard: (moodboard: MoodboardItem[]) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      // Cast the mock data to ensure it matches the MoodboardItem[] type
      moodboard: mockWeddingData.moodboard as MoodboardItem[],
      updateMoodboard: (moodboard: MoodboardItem[]) => {
        console.log('Updating moodboard data');
        set({ moodboard });
      },
      resetToDefault: () => set({ 
        moodboard: mockWeddingData.moodboard as MoodboardItem[] 
      }),
    }),
    {
      name: 'moodboard',
      storage: createAsyncStorage('moodboard'),
      partialize: (state) => ({
        moodboard: state.moodboard,
      }),
    }
  )
);

// Event Summary store
export const useWeddingEventSummaryStore = create<{
  eventSummary: EventSummary | undefined;
  updateEventSummary: (eventSummary: EventSummary) => void;
  resetToDefault: () => void;
}>()(
  persist(
    (set) => ({
      eventSummary: mockWeddingData.eventSummary as EventSummary | undefined,
      updateEventSummary: (eventSummary: EventSummary) => {
        console.log('Updating event summary data');
        set({ eventSummary });
      },
      resetToDefault: () => set({ 
        eventSummary: mockWeddingData.eventSummary as EventSummary | undefined 
      }),
    }),
    {
      name: 'eventSummary',
      storage: createAsyncStorage('eventSummary'),
      partialize: (state) => ({
        eventSummary: state.eventSummary,
      }),
    }
  )
);

// Compatibility layer for existing components
// This combines all the separate stores into a single API that matches the original
export const useWeddingStore = (): WeddingState => {
  const core = useWeddingCoreStore();
  const { schedule, updateSchedule, resetToDefault: resetSchedule } = useWeddingScheduleStore();
  const { committee, updateCommittee, resetToDefault: resetCommittee } = useWeddingCommitteeStore();
  const { vendors, updateVendors, resetToDefault: resetVendors } = useWeddingVendorsStore();
  const { coordinators, updateCoordinators, resetToDefault: resetCoordinators } = useWeddingCoordinatorsStore();
  const { moodboard, updateMoodboard, resetToDefault: resetMoodboard } = useWeddingMoodboardStore();
  const { eventSummary, updateEventSummary, resetToDefault: resetEventSummary } = useWeddingEventSummaryStore();

  return {
    couple: core.couple,
    date: core.date,
    venue: core.venue,
    theme: core.theme,
    schedule,
    committee,
    vendors,
    coordinators,
    moodboard,
    eventSummary,
    updateCouple: core.updateCouple,
    updateVenue: core.updateVenue,
    updateTheme: core.updateTheme,
    updateSchedule,
    updateCommittee,
    updateVendors,
    updateCoordinators,
    updateMoodboard,
    updateEventSummary,
    resetToDefault: () => {
      core.resetToDefault();
      resetSchedule();
      resetCommittee();
      resetVendors();
      resetCoordinators();
      resetMoodboard();
      resetEventSummary();
    },
  };
};