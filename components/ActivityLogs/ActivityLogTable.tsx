// components/ActivityLogs/ActivityLogTable.tsx - Cập nhật để hiển thị thông tin chi tiết hơn

import React from 'react';
import { ActivityLog } from '../../types';

interface ActivityLogTableProps {
  activities: ActivityLog[];
  onViewDetails: (activity: ActivityLog) => void;
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
  activities,
  onViewDetails
}) => {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'start': return '▶️';
      case 'stop': return '⏹️';
      case 'approve': return '✅';
      case 'reject': return '❌';
      case 'login': return '🔑';
      case 'logout': return '🚪';
      case 'view': return '👁️';
      case 'export': return '📤';
      case 'import': return '📥';
      case 'assign': return '🔗';
      case 'unassign': return '🔓';
      case 'configure': return '⚙️';
      case 'switch': return '🔄';
      case 'update_parameters': return '🎛️';
      default: return '📝';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create': return '#27ae60';
      case 'update': return '#3498db';
      case 'delete': return '#e74c3c';
      case 'start': return '#27ae60';
      case 'stop': return '#e67e22';
      case 'approve': return '#27ae60';
      case 'reject': return '#e74c3c';
      case 'login': return '#9b59b6';
      case 'logout': return '#95a5a6';
      case 'view': return '#3498db';
      case 'export': return '#f39c12';
      case 'import': return '#f39c12';
      case 'assign': return '#3498db';
      case 'unassign': return '#e67e22';
      case 'configure': return '#8e44ad';
      case 'switch': return '#e67e22';
      case 'update_parameters': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getProductionLineBadge = (lineId: number) => {
    const lines: Record<number, { name: string; color: string }> = {
      1: { name: 'DC1', color: '#3498db' },
      2: { name: 'DC2', color: '#e74c3c' },
      5: { name: 'DC5', color: '#27ae60' },
      6: { name: 'DC6', color: '#f39c12' }
    };
    return lines[lineId] || { name: `DC${lineId}`, color: '#7f8c8d' };
  };

  const renderProductionPlanInfo = (metadata: any) => {
    if (!metadata || !metadata.production_plan_code) return null;
    
    return (
      <div style={{ 
        background: '#e3f2fd', 
        padding: '6px 10px', 
        borderRadius: '4px',
        marginTop: '5px',
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: '500', color: '#1976d2' }}>
          {metadata.production_plan_code}
        </div>
        {metadata.target_quantity && (
          <div style={{ color: '#666' }}>
            Mục tiêu: {metadata.target_quantity.toLocaleString()} m²
          </div>
        )}
      </div>
    );
  };

  const renderStageInfo = (metadata: any) => {
    if (!metadata || !metadata.stage_name) return null;
    
    const lineBadge = getProductionLineBadge(metadata.production_line_id || 0);
    
    return (
      <div style={{ 
        background: '#f3e5f5', 
        padding: '6px 10px', 
        borderRadius: '4px',
        marginTop: '5px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ 
            background: lineBadge.color, 
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: '500'
          }}>
            {lineBadge.name}
          </span>
          <span style={{ fontWeight: '500', color: '#7b1fa2' }}>
            {metadata.stage_name}
          </span>
        </div>
        {metadata.brick_type_name && (
          <div style={{ color: '#666', marginTop: '2px' }}>
            {metadata.brick_type_name}
          </div>
        )}
        {metadata.actual_quantity && (
          <div style={{ color: '#666' }}>
            Sản lượng: {metadata.actual_quantity.toLocaleString()} m²
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="activity-log-table-container">
      <table className="activity-log-table">
        <thead>
          <tr>
            <th style={{ width: '140px' }}>Thời gian</th>
            <th style={{ width: '200px' }}>Người dùng</th>
            <th style={{ width: '120px' }}>Hành động</th>
            <th style={{ width: '150px' }}>Đối tượng</th>
            <th>Mô tả</th>
            <th style={{ width: '120px' }}>Dây chuyền</th>
            <th style={{ width: '100px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="activity-row">
              <td style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>
                  {formatTimestamp(activity.timestamp)}
                </div>
                <div style={{ fontSize: '11px', color: '#7f8c8d' }}>
                  {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {activity.user_full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ 
                      fontWeight: '500', 
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {activity.user_full_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      @{activity.username}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {getActionIcon(activity.action_type)}
                  </span>
                  <div>
                    <div style={{ 
                      color: getActionColor(activity.action_type),
                      fontWeight: '500',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {activity.action}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {getEntityTypeLabel(activity.entity_type)}
                  </div>
                  {activity.entity_name && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#7f8c8d',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {activity.entity_name}
                    </div>
                  )}
                </div>
              </td>
              <td style={{ maxWidth: '350px' }}>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {activity.description}
                </div>
                
                {/* Hiển thị thông tin kế hoạch sản xuất */}
                {activity.entity_type === 'production_plan' && renderProductionPlanInfo(activity.metadata)}
                
                {/* Hiển thị thông tin công đoạn */}
                {activity.entity_type === 'stage_assignment' && renderStageInfo(activity.metadata)}
                
                {/* Hiển thị metadata cho các entity khác */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && 
                 activity.entity_type !== 'production_plan' && 
                 activity.entity_type !== 'stage_assignment' && (
                  <div style={{ marginTop: '5px' }}>
                    <button
                      className="btn-link"
                      onClick={() => onViewDetails(activity)}
                      style={{ 
                        fontSize: '12px', 
                        color: '#3498db',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Xem chi tiết ({Object.keys(activity.metadata).length} trường)
                    </button>
                  </div>
                )}
              </td>
              <td>
                {activity.production_line_id && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {(() => {
                      const lineBadge = getProductionLineBadge(activity.production_line_id);
                      return (
                        <span style={{ 
                          background: lineBadge.color, 
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {lineBadge.name}
                        </span>
                      );
                    })()}
                  </div>
                )}
              </td>
              <td>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => onViewDetails(activity)}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};