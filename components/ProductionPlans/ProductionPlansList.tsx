// components/ProductionPlans/ProductionPlansList.tsx
import React from 'react';
import { ProductionPlan } from '../../types';
import { ProductionPlanCard } from './ProductionPlanCard';
import { Button } from '../Common/Button';

interface ProductionPlansListProps {
  plans: ProductionPlan[];
  onViewDetails: (plan: ProductionPlan) => void;
  onStartPlan: (plan: ProductionPlan) => void;
  onEditPlan: (plan: ProductionPlan) => void;
  onGenerateReport: (plan: ProductionPlan) => void;
  onCreateNewPlan: () => void;
}

export const ProductionPlansList: React.FC<ProductionPlansListProps> = ({
  plans,
  onViewDetails,
  onStartPlan,
  onEditPlan,
  onGenerateReport,
  onCreateNewPlan
}) => {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kế hoạch Sản xuất</h2>
        <Button variant="primary" onClick={onCreateNewPlan}>
          + Tạo mới
        </Button>
      </div>
      
      {plans.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Không có kế hoạch sản xuất nào</p>
          <Button variant="primary" onClick={onCreateNewPlan}>
            Tạo kế hoạch mới
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {plans.map((plan) => (
            <ProductionPlanCard
              key={plan.id}
              plan={plan}
              onViewDetails={onViewDetails}
              onStartPlan={onStartPlan}
              onEditPlan={onEditPlan}
              onGenerateReport={onGenerateReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};