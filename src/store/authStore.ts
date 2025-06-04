import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// In a real app, these would be API calls
const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email !== 'demo@example.com' || password !== 'password') {
    throw new Error('Invalid email or password');
  }
  
  return {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366F1&color=fff',
    },
    token: 'mock_jwt_token',
  };
};

const mockRegister = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'demo@example.com') {
    throw new Error('Email already in use');
  }
  
  return {
    user: {
      id: '2',
      name,
      email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff`,
    },
    token: 'mock_jwt_token',
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // In production, this would be a real API call
          // const response = await fetch('/api/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, password }),
          // });
          // 
          // if (!response.ok) {
          //   const errorData = await response.json();
          //   throw new Error(errorData.message || 'Login failed');
          // }
          // 
          // const data = await response.json();
          
          // For development, use mock data
          const data = await mockLogin(email, password);
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store token in localStorage for middleware
          localStorage.setItem('auth_token', data.token);
          
          // Set cookie for server-side auth checks
          document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // In production, this would be a real API call
          // const response = await fetch('/api/auth/register', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ name, email, password }),
          // });
          // 
          // if (!response.ok) {
          //   const errorData = await response.json();
          //   throw new Error(errorData.message || 'Registration failed');
          // }
          // 
          // const data = await response.json();
          
          // For development, use mock data
          const data = await mockRegister(name, email, password);
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store token in localStorage for middleware
          localStorage.setItem('auth_token', data.token);
          
          // Set cookie for server-side auth checks
          document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },
      
      logout: () => {
        // Clear auth data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Remove token from localStorage
        localStorage.removeItem('auth_token');
        
        // Clear cookie
        document.cookie = 'auth_token=; path=/; max-age=0';
        
        // In production, this would also call an API endpoint
        // fetch('/api/auth/logout', { method: 'POST' });
      },
      
      clearError: () => {
        set({ error: null });
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
      name: 'auth-storage',
      // Only persist these fields
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