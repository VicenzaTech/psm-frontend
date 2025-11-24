import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials } from '../types';
import { authService } from '../services/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    refresh: () => Promise<void>;
    clearError: () => void;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
        const response = await authService.login(credentials);
        const { data } = response;
        const userData = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.roles[0] as 'admin' | 'manager' | 'operator' | 'viewer',
            permissions: data.user.permissions,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        set({
            user: userData,
            token: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
        });
    } catch (error: any) {
        set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
        });
        throw error;
    }
},
            logout: () => {
                authService.logout().catch(console.error);
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            refresh: async () => {
                const { refreshToken } = get();
                if (!refreshToken) return;

                try {
                    const { token, refresh_token } = await authService.refreshToken(refreshToken);
                    set({
                        token,
                        refreshToken: refresh_token,
                    });
                } catch (error) {
                    get().logout();
                    throw error;
                }
            },

            clearError: () => set({ error: null }),

            initializeAuth: async () => {
                const { token, user } = get();
                if (token && user) {
                    try {
                        // If we have both token and user in localStorage, consider the user authenticated
                        set({
                            isAuthenticated: true,
                            isLoading: false,
                            user: user,
                            token: token
                        });
                    } catch (error) {
                        console.error('Failed to initialize auth:', error);
                        set({
                            isAuthenticated: false,
                            isLoading: false,
                            user: null,
                            token: null,
                            refreshToken: null
                        });
                    }
                } else {
                    set({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                        token: null,
                        refreshToken: null
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist these fields to prevent issues
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
            }),
        }
    )
);