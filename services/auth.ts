import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginCredentials, LoginResponse, User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5556/api';

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
        const response: AxiosResponse<LoginResponse> = await this.client.post(
            '/auth/login',
            credentials
        );
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
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

    async refreshToken(refreshToken: string): Promise<LoginResponse> {
        const response: AxiosResponse<LoginResponse> = await this.client.post(
            '/auth/refresh',
            { refresh_token: refreshToken }
        );
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        return response.data;
    }

    async getCurrentUser(): Promise<User> {
        const response: AxiosResponse<User> = await this.client.get('/auth/me');
        return response.data;
    }
}

export const authService = new AuthService();