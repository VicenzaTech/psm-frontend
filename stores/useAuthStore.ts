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
                    const { user, token, refresh_token } = await authService.login(credentials);
                    set({
                        user,
                        token,
                        refreshToken: refresh_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    // Lưu token vào localStorage sau khi login thành công
                    if (token) localStorage.setItem('auth_token', token);
                    if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false,
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
                const { token } = get();
                if (!token) return;

                set({ isLoading: true });
                try {
                    const user = await authService.getCurrentUser();
                    set({ user, isAuthenticated: true });
                } catch (error) {
                    get().logout();
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
            }),
        }
    )
);