// data/mockData.ts
import { BrickType, ProductionLine, ProductionPlan, StageAssignment, DailyStageProduction } from '../types';

export const brickTypes: BrickType[] = [
  {
    id: 5,
    code: "300x600_PORCELAIN",
    name: "300x600mm Porcelain mài bóng",
    size: "300x600mm",
    type: "porcelain",
    loai_mai: "mai_nong"
  },
  {
    id: 8,
    code: "400x800_PORCELAIN",
    name: "400x800mm Porcelain mài bóng",
    size: "400x800mm",
    type: "porcelain",
    loai_mai: "mai_nong"
  },
  {
    id: 12,
    code: "600x600_PORCELAIN",
    name: "600x600mm Porcelain mài bóng",
    size: "600x600mm",
    type: "porcelain",
    loai_mai: "mai_nong"
  }
];

export const productionLines: ProductionLine[] = [
  { id: 1, code: "DC1", name: "Dây chuyền 1", workshop_id: 1 },
  { id: 2, code: "DC2", name: "Dây chuyền 2", workshop_id: 1 }
];

export const productionPlans: ProductionPlan[] = [
  {
    id: 1,
    plan_code: "PLAN-DC1-2024-11-001",
    production_line_id: 1,
    brick_type_id: 5,
    start_date: "2024-11-24",
    end_date: "2024-11-30",
    target_quantity: 10000,
    actual_quantity: 4500,
    completion_percentage: 45,
    status: "in_progress",
    created_by: "giamdoc_sanxuat",
    approved_by: "lanhdao",
    approved_at: "2024-11-23T08:00:00Z",
    production_line: productionLines[0],
    brick_type: brickTypes[0]
  },
  {
    id: 2,
    plan_code: "PLAN-DC2-2024-11-002",
    production_line_id: 2,
    brick_type_id: 12,
    start_date: "2024-11-25",
    end_date: "2024-12-02",
    target_quantity: 15000,
    actual_quantity: 0,
    completion_percentage: 0,
    status: "approved",
    created_by: "giamdoc_sanxuat",
    approved_by: "lanhdao",
    approved_at: "2024-11-24T08:00:00Z",
    production_line: productionLines[1],
    brick_type: brickTypes[2]
  }
];

export const stageAssignments: StageAssignment[] = [
  {
    id: 1,
    production_line_id: 1,
    production_plan_id: 1,
    brick_type_id: 5,
    stage: "ep",
    is_active: true,
    start_time: "2024-11-24T08:00:00Z",
    actual_quantity: 3200,
    production_line: productionLines[0],
    production_plan: productionPlans[0],
    brick_type: brickTypes[0]
  },
  {
    id: 2,
    production_line_id: 1,
    production_plan_id: 1,
    brick_type_id: 5,
    stage: "nung",
    is_active: true,
    start_time: "2024-11-24T10:00:00Z",
    actual_quantity: 3000,
    production_line: productionLines[0],
    production_plan: productionPlans[0],
    brick_type: brickTypes[0]
  },
  {
    id: 3,
    production_line_id: 1,
    production_plan_id: 0,
    brick_type_id: 8,
    stage: "mai",
    is_active: false,
    start_time: "2024-11-24T08:00:00Z",
    end_time: "2024-11-24T16:00:00Z",
    actual_quantity: 1200,
    production_line: productionLines[0],
    production_plan: productionPlans[0],
    brick_type: brickTypes[1]
  },
  {
    id: 4,
    production_line_id: 1,
    production_plan_id: 1,
    brick_type_id: 5,
    stage: "mai",
    is_active: true,
    start_time: "2024-11-25T08:00:00Z",
    actual_quantity: 800,
    production_line: productionLines[0],
    production_plan: productionPlans[0],
    brick_type: brickTypes[0]
  },
  {
    id: 5,
    production_line_id: 1,
    production_plan_id: 1,
    brick_type_id: 5,
    stage: "dong_hop",
    is_active: true,
    start_time: "2024-11-25T08:00:00Z",
    actual_quantity: 700,
    production_line: productionLines[0],
    production_plan: productionPlans[0],
    brick_type: brickTypes[0]
  }
];

export const dailyStageProductions: DailyStageProduction[] = [
  {
    id: 1,
    stage_assignment_id: 4,
    production_date: "2024-11-25",
    shift: "A",
    actual_quantity: 400,
    waste_quantity: 10,
    data_source: "auto_sync",
    recorded_by: "system"
  },
  {
    id: 2,
    stage_assignment_id: 4,
    production_date: "2024-11-25",
    shift: "B",
    actual_quantity: 400,
    waste_quantity: 15,
    data_source: "auto_sync",
    recorded_by: "system"
  }
];