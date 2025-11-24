// services/brickTypeService.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from './auth';

const API_URL = 'http://localhost:3000/api/brick-type'; // Update with your API URL

// Helper function to handle errors consistently
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

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const createBrickType = async (brickTypeData: any) => {
    try {
        // Transform data to match backend DTO
        const [size_x, size_y] = brickTypeData.size.toLowerCase().split('x').map(Number);
        const payload = {
            code: uuidv4(),
            name: brickTypeData.name,
            size_x,
            size_y,
            type: brickTypeData.type,
            loaiMai: brickTypeData.loaiMai, // Ensure it's uppercase
            thoiGianChoMaiNguoiHours: brickTypeData.thoiGianChoMaiNguoiHours,
            workshopId: String(brickTypeData.workshopId),
            productionLineId: String(brickTypeData.productionLineId),
            chuKyKhoan: brickTypeData.chuKyKhoan,
            sanLuongRaLoPerDay: brickTypeData.sanLuongRaLoPerDay,
            sanLuongChinhPhamPerDay: brickTypeData.sanLuongChinhPhamPerDay,
            soNgayTruKhoan: brickTypeData.soNgayTruKhoan,
            sanLuongKhoan30Ngay: brickTypeData.sanLuongKhoan30Ngay,
            sanLuongKhoan31Ngay: brickTypeData.sanLuongKhoan31Ngay,
            congKhoanGiamChuKy: brickTypeData.congKhoanGiamChuKy,
            giamKhoanTangChuKy: brickTypeData.giamKhoanTangChuKy
        };
        console.log(payload);
        const response = await api.post(API_URL, payload);
        return response.data.data;
    } catch (error: any) {
        // if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi tạo loại gạch mới';
        //     throw new Error(errorMessage);
        // } else if (error.request) {
        //     // The request was made but no response was received
        //     throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
        // } else {
        //     // Something happened in setting up the request that triggered an Error
        //     throw new Error('Có lỗi xảy ra khi gửi yêu cầu.');
        // }
        handleError(error, 'tạo loại gạch mới');
    }
};

export const getBrickTypes = async () => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (error) {
        // console.error('Error fetching brick types:', error);
        // throw error;
        handleError(error, 'lấy danh sách loại gạch');
    }
};

// Add this to brickTypeService.ts
export const updateBrickType = async (brickTypeData: any) => {
  try {
    const [size_x, size_y] = brickTypeData.size.toLowerCase().split('x').map(Number);
    const code = brickTypeData.name.toLowerCase().replace(/\s/g, '_');
    
    const payload = {
      code: uuidv4(),
            name: brickTypeData.name,
            size_x,
            size_y,
            type: brickTypeData.type,
            loaiMai: brickTypeData.loaiMai, // Ensure it's uppercase
            thoiGianChoMaiNguoiHours: brickTypeData.thoiGianChoMaiNguoiHours,
            workshopId: String(brickTypeData.workshopId),
            productionLineId: String(brickTypeData.productionLineId),
            chuKyKhoan: brickTypeData.chuKyKhoan,
            sanLuongRaLoPerDay: brickTypeData.sanLuongRaLoPerDay,
            sanLuongChinhPhamPerDay: brickTypeData.sanLuongChinhPhamPerDay,
            soNgayTruKhoan: brickTypeData.soNgayTruKhoan,
            sanLuongKhoan30Ngay: brickTypeData.sanLuongKhoan30Ngay,
            sanLuongKhoan31Ngay: brickTypeData.sanLuongKhoan31Ngay,
            congKhoanGiamChuKy: brickTypeData.congKhoanGiamChuKy,
            giamKhoanTangChuKy: brickTypeData.giamKhoanTangChuKy
    };

    const response = await api.patch(`${API_URL}/${brickTypeData.id}`, payload);
    return response.data.data;
  } catch (error: any) {
    // if (error.response) {
    //   const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi cập nhật loại gạch';
    //   throw new Error(errorMessage);
    // } else if (error.request) {
    //   throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    // } else {
    //   throw new Error('Có lỗi xảy ra khi gửi yêu cầu cập nhật.');
    // }
      handleError(error, 'cập nhật loại gạch');
  }
};