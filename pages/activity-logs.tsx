// pages/activity-logs.tsx - Cập nhật với mock data chi tiết hơn

import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/Common/Button';
import { ActivityLogTable } from '../components/ActivityLogs/ActivityLogTable';
import { ActivityTimeline } from '../components/ActivityLogs/ActivityTimeline';
import { ActivityQuickStats } from '../components/ActivityLogs/ActivityQuickStats';
import { ActivityFilterComponent } from '../components/ActivityLogs/ActivityFilter';
import { ActivityDetailModal } from '../components/ActivityLogs/ActivityDetailModal';
import { ActivityLog, ActivityFilter } from '../types';
import activityService from '@/services/activityService';

// Mock data chi tiết hơn (deterministic) — use a seeded RNG and fixed base date
// const generateDetailedMockActivities = (): ActivityLog[] => {
//   // Seeded PRNG (mulberry32) to ensure identical output on server and client
//   const mulberry32 = (a: number) => {
//     return () => {
//       let t = (a += 0x6d2b79f5);
//       t = Math.imul(t ^ (t >>> 15), t | 1);
//       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
//       return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//     };
//   };
//   const rng = mulberry32(123456789);
//   const baseDate = new Date('2024-11-30T12:00:00.000Z');
//   const users = [
//     { id: 1, username: 'admin', full_name: 'Nguyễn Văn Admin', role: 'admin' },
//     { id: 2, username: 'manager1', full_name: 'Trần Thị Manager', role: 'manager' },
//     { id: 3, username: 'operator1', full_name: 'Lê Văn Operator', role: 'operator' },
//     { id: 4, username: 'supervisor1', full_name: 'Phạm Văn Supervisor', role: 'supervisor' },
//     { id: 5, username: 'qc1', full_name: 'Hoàng Thị QC', role: 'qc' }
//   ];

//   const activities: ActivityLog[] = [];
//   let activityId = 1;

