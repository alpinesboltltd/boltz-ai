import { Profile } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// interface Profile {
//   id: string;
//   uid: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
// }

interface AuthState {
  user: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Profile) => void;
  logout: () => void;
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
        return set({ user });
      },
      logout: () => {
        // Clear auth data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Remove token from localStorage
        localStorage.removeItem("auth_token");

        // Clear cookie
        document.cookie = "auth_token=; path=/; max-age=0";

        // In production, this would also call an API endpoint
        // fetch('/api/auth/logout', { method: 'POST' });
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
      name: "chatboltz-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
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
