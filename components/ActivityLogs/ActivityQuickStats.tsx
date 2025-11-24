// components/ActivityLogs/ActivityQuickStats.tsx
import React from 'react';
import { ActivityLog } from '../../types';

interface ActivityQuickStatsProps {
  activities: ActivityLog[];
}

export const ActivityQuickStats: React.FC<ActivityQuickStatsProps> = ({ activities }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const todayActivities = activities.filter(a => a.timestamp >= today);
  const weekActivities = activities.filter(a => a.timestamp >= weekAgo);
  const monthActivities = activities.filter(a => a.timestamp >= monthAgo);

  const getProductionPlanStats = () => {
    const planActivities = activities.filter(a => a.entity_type === 'production_plan');
    const created = planActivities.filter(a => a.action_type === 'create').length;
    const updated = planActivities.filter(a => a.action_type === 'update').length;
    const approved = planActivities.filter(a => a.action_type === 'approve').length;
    
    return { created, updated, approved };
  };

  const getStageStats = () => {
    const stageActivities = activities.filter(a => a.entity_type === 'stage_assignment');
    const started = stageActivities.filter(a => a.action_type === 'start').length;
    const stopped = stageActivities.filter(a => a.action_type === 'stop').length;
    const configured = stageActivities.filter(a => a.action_type === 'configure').length;
    
    return { started, stopped, configured };
  };

  const planStats = getProductionPlanStats();
  const stageStats = getStageStats();

  return (
    <div className="activity-quick-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Tổng hoạt động</div>
            <div className="stat-icon blue">📊</div>
          </div>
          <div className="stat-value">{activities.length.toLocaleString()}</div>
          <div className="stat-change">
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
              Hôm nay: +{todayActivities.length}
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Kế hoạch SX</div>
            <div className="stat-icon green">📋</div>
          </div>
          <div className="stat-value">{planStats.created + planStats.updated}</div>
          <div className="stat-details" style={{ fontSize: '12px', color: '#7f8c8d' }}>
            <div>Tạo: {planStats.created}</div>
            <div>Cập nhật: {planStats.updated}</div>
            <div>Duyệt: {planStats.approved}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Công đoạn</div>
            <div className="stat-icon orange">⚙️</div>
          </div>
          <div className="stat-value">{stageStats.started + stageStats.stopped}</div>
          <div className="stat-details" style={{ fontSize: '12px', color: '#7f8c8d' }}>
            <div>Bắt đầu: {stageStats.started}</div>
            <div>Dừng: {stageStats.stopped}</div>
            <div>Cài đặt: {stageStats.configured}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Hoạt động hôm nay</div>
            <div className="stat-icon red">📅</div>
          </div>
          <div className="stat-value">{todayActivities.length}</div>
          <div className="stat-change positive">
            <span>↑</span>
            <span>{((todayActivities.length / Math.max(weekActivities.length / 7, 1)) * 100).toFixed(1)}% TB/ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};