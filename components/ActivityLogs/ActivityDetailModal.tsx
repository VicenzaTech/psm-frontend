// components/ActivityLogs/ActivityDetailModal.tsx
import React from 'react';
import { ActivityLog } from '../../types';
import { Button } from '../Common/Button';

interface ActivityDetailModalProps {
  activity: ActivityLog | null;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose
}) => {
  if (!activity) return null;

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEntityTypeLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      'production_plan': 'Kế hoạch sản xuất',
      'stage_assignment': 'Công đoạn',
      'brick_type': 'Dòng gạch',
      'quality_record': 'Bản ghi chất lượng',
      'user': 'Người dùng',
      'workshop': 'Phân xưởng',
      'production_line': 'Dây chuyền',
      'device': 'Thiết bị',
      'report': 'Báo cáo',
      'settings': 'Cài đặt'
    };
    return labels[entityType] || entityType;
  };

  return (
    <div className="modal-overlay">
      <div className="modal activity-detail-modal">
        <div className="modal-header">
          <h3 className="modal-title">Chi tiết hoạt động</h3>
          <button className="modal-close" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="activity-detail-content">
            <div className="detail-section">
              <h4>Thông tin chung</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Thời gian:</label>
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
                <div className="detail-item">
                  <label>Người dùng:</label>
                  <span>{activity.user_full_name} (@{activity.username})</span>
                </div>
                <div className="detail-item">
                  <label>Hành động:</label>
                  <span style={{ 
                    color: activity.action_type === 'delete' ? '#e74c3c' : 
                           activity.action_type === 'create' ? '#27ae60' : '#3498db',
                    fontWeight: '500'
                  }}>
                    {activity.action}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Đối tượng:</label>
                  <span>{getEntityTypeLabel(activity.entity_type)}</span>
                </div>
                {activity.entity_name && (
                  <div className="detail-item">
                    <label>Tên đối tượng:</label>
                    <span>{activity.entity_name}</span>
                  </div>
                )}
                <div className="detail-item">
                  <label>IP Address:</label>
                  <span>{activity.ip_address}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Mô tả</h4>
              <p style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                borderRadius: '6px',
                lineHeight: '1.5'
              }}>
                {activity.description}
              </p>
            </div>

            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="detail-section">
                <h4>Metadata</h4>
                <div className="metadata-container">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="metadata-item">
                      <label>{key}:</label>
                      <span>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-section">
              <h4>Thông tin trình duyệt</h4>
              <p style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                borderRadius: '6px',
                fontSize: '13px',
                wordBreak: 'break-all'
              }}>
                {activity.user_agent}
              </p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button className="btn-secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};