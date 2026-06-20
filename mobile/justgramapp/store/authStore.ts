// stores/authStore.ts
import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
    setLoading: (isLoading: boolean) => void;
    setCredentials: (user: User, token: string) => void;
    updateUser: (user: User) => void;
    setError: (error: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setLoading: (isLoading) => set({ isLoading }),
    
    setCredentials: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
    }),

    updateUser: (user) => set({ user }), 
    
    setError: (error) => set({ 
        error, 
        isLoading: false 
    }),
    
    logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
    }),
}));