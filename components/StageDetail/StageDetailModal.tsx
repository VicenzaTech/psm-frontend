// components/StageDetail/StageDetailModal.tsx
import React from 'react';
import { StageAssignment, DailyStageProduction } from '../../types';
import { Button } from '../Common/Button';

interface StageDetailModalProps {
  assignment: StageAssignment | null;
  dailyProductions: DailyStageProduction[];
  onClose: () => void;
  onStopStage: (assignment: StageAssignment) => void;
  onChangeProduct: (assignment: StageAssignment) => void;
}

export const StageDetailModal: React.FC<StageDetailModalProps> = ({
  assignment,
  dailyProductions,
  onClose,
  onStopStage,
  onChangeProduct
}) => {
  if (!assignment) return null;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalQuantity = dailyProductions.reduce(
    (sum, production) => sum + production.actual_quantity,
    0
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {getStageIcon(assignment.stage)} CHI TIẾT CÔNG ĐOẠN {getStageName(assignment.stage)}
          </h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Thông tin cơ bản:</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dây chuyền:</span>
                    <span className="ml-2 font-medium">{assignment.production_line.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Kế hoạch:</span>
                    <span className="ml-2 font-medium">{assignment.production_plan.plan_code}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Dòng gạch:</span>
                    <span className="ml-2 font-medium">{assignment.brick_type.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className="ml-2 font-medium">
                      {assignment.is_active ? (
                        <span className="text-green-600">✅ Đang chạy</span>
                      ) : (
                        <span className="text-gray-400">Đã dừng</span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Timeline:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(assignment.start_time)} → Hiện tại
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sản lượng:</span>
                    <span className="ml-2 font-medium">{assignment.actual_quantity.toLocaleString()} m²</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Sản lượng:</h4>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Ca</th>
                      <th>Sản lượng (m²)</th>
                      <th>Nguồn</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyProductions.map((production) => (
                      <tr key={production.id}>
                        <td>
                          {new Date(production.production_date).toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          {production.shift}
                        </td>
                        <td>
                          {production.actual_quantity.toLocaleString()}
                        </td>
                        <td>
                          {production.data_source === 'auto_sync' ? 'Auto' : 
                           production.data_source === 'manual_input' ? 'Manual' : 'Adjusted'}
                        </td>
                        <td>
                          <button className="text-blue-600 hover:text-blue-900">
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="table-footer">
                      <td colSpan={2} className="font-medium">
                        Tổng:
                      </td>
                      <td className="font-medium">
                        {totalQuantity.toLocaleString()} m²
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {assignment.is_active && (
            <>
              <Button variant="danger" onClick={() => onStopStage(assignment)}>
                Dừng công đoạn
              </Button>
              <Button variant="secondary" onClick={() => onChangeProduct(assignment)}>
                Chuyển sang dòng khác
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};