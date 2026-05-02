import { create } from 'zustand';
import type { AdSpace, AdSpaceFilters } from '../types';
import { getAdSpaces } from '../api/adspaces';

interface AdSpacesState {
  adspaces: AdSpace[];
  filters: AdSpaceFilters;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: AdSpaceFilters) => void;
  fetchAdSpaces: (filters?: AdSpaceFilters) => Promise<void>;
  clearError: () => void;
}

export const useAdSpacesStore = create<AdSpacesState>((set, get) => ({
  adspaces: [],
  filters: {},
  isLoading: false,
  error: null,

  setFilters: (filters: AdSpaceFilters) => {
    set({ filters });
  },

  fetchAdSpaces: async (filters?: AdSpaceFilters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = filters ?? get().filters;
      const data = await getAdSpaces(currentFilters);
      set({ adspaces: data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch ad spaces',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
