import { create } from "zustand";
import { supportedProviderAPI } from "@/lib/api";

interface SupportedProvider {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SupportedProvidersState {
  providers: SupportedProvider[];
  isLoading: boolean;
  error: string | null;
  fetchProviders: () => Promise<void>;
  createProvider: (name: string) => Promise<void>;
  updateProvider: (id: string, is_active: boolean) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
}

export const useSupportedProvidersStore = create<SupportedProvidersState>(
  (set) => ({
    providers: [],
    isLoading: false,
    error: null,

    fetchProviders: async () => {
      set({ isLoading: true, error: null });
      try {
        const { providers } = await supportedProviderAPI.getAll();
        set({ providers, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch supported providers",
          isLoading: false,
        });
      }
    },

    createProvider: async (name: string) => {
      set({ isLoading: true, error: null });
      try {
        await supportedProviderAPI.create(name);
        await get().fetchProviders();
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create supported provider",
          isLoading: false,
        });
        throw error;
      }
    },

    updateProvider: async (id: string, is_active: boolean) => {
      set({ isLoading: true, error: null });
      try {
        await supportedProviderAPI.update(id, is_active);
        await get().fetchProviders();
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to update supported provider",
          isLoading: false,
        });
        throw error;
      }
    },

    deleteProvider: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await supportedProviderAPI.delete(id);
        await get().fetchProviders();
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to delete supported provider",
          isLoading: false,
        });
        throw error;
      }
    },
  })
);

// Helper to get state outside of components if needed
function get() {
  return useSupportedProvidersStore.getState();
}
