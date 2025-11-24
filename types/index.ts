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