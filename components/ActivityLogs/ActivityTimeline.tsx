// components/ActivityLogs/ActivityTimeline.tsx
import React from 'react';
import { ActivityLog } from '../../types';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  onViewDetails: (activity: ActivityLog) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
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
      case 'configure': return '#8e44ad';
      case 'switch': return '#e67e22';
      case 'update_parameters': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp);
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: date,
        activities: []
      };
    }
    
    groups[dateKey].activities.push(activity);
    return groups;
  }, {} as Record<string, { date: Date; activities: ActivityLog[] }>);

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="activity-timeline">
      {sortedDates.map(dateKey => {
        const group = groupedActivities[dateKey];
        return (
          <div key={dateKey} className="timeline-day">
            <div className="timeline-date-header">
              <h3>{formatDate(group.date)}</h3>
              <span className="timeline-date-count">
                {group.activities.length} hoạt động
              </span>
            </div>
            
            <div className="timeline-activities">
              {group.activities.map((activity, index) => (
                <div key={activity.id} className="timeline-item">
                  <div className="timeline-item-left">
                    <div className="timeline-time">
                      {formatTime(activity.timestamp)}
                    </div>
                    <div 
                      className="timeline-icon"
                      style={{ 
                        background: getActionColor(activity.action_type),
                        color: 'white'
                      }}
                    >
                      {getActionIcon(activity.action_type)}
                    </div>
                    {index < group.activities.length - 1 && (
                      <div className="timeline-connector"></div>
                    )}
                  </div>
                  
                  <div className="timeline-item-right">
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-action" style={{ 
                          color: getActionColor(activity.action_type)
                        }}>
                          {activity.action}
                        </span>
                        <span className="timeline-entity">
                          {activity.entity_name}
                        </span>
                        <span className="timeline-user">
                          {activity.user_full_name}
                        </span>
                      </div>
                      
                      <div className="timeline-description">
                        {activity.description}
                      </div>
                      
                      {activity.metadata && activity.entity_type === 'production_plan' && (
                        <div className="timeline-metadata">
                          <div className="timeline-plan-info">
                            {activity.metadata?.production_plan_code && (
                              <span className="timeline-badge plan">
                                {activity.metadata.production_plan_code}
                              </span>
                            )}
                            {activity.metadata?.target_quantity && (
                              <span className="timeline-badge quantity">
                                {activity.metadata.target_quantity.toLocaleString()} m²
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {activity.metadata && activity.entity_type === 'stage_assignment' && (
                        <div className="timeline-metadata">
                          <div className="timeline-stage-info">
                            {activity.metadata?.stage_name && (
                              <span className="timeline-badge stage">
                                {activity.metadata.stage_name}
                              </span>
                            )}
                            {activity.metadata?.production_line_name && (
                              <span className="timeline-badge line">
                                {activity.metadata.production_line_name}
                              </span>
                            )}
                            {activity.metadata?.brick_type_name && (
                              <span className="timeline-badge brick">
                                {activity.metadata.brick_type_name}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="timeline-actions">
                        <button
                          className="btn-link"
                          onClick={() => onViewDetails(activity)}
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};