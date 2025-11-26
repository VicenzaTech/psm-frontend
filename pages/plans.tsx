// pages/plans.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/Common/Button';
import { productionLines, brickTypes } from '../data/mockData';
import { Modal } from '../components/Common/Modal';
import { FormInput } from '../components/Common/FormInput';
import { FormSelect } from '../components/Common/FormSelect';

// Import types
import { ProductionPlan, PlanStatus } from '../types';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}
// Mock data cho khách hàng
const mockCustomers = [
  { id: 1, name: 'Công ty ABC', contact: 'Nguyễn Văn A', phone: '0901234567', email: 'abc@example.com' },
  { id: 2, name: 'Công ty XYZ', contact: 'Trần Thị B', phone: '0909876543', email: 'xyz@example.com' },
  { id: 3, name: 'Công ty DEF', contact: 'Lê Văn C', phone: '0905678901', email: 'def@example.com' },
];

// Mock data cho kế hoạch sản xuất
const mockProductionPlans: ProductionPlan[] = [
  {
    id: 1,
    planCode: 'KHS-2023-001',
    productionLineId: 1,
    brickTypeId: 1,
    customerId: 1,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-30'),
    targetQuantity: 10000,
    actualQuantity: 8500,
    completionPercentage: 85,
    status: PlanStatus.IN_PROGRESS,
    notes: 'Kế hoạch sản xuất tháng 6 cho dòng gạch porcelain',
    createdBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2023-05-25'),
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-06-15'),
    productionLine: { id: 1, name: 'Dây chuyền 1' },
    brickType: { id: 1, name: '300x600mm Porcelain' },
    customer: { id: 1, name: 'Công ty ABC' }
  },
  {
    id: 2,
    planCode: 'KHS-2023-002',
    productionLineId: 2,
    brickTypeId: 2,
    customerId: 2,
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-07-15'),
    targetQuantity: 15000,
    actualQuantity: 5000,
    completionPercentage: 33.3,
    status: PlanStatus.IN_PROGRESS,
    notes: 'Kế hoạch sản xuất cho dòng gạch granite',
    createdBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2023-06-10'),
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-20'),
    productionLine: { id: 2, name: 'Dây chuyền 2' },
    brickType: { id: 2, name: '400x800mm Granite' },
    customer: { id: 2, name: 'Công ty XYZ' }
  },
  {
    id: 3,
    planCode: 'KHS-2023-003',
    productionLineId: 1,
    brickTypeId: 3,
    customerId: 3,
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-07-31'),
    targetQuantity: 12000,
    actualQuantity: 0,
    completionPercentage: 0,
    status: PlanStatus.DRAFT,
    notes: 'Kế hoạch sản xuất tháng 7 cho dòng gạch ceramic',
    createdBy: 'planner',
    createdAt: new Date('2023-06-25'),
    updatedAt: new Date('2023-06-25'),
    productionLine: { id: 1, name: 'Dây chuyền 1' },
    brickType: { id: 3, name: '500x500mm Ceramic' },
    customer: { id: 3, name: 'Công ty DEF' }
  }
];

