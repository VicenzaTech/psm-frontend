// components/ProductionPlans/ProductionPlanCard.tsx
import React from 'react';
import { ProductionPlan } from '../../types';
import { Button } from '../Common/Button';
import { ProgressBar } from '../Common/ProgressBar';

interface ProductionPlanCardProps {
  plan: ProductionPlan;
  onViewDetails: (plan: ProductionPlan) => void;
  onStartPlan: (plan: ProductionPlan) => void;
  onEditPlan: (plan: ProductionPlan) => void;
  onGenerateReport: (plan: ProductionPlan) => void;
}

export const ProductionPlanCard: React.FC<ProductionPlanCardProps> = ({
  plan,
  onViewDetails,
  onStartPlan,
  onEditPlan,
  onGenerateReport
}) => {
  const getStatusBadge = () => {
    switch (plan.status) {
      case 'draft':
        return <span className="badge badge-gray">Draft</span>;
      case 'approved':
        return <span className="badge badge-yellow">Approved</span>;
      case 'in_progress':
        return <span className="badge badge-green">In Progress</span>;
      case 'completed':
        return <span className="badge badge-blue">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-red">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900">{plan.plan_code}</h3>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {plan.production_line.name} | {plan.brick_type.name}
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {plan.start_date} - {plan.end_date}
        </div>
        
        <div className="mb-4">
          <div className="progress-label">
            <span className="progress-label-text">Target: {plan.target_quantity.toLocaleString()} m²</span>
            <span className="progress-label-text">Actual: {plan.actual_quantity.toLocaleString()} m² ({plan.completion_percentage}%)</span>
          </div>
          <ProgressBar value={plan.completion_percentage} color="blue" />
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onViewDetails(plan)}>
            Xem chi tiết
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onGenerateReport(plan)}>
            Báo cáo
          </Button>
          {plan.status === 'approved' && (
            <Button variant="primary" size="sm" onClick={() => onStartPlan(plan)}>
              Bắt đầu
            </Button>
          )}
          {(plan.status === 'draft' || plan.status === 'approved') && (
            <Button variant="secondary" size="sm" onClick={() => onEditPlan(plan)}>
              Sửa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};