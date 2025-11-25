// services/activityService.ts
import axios from 'axios';
import { getToken } from './auth';
import { ActivityLog } from '../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') + '/activity-log';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('Attaching token to request:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = (error: any, action: string) => {
  if (error.response) {
    const errorMessage = error.response.data?.message || `Có lỗi xảy ra khi ${action}`;
    throw new Error(errorMessage);
  } else if (error.request) {
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  } else {
    throw new Error(`Có lỗi xảy ra khi gửi yêu cầu ${action}.`);
  }
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getActivityLogs = async (params?: Record<string, any>): Promise<PaginatedResponse<ActivityLog>> => {
  try {
    const response = await api.get('/', { params });
    console.log('Received activity logs response:', response.data);
    // backend returns { data, meta }
    return response.data || { data: [], meta: { page: 1, limit: params?.limit || 10, total: 0, totalPages: 0 } };
  } catch (error: any) {
    handleError(error, 'lấy lịch sử hoạt động');
    return { data: [], meta: { page: 1, limit: params?.limit || 10, total: 0, totalPages: 0 } };
  }
};

export default { getActivityLogs };
