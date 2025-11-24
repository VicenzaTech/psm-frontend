// components/StageManagement/StageManagement.tsx
import React from 'react';
import { StageAssignment, ProductionLine } from '../../types';
import { StageRow } from './StageRow';
import { Button } from '../Common/Button';

interface StageManagementProps {
  productionLine: ProductionLine;
  stageAssignments: StageAssignment[];
  onStopStage: (assignment: StageAssignment) => void;
  onViewDetails: (assignment: StageAssignment) => void;
  onAddNewStage: () => void;
}

export const StageManagement: React.FC<StageManagementProps> = ({
  productionLine,
  stageAssignments,
  onStopStage,
  onViewDetails,
  onAddNewStage
}) => {
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group assignments by stage
  const stages = ['ep', 'nung', 'mai', 'dong_hop'];
  const assignmentsByStage = stages.map(stage => {
    const assignment = stageAssignments.find(a => a.stage === stage && a.is_active);
    return { stage, assignment };
  });

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          QUẢN LÝ CÔNG ĐOẠN - {productionLine.name}
        </h2>
        <div className="text-sm text-gray-500">
          📅 {formatDate()}
        </div>
      </div>
      
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Công đoạn</h3>
          
          <div className="space-y-4">
            {assignmentsByStage.map(({ stage, assignment }) => (
              <div key={stage}>
                {assignment ? (
                  <StageRow
                    assignment={assignment}
                    onStopStage={onStopStage}
                    onViewDetails={onViewDetails}
                  />
                ) : (
                  <div className="stage-row">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="stage-icon opacity-30">
                          {stage === 'ep' ? '🔧' : 
                           stage === 'nung' ? '🔥' : 
                           stage === 'mai' ? '✨' : '📦'}
                        </span>
                        <div className="stage-info">
                          <div className="stage-name">
                            {stage === 'ep' ? 'ÉP' : 
                             stage === 'nung' ? 'NUNG' : 
                             stage === 'mai' ? 'MÀI' : 'ĐÓNG HỘP'}
                          </div>
                          <div className="stage-status">
                            <span className="text-gray-400">Not Active</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => onAddNewStage()}>
                        Thêm công đoạn
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};