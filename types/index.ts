// types/index.ts
export interface BrickType {
  id: number;
  code: string;
  name: string;
  size: string;
  type: 'porcelain' | 'granite' | 'ceramic' | 'semi_porcelain' | 'kimsa';
  loai_mai: 'mai_nong' | 'mai_nguoi' | 'khong_mai';
}

export interface ProductionLine {
  id: number;
  code: string;
  name: string;
  workshop_id: number;
}

export interface ProductionPlan {
  id: number;
  planCode: string;
  productionLineId: number;
  brickTypeId: number;
  customerId: number;
  startDate: Date;
  endDate: Date;
  targetQuantity: number;
  actualQuantity: number;
  completionPercentage: number;
  status: PlanStatus;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Include related data for display
  productionLine?: {
    id: number;
    name: string;
  };
  brickType?: {
    id: number;
    name: string;
  };
  customer?: {
    id: number;
    name: string;
  };
}
export interface StageAssignment {
  id: number;
  production_line_id: number;
  production_plan_id: number;
  brick_type_id: number;
  stage: 'ep' | 'nung' | 'mai' | 'dong_hop';
  is_active: boolean;
  start_time: string;
  end_time?: string;
  actual_quantity: number;
  target_quantity?: number;
  production_line: ProductionLine;
  production_plan: ProductionPlan;
  brick_type: BrickType;
}

export interface DailyStageProduction {
  id: number;
  stage_assignment_id: number;
  production_date: string;
  shift: 'A' | 'B' | 'C';
  actual_quantity: number;
  waste_quantity: number;
  data_source: 'auto_sync' | 'manual_input' | 'adjusted';
  recorded_by: string;
  notes?: string;
}


export interface BrickType {
  id: number;
  name: string;
  size: string;
  size_x: number;
  size_y: number;
  type: 'porcelain' | 'granite' | 'ceramic' | 'semi_porcelain' | 'kimsa';
  workshopId: number;
  productionLineId: number;
  workshopName: string;
  productionLineName: string;
  chuKyKhoan: number;
  sanLuongRaLoPerDay: number;
  sanLuongChinhPhamPerDay: number;
  soNgayTruKhoan: number;
  sanLuongKhoan30Ngay: number;
  sanLuongKhoan31Ngay: number;
  congKhoanGiamChuKy: number;
  giamKhoanTangChuKy: number;
  loaiMai: 'mai_nong' | 'mai_nguoi' | 'khong_mai';
  thoiGianChoMaiNguoiHours: number;
  tyLeA1Khoan: number;
  tyLeA2Khoan: number;
  tyLeCatLoKhoan: number;
  tyLePhe1Khoan: number;
  tyLePhe2Khoan: number;
  tyLePheHuyKhoan: number;
  donGiaThuongA1: number;
  donGiaThuongA2: number;
  donGiaThuongCatLo: number;
  donGiaPhatSanLuong: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: number;
  username: string;
  user_full_name: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'start' | 'stop' | 'approve' | 'reject' | 'LOGIN_SUCCESS' | 'logout' | 'view' | 'export' | 'import' | 'assign' | 'unassign' | 'update_parameters' | 'switch' | 'configure';
  entityType: 'production_plan' | 'stage_assignment' | 'brick_type' | 'quality_record' | 'user' | 'workshop' | 'production_line' | 'device' | 'report' | 'settings';
  entityId?: number;
  entityName?: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
  createdAt: Date;
  workshop_id?: number;
  production_line_id?: number;
}

export interface ActivityFilter {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  action_type?: string;
  entity_type?: string;
  workshop_id?: number;
  production_line_id?: number;
  search?: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  permissions: string[];  // Add this line
  workshop_id?: number;
  production_line_id?: number;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  status: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: {
      email: string;
      username: string;
      id: number;
      roles: string[];
      permissions: string[];
    };
    sessionId: string;
  };
}

// types/index.ts
export enum PlanStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