//   // Tạo kế hoạch sản xuất
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 2,
//     username: 'manager1',
//     user_full_name: 'Trần Thị Manager',
//     action: 'Tạo mới',
//     action_type: 'create',
//     entity_type: 'production_plan',
//     entity_id: 101,
//     entity_name: 'PLAN-DC1-2024-11-003',
//     description: 'Tạo kế hoạch sản xuất mới: PLAN-DC1-2024-11-003',
//     metadata: {
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       production_line_id: 1,
//       production_line_name: 'Dây chuyền 1',
//       brick_type_id: 5,
//       brick_type_name: '300x600mm Porcelain mài bóng',
//       start_date: '2024-11-25',
//       end_date: '2024-12-02',
//       target_quantity: 12000,
//       notes: 'Khách hàng VIP cần giao hàng gấp'
//     },
//     ip_address: '192.168.1.105',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-24T09:15:32.456Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Cập nhật kế hoạch
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 2,
//     username: 'manager1',
//     user_full_name: 'Trần Thị Manager',
//     action: 'Cập nhật',
//     action_type: 'update',
//     entity_type: 'production_plan',
//     entity_id: 101,
//     entity_name: 'PLAN-DC1-2024-11-003',
//     description: 'Cập nhật kế hoạch sản xuất: PLAN-DC1-2024-11-003',
//     metadata: {
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       old_values: {
//         target_quantity: 12000,
//         end_date: '2024-12-02'
//       },
//       new_values: {
//         target_quantity: 15000,
//         end_date: '2024-12-05'
//       },
//       reason: 'Yêu cầu từ khách hàng tăng số lượng'
//     },
//     ip_address: '192.168.1.105',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-24T14:22:18.123Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Phê duyệt kế hoạch
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 1,
//     username: 'admin',
//     user_full_name: 'Nguyễn Văn Admin',
//     action: 'Duyệt',
//     action_type: 'approve',
//     entity_type: 'production_plan',
//     entity_id: 101,
//     entity_name: 'PLAN-DC1-2024-11-003',
//     description: 'Duyệt kế hoạch sản xuất: PLAN-DC1-2024-11-003',
//     metadata: {
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       approval_note: 'Đã kiểm tra và xác nhận đủ điều kiện sản xuất',
//       previous_status: 'draft',
//       new_status: 'approved'
//     },
//     ip_address: '192.168.1.100',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-24T16:45:10.789Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Bắt đầu công đoạn Ép
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 3,
//     username: 'operator1',
//     user_full_name: 'Lê Văn Operator',
//     action: 'Bắt đầu',
//     action_type: 'start',
//     entity_type: 'stage_assignment',
//     entity_id: 201,
//     entity_name: 'Ép - DC1',
//     description: 'Bắt đầu công đoạn Ép tại Dây chuyền 1',
//     metadata: {
//       stage: 'ep',
//       stage_name: 'Ép',
//       production_line_id: 1,
//       production_line_name: 'Dây chuyền 1',
//       production_plan_id: 101,
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       brick_type_id: 5,
//       brick_type_name: '300x600mm Porcelain mài bóng',
//       device_id: 101,
//       device_name: 'DC1-EP-SENSOR',
//       target_quantity: 15000,
//       parameters: {
//         pressure: 120,
//         temperature: 180,
//         speed: 45
//       }
//     },
//     ip_address: '192.168.1.110',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-25T07:30:15.345Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Cài đặt công đoạn Mài
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 4,
//     username: 'supervisor1',
//     user_full_name: 'Phạm Văn Supervisor',
//     action: 'Cài đặt',
//     action_type: 'configure',
//     entity_type: 'stage_assignment',
//     entity_id: 204,
//     entity_name: 'Mài - DC1',
//     description: 'Cài đặt công đoạn Mài tại Dây chuyền 1 cho dòng gạch 300x600mm Porcelain',
//     metadata: {
//       stage: 'mai',
//       stage_name: 'Mài',
//       production_line_id: 1,
//       production_line_name: 'Dây chuyền 1',
//       production_plan_id: 101,
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       brick_type_id: 5,
//       brick_type_name: '300x600mm Porcelain mài bóng',
//       grinding_type: 'mai_nong',
//       surface_finish: 'bóng',
//       parameters: {
//         grit_size: 120,
//         pressure: 85,
//         water_flow: 2.5,
//         conveyor_speed: 1.2,
//         rotation_speed: 1450
//       },
//       quality_requirements: {
//         thickness_tolerance: '±0.1mm',
//         flatness: '≤0.3mm/m',
//         surface_roughness: 'Ra ≤ 0.8μm'
//       }
//     },
//     ip_address: '192.168.1.115',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-26T08:15:42.678Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Chuyển đổi công đoạn Mài
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 4,
//     username: 'supervisor1',
//     user_full_name: 'Phạm Văn Supervisor',
//     action: 'Chuyển đổi',
//     action_type: 'switch',
//     entity_type: 'stage_assignment',
//     entity_id: 204,
//     entity_name: 'Mài - DC1',
//     description: 'Chuyển đổi dòng gạch cho công đoạn Mài tại Dây chuyền 1',
//     metadata: {
//       stage: 'mai',
//       stage_name: 'Mài',
//       production_line_id: 1,
//       production_line_name: 'Dây chuyền 1',
//       old_assignment: {
//         production_plan_id: 98,
//         production_plan_code: 'PLAN-DC1-2024-11-002',
//         brick_type_id: 8,
//         brick_type_name: '400x800mm Granite mài bóng',
//         completed_quantity: 8500,
//         end_time: '2024-11-26T07:45:00.000Z'
//       },
//       new_assignment: {
//         production_plan_id: 101,
//         production_plan_code: 'PLAN-DC1-2024-11-003',
//         brick_type_id: 5,
//         brick_type_name: '300x600mm Porcelain mài bóng',
//         start_time: '2024-11-26T08:00:00.000Z',
//         target_quantity: 12000
//       },
//       transition_time: '15 phút',
//       setup_parameters: {
//         grit_size: 120,
//         pressure: 85,
//         water_flow: 2.5,
//         conveyor_speed: 1.2
//       }
//     },
//     ip_address: '192.168.1.115',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-26T07:59:58.234Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Cập nhật thông số công đoạn
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 4,
//     username: 'supervisor1',
//     user_full_name: 'Phạm Văn Supervisor',
//     action: 'Cập nhật thông số',
//     action_type: 'update_parameters',
//     entity_type: 'stage_assignment',
//     entity_id: 205,
//     entity_name: 'Đóng hộp - DC1',
//     description: 'Cập nhật thông số vận hành cho công đoạn Đóng hộp tại Dây chuyền 1',
//     metadata: {
//       stage: 'dong_hop',
//       stage_name: 'Đóng hộp',
//       production_line_id: 1,
//       production_line_name: 'Dây chuyền 1',
//       production_plan_id: 101,
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       old_parameters: {
//         packaging_speed: 45,
//         pieces_per_box: 20,
//         label_type: 'standard'
//       },
//       new_parameters: {
//         packaging_speed: 50,
//         pieces_per_box: 22,
//         label_type: 'premium',
//         qr_code_enabled: true
//       },
//       reason: 'Yêu cầu từ khách hàng về đóng gói đặc biệt'
//     },
//     ip_address: '192.168.1.115',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-26T10:30:22.111Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Dừng công đoạn Nung
//   activities.push({
//     id: `activity-${activityId++}`,
//     user_id: 3,
//     username: 'operator1',
//     user_full_name: 'Lê Văn Operator',
//     action: 'Dừng',
//     action_type: 'stop',
//     entity_type: 'stage_assignment',
//     entity_id: 202,
//     entity_name: 'Nung - DC1',
//     description: 'Dừng công đoạn Nung tại Dây chuyền 1',
//     metadata: {
//       stage: 'nung',
//       stage_name: 'Nung',
//       production_line_id: 1,
//       production_line_name: 'Dây chuyền 1',
//       production_plan_id: 101,
//       production_plan_code: 'PLAN-DC1-2024-11-003',
//       brick_type_id: 5,
//       brick_type_name: '300x600mm Porcelain mài bóng',
//       start_time: '2024-11-25T09:00:00.000Z',
//       end_time: '2024-11-26T16:30:00.000Z',
//       actual_quantity: 11500,
//       target_quantity: 12000,
//       completion_percentage: 95.8,
//       stop_reason: 'Bảo trì định kỳ theo lịch',
//       estimated_downtime: '4 giờ',
//       device_status: {
//         temperature: 1200,
//         pressure: 0.8,
//         status: 'cooling_down'
//       }
//     },
//     ip_address: '192.168.1.110',
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//     timestamp: new Date('2024-11-26T16:30:12.567Z'),
//     workshop_id: 1,
//     production_line_id: 1
//   });

//   // Thêm các hoạt động khác cho demo
//   for (let i = 0; i < 50; i++) {
//     const user = users[Math.floor(rng() * users.length)];
//     const actionTypes = ['create', 'update', 'start', 'stop', 'configure'];
//     const entityTypes = ['production_plan', 'stage_assignment', 'brick_type'];
//     const actionType = actionTypes[Math.floor(rng() * actionTypes.length)];
//     const entityType = entityTypes[Math.floor(rng() * entityTypes.length)];

//     const date = new Date(baseDate);
//     date.setDate(date.getDate() - Math.floor(rng() * 7));
//     date.setHours(date.getHours() - Math.floor(rng() * 24));

//     activities.push({
//       id: `activity-${activityId++}`,
//       user_id: user.id,
//       username: user.username,
//       user_full_name: user.full_name,
//       action: actionType,
//       action_type: actionType as any,
//       entity_type: entityType as any,
//       entity_id: Math.floor(rng() * 100) + 1,
//       entity_name: `${entityType}-${Math.floor(rng() * 10) + 1}`,
//       description: `Thực hiện hành động ${actionType} trên ${entityType}`,
//       metadata: {
//         test_field: 'test_value',
//         timestamp: date.toISOString()
//       },
//       ip_address: `192.168.1.${Math.floor(rng() * 255)}`,
//       user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//       timestamp: date,
//       workshop_id: rng() > 0.5 ? 1 : 2,
//       production_line_id: Math.floor(rng() * 6) + 1
//     });
//   }

//   return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
// };

// Mock users, workshops, production lines
const mockUsers = [
  { id: 1, username: 'admin', full_name: 'Nguyễn Văn Admin' },
  { id: 2, username: 'manager1', full_name: 'Trần Thị Manager' },
  { id: 3, username: 'operator1', full_name: 'Lê Văn Operator' },
  { id: 4, username: 'supervisor1', full_name: 'Phạm Văn Supervisor' },
  { id: 5, username: 'qc1', full_name: 'Hoàng Thị QC' }
];

const mockWorkshops = [
  { id: 1, name: 'Phân xưởng 1' },
  { id: 2, name: 'Phân xưởng 2' }
];

const mockProductionLines = [
  { id: 1, name: 'Dây chuyền 1', workshop_id: 1 },
  { id: 2, name: 'Dây chuyền 2', workshop_id: 1 },
  { id: 5, name: 'Dây chuyền 5', workshop_id: 2 },
  { id: 6, name: 'Dây chuyền 6', workshop_id: 2 }
];

export default function ActivityLogsPage() {
  // const [activities] = useState<ActivityLog[]>(generateDetailedMockActivities());
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<ActivityFilter>({});
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const itemsPerPage = 20;
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverMeta, setServerMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page: currentPage,
          limit: itemsPerPage,
        };
        if (filter.action_type) params.actionType = filter.action_type;
        if (filter.entity_type) params.entityType = filter.entity_type;
        if (filter.user_id) params.userId = filter.user_id;

        setLoadError(null);
        const res = await activityService.getActivityLogs(params);
        setActivities(res.data);
        setServerMeta(res.meta);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setLoadError((error as any)?.message || 'Lỗi khi lấy dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentPage, JSON.stringify(filter)]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [JSON.stringify(filter)]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (filter.start_date && new Date(activity.timestamp) < new Date(filter.start_date)) {
        return false;
      }
      if (filter.end_date && new Date(activity.timestamp) > new Date(filter.end_date + 'T23:59:59')) {
        return false;
      }
      if (filter.user_id && activity.user_id !== filter.user_id) {
        return false;
      }
      if (filter.action_type && activity.actionType !== filter.action_type) {
        return false;
      }
      if (filter.entity_type && activity.entityType !== filter.entity_type) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          activity.description.toLowerCase().includes(searchLower) ||
          activity.user_full_name.toLowerCase().includes(searchLower) ||
          activity.username.toLowerCase().includes(searchLower) ||
          (activity.entityName && activity.entityName.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [activities, filter]);

  // Pagination
  const totalPages = serverMeta ? serverMeta.totalPages : Math.ceil(filteredActivities.length / itemsPerPage);
  // If server provides paginated items, activities already represent the current page
  const paginatedActivities = filteredActivities; 

  const handleViewDetails = (activity: ActivityLog) => {
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  const handleExport = () => {
    alert('Xuất dữ liệu lịch sử hoạt động');
  };

  return (
    <Layout title="Lịch sử hoạt động">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
          Lịch sử hoạt động người dùng
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#f8f9fa', borderRadius: '6px', padding: '2px' }}>
            <button
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: viewMode === 'table' ? '#3498db' : 'transparent',
                color: viewMode === 'table' ? 'white' : '#2c3e50',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📋 Bảng
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: viewMode === 'timeline' ? '#3498db' : 'transparent',
                color: viewMode === 'timeline' ? 'white' : '#2c3e50',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📅 Dòng thời gian
            </button>
          </div>
          <Button className="btn-secondary" onClick={handleExport}>
            📤 Xuất Excel
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <ActivityQuickStats activities={filteredActivities} />

      {/* Filter */}
      <div className="section-card" style={{ marginBottom: '30px' }}>
        <ActivityFilterComponent
          filter={filter}
          onFilterChange={setFilter}
          users={mockUsers}
          workshops={mockWorkshops}
          productionLines={mockProductionLines}
        />
      </div>

      {/* Content */}
      <div className="section-card">
        {viewMode === 'table' ? (
          <>
            <div className="table-container">
              {loading ? (
                <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>
              ) : loadError ? (
                <div style={{ padding: 20, color: 'red' }}>{loadError}</div>
              ) : (
              <ActivityLogTable
                activities={paginatedActivities}
                onViewDetails={handleViewDetails}
              />
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredActivities.length)} của {filteredActivities.length} hoạt động
                </div>
                <div className="pagination-controls">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </button>
                  <span className="pagination-current">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="timeline-container">
            <ActivityTimeline
              activities={paginatedActivities.slice(0, 50)} // Limit timeline view
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={handleCloseModal}
        />
      )}
    </Layout>
  );
}