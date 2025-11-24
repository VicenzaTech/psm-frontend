import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginCredentials, LoginResponse, User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class AuthService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
        });

        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Nếu lỗi 401 và chưa thử refresh token
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refresh_token');
                        if (refreshToken) {
                            const { token, refresh_token } = await this.refreshToken(refreshToken);
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return this.client(originalRequest);
                        }
                    } catch (error) {
                        // Nếu refresh token thất bại thì đăng xuất
                        await this.logout();
                        window.location.href = '/login';
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>(
            '/auth/login',
            credentials
        );
        const { data } = response.data;
        localStorage.setItem('auth_token', data.tokens.accessToken);
        localStorage.setItem('refresh_token', data.tokens.refreshToken);
        return response.data;
    }

    async logout(): Promise<void> {
        try {
            await this.client.post('/auth/logout');
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
        }
    }

    async refreshToken(refreshToken: string): Promise<{ token: string; refresh_token: string }> {
        const response = await this.client.post<LoginResponse>(
            '/auth/refresh-token',
            { refresh_token: refreshToken }
        );
        const { tokens } = response.data.data;
        localStorage.setItem('auth_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        return { 
            token: tokens.accessToken, 
            refresh_token: tokens.refreshToken 
        };
    }

    async getCurrentUser(): Promise<User> {
        const response: AxiosResponse<User> = await this.client.get('/auth/me');
        return response.data;
    }
}

export const authService = new AuthService();

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token'); // or however you store your token
};