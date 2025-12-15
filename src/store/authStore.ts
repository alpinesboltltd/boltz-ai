import { Profile } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "@/store/toastStore";

interface AuthState {
  user: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Profile) => void;
  setToken: (token: string) => void;
  logout: () => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser(user) {
        set({ user, isAuthenticated: true });
      },
      setToken(token) {
        // Set token in state
        set({ token });

        // Also set in localStorage and cookie for middleware
        if (typeof window !== "undefined") {
          localStorage.setItem("boltz_by_alpinesbolt_auth_token", token);
          // Set cookie for middleware
          document.cookie = `boltz_by_alpinesbolt_auth_token=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }
      },
      logout: () => {
        // Clear auth data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Clear all storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("boltz_by_alpinesbolt_auth_token");
          localStorage.removeItem("boltz-auth-storage");
          localStorage.removeItem("boltz-agent-storage");
          localStorage.removeItem("workspace-storage");
          sessionStorage.clear();

          // Clear cookie
          document.cookie =
            "boltz_by_alpinesbolt_auth_token=; path=/; max-age=0; secure; samesite=strict";
        }

        toast.info("Signed Out", "You have been successfully signed out");
      },

      clearAuth: () => {
        // Silent auth clearing without toast (for expired sessions)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Clear all storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("boltz_by_alpinesbolt_auth_token");
          localStorage.removeItem("boltz-auth-storage");
          localStorage.removeItem("boltz-agent-storage");
          localStorage.removeItem("workspace-storage");
          sessionStorage.clear();

          // Clear cookie
          document.cookie =
            "boltz_by_alpinesbolt_auth_token=; path=/; max-age=0; secure; samesite=strict";
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "boltz-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token with cookie after hydration
        if (state?.token && typeof window !== "undefined") {
          document.cookie = `boltz_by_alpinesbolt_auth_token=${state.token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
        }
      },
    }
  )
);

// Hook to check if user is authenticated on client side
export const useIsAuthenticated = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated;
};

// Hook to get current user
export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  return user;
};

// Hook to check if user has specific role
export const useHasRole = (role: string | string[]) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
};

export const accessToken = () => {
  const token = useAuthStore.getState().token;
  return token || "";
};
