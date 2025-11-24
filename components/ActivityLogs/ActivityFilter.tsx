// components/ActivityLogs/ActivityFilter.tsx
import React, { useState } from 'react';
import { ActivityFilter } from '../../types';
import { Button } from '../Common/Button';

interface ActivityFilterProps {
  filter: ActivityFilter;
  onFilterChange: (filter: ActivityFilter) => void;
  users: Array<{ id: number; username: string; full_name: string }>;
  workshops: Array<{ id: number; name: string }>;
  productionLines: Array<{ id: number; name: string; workshop_id: number }>;
}

export const ActivityFilterComponent: React.FC<ActivityFilterProps> = ({
  filter,
  onFilterChange,
  users,
  workshops,
  productionLines
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof ActivityFilter, value: any) => {
    onFilterChange({
      ...filter,
      [field]: value
    });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  const actionTypes = [
    { value: 'create', label: 'Tạo mới' },
    { value: 'update', label: 'Cập nhật' },
    { value: 'delete', label: 'Xóa' },
    { value: 'start', label: 'Bắt đầu' },
    { value: 'stop', label: 'Dừng' },
    { value: 'approve', label: 'Duyệt' },
    { value: 'reject', label: 'Từ chối' },
    { value: 'login', label: 'Đăng nhập' },
    { value: 'logout', label: 'Đăng xuất' },
    { value: 'view', label: 'Xem' },
    { value: 'export', label: 'Xuất dữ liệu' },
    { value: 'import', label: 'Nhập dữ liệu' },
    { value: 'assign', label: 'Gán' },
    { value: 'unassign', label: 'Bỏ gán' }
  ];

  const entityTypes = [
    { value: 'production_plan', label: 'Kế hoạch sản xuất' },
    { value: 'stage_assignment', label: 'Công đoạn' },
    { value: 'brick_type', label: 'Dòng gạch' },
    { value: 'quality_record', label: 'Bản ghi chất lượng' },
    { value: 'user', label: 'Người dùng' },
    { value: 'workshop', label: 'Phân xưởng' },
    { value: 'production_line', label: 'Dây chuyền' },
    { value: 'device', label: 'Thiết bị' },
    { value: 'report', label: 'Báo cáo' },
    { value: 'settings', label: 'Cài đặt' }
  ];

  return (
    <div className="activity-filter-container">
      <div className="filter-header">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
          Bộ lọc hoạt động
        </h3>
        <button
          className="btn-link"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3498db',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isExpanded ? 'Thu gọn' : 'Mở rộng'}
        </button>
      </div>

      <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-row">
          <div className="filter-group">
            <label>Từ ngày</label>
            <input
              type="date"
              value={filter.start_date || ''}
              onChange={(e) => handleChange('start_date', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Đến ngày</label>
            <input
              type="date"
              value={filter.end_date || ''}
              onChange={(e) => handleChange('end_date', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Tìm kiếm</label>
            <input
              type="text"
              placeholder="Nhập từ khóa..."
              value={filter.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="filter-row">
              <div className="filter-group">
                <label>Người dùng</label>
                <select
                  value={filter.user_id || ''}
                  onChange={(e) => handleChange('user_id', e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Tất cả</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} (@{user.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Loại hành động</label>
                <select
                  value={filter.action_type || ''}
                  onChange={(e) => handleChange('action_type', e.target.value || undefined)}
                >
                  <option value="">Tất cả</option>
                  {actionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Đối tượng</label>
                <select
                  value={filter.entity_type || ''}
                  onChange={(e) => handleChange('entity_type', e.target.value || undefined)}
                >
                  <option value="">Tất cả</option>
                  {entityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Phân xưởng</label>
                <select
                  value={filter.workshop_id || ''}
                  onChange={(e) => handleChange('workshop_id', e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Tất cả</option>
                  {workshops.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Dây chuyền</label>
                <select
                  value={filter.production_line_id || ''}
                  onChange={(e) => handleChange('production_line_id', e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Tất cả</option>
                  {productionLines.map(line => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button className="btn-secondary" onClick={handleClear}>
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};