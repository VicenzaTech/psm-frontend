// pages/plans.tsx
import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/Common/Button';
import { productionPlans } from '../data/mockData';
import { ProductionPlan } from '../types';
import NewPlanModal from '../components/ProductionPlans/NewPlanModal/NewPlanModal';
import styles from '@/styles//plans.module.css';

export default function PlansPage() {
  const [plans, setPlans] = useState(productionPlans);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#d4edda',
          color: '#155724'
        }}>Đang chạy</span>;
      case 'approved':
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#fff3cd',
          color: '#856404'
        }}>Đã duyệt</span>;
      case 'completed':
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#d1ecf1',
          color: '#0c5460'
        }}>Hoàn thành</span>;
      default:
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#f8d7da',
          color: '#721c24'
        }}>Hủy</span>;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  };

  // Apply date filter and sort newest-first by start_date
  const displayedPlans = plans
    .filter((plan) => {
      if (!filterStart && !filterEnd) return true;
      const planStart = new Date(plan.start_date);
      const planEnd = new Date(plan.end_date);
      const startFilter = filterStart ? new Date(filterStart) : null;
      const endFilter = filterEnd ? new Date(filterEnd) : null;
      // include plan if its date range overlaps the filter range
      if (startFilter && endFilter) {
        return planEnd >= startFilter && planStart <= endFilter;
      }
      if (startFilter) return planEnd >= startFilter;
      if (endFilter) return planStart <= endFilter;
      return true;
    })
    .sort((a, b) => (new Date(b.start_date).getTime() - new Date(a.start_date).getTime()));

  return (
    <Layout title="Kế hoạch sản xuất">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
          Danh sách kế hoạch sản xuất
        </h2>
        <Button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <span>+</span> Tạo kế hoạch mới
        </Button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Từ ngày</label>
          <input className={styles.input} type="date" value={filterStart} onChange={(e) => setFilterStart(e.target.value)} />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Đến ngày</label>
          <input className={styles.input} type="date" value={filterEnd} onChange={(e) => setFilterEnd(e.target.value)} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button className={`btn-secondary ${styles.resetBtn}`} onClick={() => { setFilterStart(''); setFilterEnd(''); }}>Xóa filter</Button>
        </div>

        <div className={styles.sortNote}><span className={styles.muted}>Sắp xếp:</span> <strong> Mới nhất trước</strong></div>
      </div>

      <div className="section-card">
        <table className="production-table">
          <thead>
            <tr>
              <th>Mã kế hoạch</th>
              <th>Dây chuyền</th>
              <th>Sản phẩm</th>
              <th>Thời gian</th>
              <th>Chỉ tiêu</th>
              <th>Thực tế</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {displayedPlans.map((plan) => (
              <React.Fragment key={plan.id}>
                <tr onClick={() => toggleExpand(plan.id)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: '600' }}>{plan.plan_code}</td>
                  <td>{plan.production_line.name}</td>
                  <td>{plan.brick_type.name}</td>
                  <td>{plan.start_date} - {plan.end_date}</td>
                  <td>{plan.target_quantity.toLocaleString()} m²</td>
                  <td>{plan.actual_quantity.toLocaleString()} m²</td>
                  <td>{getStatusBadge(plan.status)}</td>
                  <td>
                      <Button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); toggleExpand(plan.id); }}>
                        Chi tiết
                      </Button>
                  </td>
                </tr>
                {expandedIds.includes(plan.id) && (
                  <tr>
                    <td colSpan={8} style={{ background: '#fafafa', padding: 12 }}>
                      <div style={{ display: 'flex', gap: 24 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Thông tin</div>
                          <div style={{ fontSize: 13 }}>Mã: {plan.plan_code}</div>
                          <div style={{ fontSize: 13 }}>Người tạo: {plan.created_by || '—'}</div>
                          <div style={{ fontSize: 13 }}>Tỉ lệ hoàn thành: {plan.completion_percentage}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Ghi chú</div>
                          <div style={{ fontSize: 13, color: '#666' }}>Thông tin bổ sung sẽ hiển thị ở đây (placeholder).</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
        <NewPlanModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(plan: ProductionPlan) => setPlans((prev) => [plan, ...prev])}
        />
    </Layout>
  );
}