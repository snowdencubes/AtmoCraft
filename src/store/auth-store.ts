import { create } from 'zustand';
import { User, Role } from '@/lib/types';
import { mockUsers } from '@/lib/mock';

interface AuthState {
  currentUser: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  setAuth: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    currentUser: null,
    role: null,
    isAuthenticated: false,
    login: async (email) => {
      // Logic handled in service now
      return false; // To be updated later if needed or we can just remove login from here and handle in components? Wait, let's keep a simplified login setter.
    },
    logout: () => set({ currentUser: null, role: null, isAuthenticated: false }),
    switchRole: (role) => {
      // Deprecated, but we can keep it empty or remove. Let's just keep the state.
    },
    // We actually should probably just expose setAuth
    setAuth: (user: User | null) => set({ 
      currentUser: user, 
      role: user?.role || null, 
      isAuthenticated: !!user 
    })
  })
);
