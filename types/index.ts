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
  plan_code: string;
  production_line_id: number;
  brick_type_id: number;
  start_date: string;
  end_date: string;
  target_quantity: number;
  actual_quantity: number;
  completion_percentage: number;
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  production_line: ProductionLine;
  brick_type: BrickType;
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
  type: 'porcelain' | 'granite' | 'ceramic' | 'semi_porcelain' | 'kimsa';
  workshop_id: number;
  production_line_id: number;
  workshop_name: string;
  production_line_name: string;
  chu_ky_khoan: number;
  san_luong_ra_lo_per_day: number;
  san_luong_chinh_pham_per_day: number;
  so_ngay_tru_khoan: number;
  san_luong_khoan_30_ngay: number;
  san_luong_khoan_31_ngay: number;
  cong_khoan_giam_chu_ky: number;
  giam_khoan_tang_chu_ky: number;
  loai_mai: 'mai_nong' | 'mai_nguoi' | 'khong_mai';
  thoi_gian_cho_mai_nguoi_hours: number;
  ty_le_A1_khoan: number;
  ty_le_A2_khoan: number;
  ty_le_cat_lo_khoan: number;
  ty_le_phe_1_khoan: number;
  ty_le_phe_2_khoan: number;
  ty_le_phe_huy_khoan: number;
  don_gia_thuong_A1: number;
  don_gia_thuong_A2: number;
  don_gia_thuong_cat_lo: number;
  don_gia_phat_san_luong: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: string;
  user_id: number;
  username: string;
  user_full_name: string;
  action: string;
  action_type: 'create' | 'update' | 'delete' | 'start' | 'stop' | 'approve' | 'reject' | 'login' | 'logout' | 'view' | 'export' | 'import' | 'assign' | 'unassign' | 'update_parameters' | 'switch' | 'configure';
  entity_type: 'production_plan' | 'stage_assignment' | 'brick_type' | 'quality_record' | 'user' | 'workshop' | 'production_line' | 'device' | 'report' | 'settings';
  entity_id?: number;
  entity_name?: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
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
  full_name: string;
  email?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  workshop_id?: number;
  production_line_id?: number;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_at: string;
}