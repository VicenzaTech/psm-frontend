// components/BrickTypes/BrickTypeModal.tsx
import React from 'react';
import { BrickType } from '../../types';
import { BrickTypeForm } from './BrickTypeForm';

interface BrickTypeModalProps {
  brickType: BrickType | null;
  workshops: Array<{ id: number; name: string }>;
  productionLines: Array<{ id: number; name: string; workshop_id: number }>;
  onSave: (brickType: BrickType) => void;
  onClose: () => void;
}

export const BrickTypeModal: React.FC<BrickTypeModalProps> = ({
  brickType,
  workshops,
  productionLines,
  onSave,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal brick-type-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {brickType ? 'Chỉnh sửa dòng gạch' : 'Thêm dòng gạch mới'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <BrickTypeForm
            brickType={brickType}
            workshops={workshops}
            productionLines={productionLines}
            onSave={onSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};