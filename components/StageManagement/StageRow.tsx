// components/StageManagement/StageRow.tsx
import React from 'react';
import { StageAssignment } from '../../types';
import { Button } from '../Common/Button';

interface StageRowProps {
  assignment: StageAssignment;
  onStopStage: (assignment: StageAssignment) => void;
  onViewDetails: (assignment: StageAssignment) => void;
}

export const StageRow: React.FC<StageRowProps> = ({
  assignment,
  onStopStage,
  onViewDetails
}) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'ep':
        return '🔧';
      case 'nung':
        return '🔥';
      case 'mai':
        return '✨';
      case 'dong_hop':
        return '📦';
      default:
        return '❓';
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'ep':
        return 'ÉP';
      case 'nung':
        return 'NUNG';
      case 'mai':
        return 'MÀI';
      case 'dong_hop':
        return 'ĐÓNG HỘP';
      default:
        return stage;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="stage-row">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="stage-icon">{getStageIcon(assignment.stage)}</span>
          <div className="stage-info">
            <div className="stage-name">{getStageName(assignment.stage)}</div>
            <div className="stage-status">
              {assignment.is_active ? (
                <span className="text-green-600">✅ Active</span>
              ) : (
                <span className="text-gray-400">Stopped</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onViewDetails(assignment)}>
            Chi tiết
          </Button>
          {assignment.is_active && (
            <Button variant="danger" size="sm" onClick={() => onStopStage(assignment)}>
              Dừng
            </Button>
          )}
        </div>
      </div>
      
      <div className="stage-grid">
        <div>
          <div className="stage-label">Dòng gạch</div>
          <div className="stage-value">{assignment.brick_type.name}</div>
        </div>
        <div>
          <div className="stage-label">Kế hoạch</div>
          <div className="stage-value">{assignment.production_plan.plan_code}</div>
        </div>
        <div>
          <div className="stage-label">Sản lượng</div>
          <div className="stage-value">{assignment.actual_quantity.toLocaleString()} m²</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        Bắt đầu: {formatDate(assignment.start_time)}
        {assignment.end_time && (
          <> • Kết thúc: {formatDate(assignment.end_time)}</>
        )}
      </div>
    </div>
  );
};