export default function PlansPage() {
  const [plans, setPlans] = useState<ProductionPlan[]>(mockProductionPlans);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case PlanStatus.IN_PROGRESS:
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#d4edda',
          color: '#155724'
        }}>Đang chạy</span>;
      case PlanStatus.APPROVED:
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#fff3cd',
          color: '#856404'
        }}>Đã duyệt</span>;
      case PlanStatus.COMPLETED:
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#d1ecf1',
          color: '#0c5460'
        }}>Hoàn thành</span>;
      case PlanStatus.CANCELLED:
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#f8d7da',
          color: '#721c24'
        }}>Hủy</span>;
      default:
        return <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          background: '#f8d7da',
          color: '#721c24'
        }}>Nháp</span>;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  };

  const handleEditPlan = (plan: ProductionPlan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleViewDetail = (plan: ProductionPlan) => {
    setSelectedPlan(plan);
    setShowDetailModal(true);
  };

  const handleDeletePlan = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const handleCreatePlan = (newPlan: ProductionPlan) => {
    setPlans([...plans, newPlan]);
    setShowCreateModal(false);
  };

  const handleUpdatePlan = (updatedPlan: ProductionPlan) => {
    setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  // Apply date filter and sort newest-first by start_date
  const displayedPlans = plans
    .filter((plan) => {
      // Filter by status if not "all"
      if (filterStatus !== 'all' && plan.status !== filterStatus) return false;
      
      // Filter by date range
      if (!filterStart && !filterEnd) return true;
      const planStart = new Date(plan.startDate);
      const planEnd = new Date(plan.endDate);
      const startFilter = filterStart ? new Date(filterStart) : null;
      const endFilter = filterEnd ? new Date(filterEnd) : null;
      
      // include plan if its date range overlaps with filter range
      if (startFilter && endFilter) {
        return planEnd >= startFilter && planStart <= endFilter;
      }
      if (startFilter) return planEnd >= startFilter;
      if (endFilter) return planStart <= endFilter;
      return true;
    })
    .sort((a, b) => (new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));

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

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>Từ ngày</label>
            <input 
              type="date" 
              value={filterStart} 
              onChange={(e) => setFilterStart(e.target.value)} 
              style={{ 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>Đến ngày</label>
            <input 
              type="date" 
              value={filterEnd} 
              onChange={(e) => setFilterEnd(e.target.value)} 
              style={{ 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>Trạng thái</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px'
              }}
            >
              <option value="all">Tất cả</option>
              <option value={PlanStatus.DRAFT}>Nháp</option>
              <option value={PlanStatus.APPROVED}>Đã duyệt</option>
              <option value={PlanStatus.IN_PROGRESS}>Đang chạy</option>
              <option value={PlanStatus.COMPLETED}>Hoàn thành</option>
              <option value={PlanStatus.CANCELLED}>Hủy</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button 
            className="btn-secondary" 
            onClick={() => { 
              setFilterStart(''); 
              setFilterEnd(''); 
              setFilterStatus('all'); 
            }}
          >
            Xóa filter
          </Button>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            <span>Sắp xếp:</span> <strong>Mới nhất trước</strong>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Mã kế hoạch</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Khách hàng</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Dây chuyền</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Sản phẩm</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Thời gian</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Chỉ tiêu</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Thực tế</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Trạng thái</th>
              <th style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '600', color: '#495057' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {displayedPlans.map((plan) => (
              <React.Fragment key={plan.id}>
                <tr 
                  onClick={() => toggleExpand(plan.id)} 
                  style={{ 
                    cursor: 'pointer',
                    borderBottom: expandedIds.includes(plan.id) ? 'none' : '1px solid #e9ecef',
                    backgroundColor: expandedIds.includes(plan.id) ? '#f8f9fa' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px 15px', fontWeight: '600' }}>{plan.planCode}</td>
                  <td style={{ padding: '12px 15px' }}>{plan.customer?.name}</td>
                  <td style={{ padding: '12px 15px' }}>{plan.productionLine?.name}</td>
                  <td style={{ padding: '12px 15px' }}>{plan.brickType?.name}</td>
                  <td style={{ padding: '12px 15px' }}>
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 15px' }}>{plan.targetQuantity.toLocaleString()} m²</td>
                  <td style={{ padding: '12px 15px' }}>{plan.actualQuantity.toLocaleString()} m²</td>
                  <td style={{ padding: '12px 15px' }}>{getStatusBadge(plan.status)}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button 
                        className="btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '12px' }} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleViewDetail(plan); 
                        }}
                      >
                        Chi tiết
                      </Button>
                      <Button 
                        className="btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '12px' }} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditPlan(plan); 
                        }}
                      >
                        Sửa
                      </Button>
                      <Button 
                        className="btn-danger" 
                        style={{ padding: '4px 8px', fontSize: '12px' }} 
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedIds.includes(plan.id) && (
                  <tr>
                    <td colSpan={10} style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>Thông tin chung</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            <div><strong>Mã kế hoạch:</strong> {plan.planCode}</div>
                            <div><strong>Người tạo:</strong> {plan.createdBy || '—'}</div>
                            <div><strong>Người duyệt:</strong> {plan.approvedBy || '—'}</div>
                            <div><strong>Ngày duyệt:</strong> {plan.approvedAt ? new Date(plan.approvedAt).toLocaleDateString() : '—'}</div>
                            <div><strong>Tỉ lệ hoàn thành:</strong> {plan.completionPercentage}%</div>
                            <div><strong>Ngày tạo:</strong> {new Date(plan.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>Ghi chú</h4>
                          <div style={{ 
                            padding: '10px', 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e9ecef', 
                            borderRadius: '4px',
                            minHeight: '60px'
                          }}>
                            {plan.notes || 'Không có ghi chú'}
                          </div>
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
      
      {/* Modal tạo kế hoạch mới */}
      <PlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo kế hoạch sản xuất mới"
        plan={null}
        onSave={handleCreatePlan}
      />
      
      {/* Modal chỉnh sửa kế hoạch */}
      <PlanModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa kế hoạch sản xuất"
        plan={selectedPlan}
        onSave={handleUpdatePlan}
      />
      
      {/* Modal chi tiết kế hoạch */}
      <PlanDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        plan={selectedPlan}
      />
    </Layout>
  );
}

// Component Modal cho tạo/chỉnh sửa kế hoạch
interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  plan: ProductionPlan | null;
  onSave: (plan: ProductionPlan) => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, title, plan, onSave }) => {
  const [formData, setFormData] = useState({
    planCode: plan?.planCode || '',
    productionLineId: plan?.productionLineId || 1,
    brickTypeId: plan?.brickTypeId || 1,
    customerId: plan?.customerId || 1,
    startDate: plan?.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : '',
    endDate: plan?.endDate ? new Date(plan.endDate).toISOString().split('T')[0] : '',
    targetQuantity: plan?.targetQuantity?.toString() || '',
    notes: plan?.notes || '',
    status: plan?.status || PlanStatus.DRAFT
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan: ProductionPlan = {
      id: plan?.id || Math.max(...mockProductionPlans.map(p => p.id), 0) + 1,
      planCode: formData.planCode,
      productionLineId: parseInt(formData.productionLineId.toString()),
      brickTypeId: parseInt(formData.brickTypeId.toString()),
      customerId: parseInt(formData.customerId.toString()),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      targetQuantity: parseFloat(formData.targetQuantity),
      actualQuantity: plan?.actualQuantity || 0,
      completionPercentage: plan?.completionPercentage || 0,
      status: formData.status as PlanStatus,
      notes: formData.notes,
      createdBy: plan?.createdBy || 'admin',
      approvedBy: plan?.approvedBy,
      approvedAt: plan?.approvedAt,
      createdAt: plan?.createdAt || new Date(),
      updatedAt: new Date(),
      // Include related data for display
      productionLine: productionLines.find(line => line.id === parseInt(formData.productionLineId.toString())),
      brickType: brickTypes.find(type => type.id === parseInt(formData.brickTypeId.toString())),
      customer: mockCustomers.find(customer => customer.id === parseInt(formData.customerId.toString()))
    };
    
    onSave(newPlan);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '600px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Mã kế hoạch
            </label>
            <input
              type="text"
              name="planCode"
              value={formData.planCode}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Dây chuyền sản xuất
            </label>
            <select
              name="productionLineId"
              value={formData.productionLineId}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {productionLines.map(line => (
                <option key={line.id} value={line.id}>{line.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Loại gạch
            </label>
            <select
              name="brickTypeId"
              value={formData.brickTypeId}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {brickTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Khách hàng
            </label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {mockCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Sản lượng mục tiêu (m²)
            </label>
            <input
              type="number"
              name="targetQuantity"
              value={formData.targetQuantity}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value={PlanStatus.DRAFT}>Nháp</option>
              <option value={PlanStatus.APPROVED}>Đã duyệt</option>
              <option value={PlanStatus.IN_PROGRESS}>Đang chạy</option>
              <option value={PlanStatus.COMPLETED}>Hoàn thành</option>
              <option value={PlanStatus.CANCELLED}>Hủy</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '80px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component Modal chi tiết kế hoạch
interface PlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ProductionPlan | null;
}

const PlanDetailModal: React.FC<PlanDetailModalProps> = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null;

  function getStatusBadge(status: PlanStatus): React.ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '700px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Chi tiết kế hoạch</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>Thông tin chung</h3>
            <div style={{ marginBottom: '10px' }}><strong>Mã kế hoạch:</strong> {plan.planCode}</div>
            <div style={{ marginBottom: '10px' }}><strong>Trạng thái:</strong> {getStatusBadge(plan.status)}</div>
            <div style={{ marginBottom: '10px' }}><strong>Người tạo:</strong> {plan.createdBy || '—'}</div>
            <div style={{ marginBottom: '10px' }}><strong>Người duyệt:</strong> {plan.approvedBy || '—'}</div>
            <div style={{ marginBottom: '10px' }}><strong>Ngày duyệt:</strong> {plan.approvedAt ? new Date(plan.approvedAt).toLocaleDateString() : '—'}</div>
            <div style={{ marginBottom: '10px' }}><strong>Ngày tạo:</strong> {new Date(plan.createdAt).toLocaleDateString()}</div>
            <div style={{ marginBottom: '10px' }}><strong>Cập nhật lần cuối:</strong> {new Date(plan.updatedAt).toLocaleDateString()}</div>
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>Thông tin sản xuất</h3>
            <div style={{ marginBottom: '10px' }}><strong>Khách hàng:</strong> {plan.customer?.name}</div>
            <div style={{ marginBottom: '10px' }}><strong>Dây chuyền:</strong> {plan.productionLine?.name}</div>
            <div style={{ marginBottom: '10px' }}><strong>Loại gạch:</strong> {plan.brickType?.name}</div>
            <div style={{ marginBottom: '10px' }}><strong>Ngày bắt đầu:</strong> {new Date(plan.startDate).toLocaleDateString()}</div>
            <div style={{ marginBottom: '10px' }}><strong>Ngày kết thúc:</strong> {new Date(plan.endDate).toLocaleDateString()}</div>
            <div style={{ marginBottom: '10px' }}><strong>Sản lượng mục tiêu:</strong> {plan.targetQuantity.toLocaleString()} m²</div>
            <div style={{ marginBottom: '10px' }}><strong>Sản lượng thực tế:</strong> {plan.actualQuantity.toLocaleString()} m²</div>
            <div style={{ marginBottom: '10px' }}><strong>Tỉ lệ hoàn thành:</strong> {plan.completionPercentage}%</div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>Ghi chú</h3>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '4px',
            minHeight: '60px'
          }}>
            {plan.notes || 'Không có ghi chú'}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};