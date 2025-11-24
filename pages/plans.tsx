// pages/plans.tsx
import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/Common/Button';
import { productionPlans } from '../data/mockData';
import { ProductionPlan } from '../types';

export default function PlansPage() {
  const [plans, setPlans] = useState(productionPlans);

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

  return (
    <Layout title="Kế hoạch sản xuất">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
          Danh sách kế hoạch sản xuất
        </h2>
        <Button className="btn-primary">
          <span>+</span> Tạo kế hoạch mới
        </Button>
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
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td style={{ fontWeight: '600' }}>{plan.plan_code}</td>
                <td>{plan.production_line.name}</td>
                <td>{plan.brick_type.name}</td>
                <td>{plan.start_date} - {plan.end_date}</td>
                <td>{plan.target_quantity.toLocaleString()} m²</td>
                <td>{plan.actual_quantity.toLocaleString()} m²</td>
                <td>{getStatusBadge(plan.status)}</td>
                <td>
                  <Button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}