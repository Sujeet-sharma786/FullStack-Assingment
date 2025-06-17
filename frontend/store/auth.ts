import { create } from 'zustand';

type User = { name: string; email: string } | null;

interface AuthState {
  user: User;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  login: user => set({ user }),
  logout: () => set({ user: null }),
}));