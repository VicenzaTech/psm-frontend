
// pages/stage-management.tsx
import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/Common/Button';
import { productionLines, brickTypes, productionPlans } from '../data/mockData';
import { measurementTypes } from '../data/mockMeasurementTypes';


// Component cho 2 nút hành động trạng thái & thiết bị
const ActionButtons = ({ onEditStatus, onManageDevices, disableEditStatus }: {
  onEditStatus: (e: React.MouseEvent) => void;
  onManageDevices: (e: React.MouseEvent) => void;
  disableEditStatus?: boolean;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', marginTop: 10 }}>
    <button
      onClick={onEditStatus}
      disabled={disableEditStatus}
      style={{
        fontSize: 13,
        color: '#fff',
        background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
        border: 'none',
        borderRadius: 8,
        padding: '6px 16px',
        fontWeight: 600,
        cursor: disableEditStatus ? 'not-allowed' : 'pointer',
        boxShadow: '0 1px 4px rgba(33,150,243,0.10)',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        opacity: disableEditStatus ? 0.5 : 1
      }}
      onMouseOver={e => !disableEditStatus && (e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)')}
      onMouseOut={e => !disableEditStatus && (e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)')}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>⚙️</span> Chỉnh sửa trạng thái
    </button>
    <button
      onClick={onManageDevices}
      style={{
        fontSize: 13,
        color: '#fff',
        background: 'linear-gradient(90deg, #43a047 0%, #66bb6a 100%)',
        border: 'none',
        borderRadius: 8,
        padding: '6px 16px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(76,175,80,0.10)',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}
      onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #388e3c 0%, #81c784 100%)'}
      onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #43a047 0%, #66bb6a 100%)'}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>🔌</span> Quản lý thiết bị
    </button>
  </div>
);

// Interface cho thiết bị IoT
interface IoTDevice {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error';
  lastUpdate: Date;
  measurementTypeId?: number;
}


// Enum Stage từ Prisma, định nghĩa các công đoạn cố định
export const Stage = {
  EP: 'EP',
  NUNG: 'NUNG',
  NUNG_MEN: 'NUNG_MEN',
  NUNG_XUONG: 'NUNG_XUONG',
  MAI: 'MAI',
  DONG_HOP: 'DONG_HOP',
} as const;

export type Stage = typeof Stage[keyof typeof Stage];

// Enum cho trạng thái hoạt động
export enum StageLiveStatus {
  RUNNING = 'RUNNING', // 🟢 Đang chạy
  IDLE = 'IDLE',       // 🟡 Chờ
  ERROR = 'ERROR',     // 🔴 Lỗi
  STOPPED = 'STOPPED'  // ⚫ Đã dừng
}

// Interface cho thông tin trạng thái live
interface StageLiveStatusInfo {
  status: StageLiveStatus;
  lastUpdate: Date;
  errorMessage?: string;
  currentBatchId?: string; // ID của lô đang chạy
}

// Cập nhật interface cho StageDeviceMapping để bao gồm danh sách thiết bị
interface StageDeviceMapping {
  id: number;
  productionLineId: number;
  stage: Stage;
  measurementPosition: number;
  iotDeviceIds?: string[]; // Thay đổi từ iotDeviceId thành iotDeviceIds (mảng)
  iotMeasurementTypeIds?: number[];
  isActive: boolean;
}


// Interface cho StageAssignment
interface StageAssignment {
  id: number;
  stage: Stage;
  production_line_id: number;
  brick_type_id: number;
  production_plan_id: number;
  actual_quantity: number;
  target_quantity: number;
  start_time: Date;
  is_active: boolean;
  status?: StageLiveStatus;
  selectedBrickTypeId?: number;
  selectedPlanId?: number;
}

// Hàm helper để lấy thông tin hiển thị cho từng Stage
export const getStageInfo = (stage: Stage) => {
  switch (stage) {
    case Stage.EP:
      return { name: 'Ép', icon: '🔧', description: 'Công đoạn ép nguyên liệu thành viên gạch thô' };
    case Stage.NUNG:
      return { name: 'Nung', icon: '🔥', description: 'Công đoạn nung gạch thô' };
    case Stage.NUNG_MEN:
      return { name: 'Nung Men', icon: '🎨', description: 'Công đoạn nung men lên bề mặt gạch' };
    case Stage.NUNG_XUONG:
      return { name: 'Nung Xương', icon: '🦴', description: 'Công đoạn nung lần đầu để tạo xương gạch' };
    case Stage.MAI:
      return { name: 'Mài', icon: '✨', description: 'Công đoạn mài bề mặt gạch để tạo độ bóng' };
    case Stage.DONG_HOP:
      return { name: 'Đóng Hộp', icon: '📦', description: 'Công đoạn đóng gói sản phẩm thành phẩm' };
    default:
      return { name: stage, icon: '❓', description: '' };
  }
};

// Hàm helper để lấy thông tin hiển thị cho trạng thái live
export const getLiveStatusInfo = (status: StageLiveStatus) => {
  switch (status) {
    case StageLiveStatus.RUNNING:
      return { icon: '🟢', text: 'Đang chạy', color: '#4caf50' };
    case StageLiveStatus.IDLE:
      return { icon: '🟡', text: 'Chờ', color: '#ff9800' };
    case StageLiveStatus.ERROR:
      return { icon: '🔴', text: 'Lỗi', color: '#f44336' };
    case StageLiveStatus.STOPPED:
      return { icon: '⚫', text: 'Đã dừng', color: '#9e9e9e' };
    default:
      return { icon: '❓', text: 'Không xác định', color: '#9e9e9e' };
  }
};


const mockIoTDevices: IoTDevice[] = [
  { id: 'TEMP_SENSOR_01', name: 'Cảm biến nhiệt độ 1', type: 'Nhiệt độ', status: 'online', lastUpdate: new Date() },
  { id: 'PRESSURE_SENSOR_01', name: 'Cảm biến áp suất 1', type: 'Áp suất', status: 'online', lastUpdate: new Date() },
  { id: 'HUMIDITY_SENSOR_01', name: 'Cảm biến độ ẩm 1', type: 'Độ ẩm', status: 'offline', lastUpdate: new Date(Date.now() - 3600000) },
  { id: 'VIBRATION_SENSOR_01', name: 'Cảm biến rung 1', type: 'Rung', status: 'online', lastUpdate: new Date() },
  { id: 'TEMP_SENSOR_02', name: 'Cảm biến nhiệt độ 2', type: 'Nhiệt độ', status: 'error', lastUpdate: new Date(Date.now() - 1800000) },
  { id: 'CAMERA_01', name: 'Camera giám sát 1', type: 'Camera', status: 'online', lastUpdate: new Date() },
];

// Mock data cho bảng stage_device_mappings
// Cập nhật mock data cho bảng stage_device_mappings
const mockStageDeviceMappings: StageDeviceMapping[] = [
  { id: 1, productionLineId: 1, stage: Stage.EP, measurementPosition: 1, iotDeviceIds: ['TEMP_SENSOR_01', 'PRESSURE_SENSOR_01'], isActive: true },
  { id: 2, productionLineId: 1, stage: Stage.NUNG, measurementPosition: 2, iotDeviceIds: ['TEMP_SENSOR_02'], isActive: true },
  { id: 3, productionLineId: 1, stage: Stage.MAI, measurementPosition: 3, iotDeviceIds: ['VIBRATION_SENSOR_01'], isActive: true },
  { id: 4, productionLineId: 1, stage: Stage.DONG_HOP, measurementPosition: 4, iotDeviceIds: ['CAMERA_01'], isActive: true },
  { id: 5, productionLineId: 2, stage: Stage.EP, measurementPosition: 1, iotDeviceIds: ['TEMP_SENSOR_01'], isActive: true },
  { id: 6, productionLineId: 2, stage: Stage.NUNG_XUONG, measurementPosition: 2, iotDeviceIds: ['PRESSURE_SENSOR_01'], isActive: true },
  { id: 7, productionLineId: 2, stage: Stage.NUNG_MEN, measurementPosition: 3, iotDeviceIds: ['TEMP_SENSOR_02'], isActive: true },
  { id: 8, productionLineId: 2, stage: Stage.MAI, measurementPosition: 4, iotDeviceIds: ['VIBRATION_SENSOR_01'], isActive: true },
];

// Mock data cho trạng thái live của các công đoạn
const mockStageLiveStatus: { [key: string]: StageLiveStatusInfo } = {
  '1-EP': { status: StageLiveStatus.RUNNING, lastUpdate: new Date(), currentBatchId: 'BATCH-001' },
  '1-NUNG': { status: StageLiveStatus.RUNNING, lastUpdate: new Date(), currentBatchId: 'BATCH-002' },
  '1-MAI': { status: StageLiveStatus.IDLE, lastUpdate: new Date() },
  '1-DONG_HOP': { status: StageLiveStatus.STOPPED, lastUpdate: new Date() },
  '2-EP': { status: StageLiveStatus.ERROR, lastUpdate: new Date(), errorMessage: 'Mất kết nối cảm biến nhiệt độ' },
  '2-NUNG_XUONG': { status: StageLiveStatus.RUNNING, lastUpdate: new Date(), currentBatchId: 'BATCH-003' },
  '2-NUNG_MEN': { status: StageLiveStatus.IDLE, lastUpdate: new Date() },
  '2-MAI': { status: StageLiveStatus.IDLE, lastUpdate: new Date() },
};

// Mock data cho các gán công đoạn (lịch sản xuất)
const mockStageAssignments: StageAssignment[] = [
  {
    id: 1,
    stage: Stage.EP,
    production_line_id: 1,
    brick_type_id: 1,
    production_plan_id: 1,
    actual_quantity: 5000,
    target_quantity: 5500,
    start_time: new Date('2023-06-01T08:00:00'),
    is_active: true,
    status: StageLiveStatus.RUNNING,
    selectedBrickTypeId: 1,
    selectedPlanId: 1
  },
  {
    id: 2,
    stage: Stage.NUNG,
    production_line_id: 1,
    brick_type_id: 1,
    production_plan_id: 1,
    actual_quantity: 4500,
    target_quantity: 5500,
    start_time: new Date('2023-06-01T10:00:00'),
    is_active: true,
    status: StageLiveStatus.RUNNING,
    selectedBrickTypeId: 1,
    selectedPlanId: 1
  },
  {
    id: 3,
    stage: Stage.MAI,
    production_line_id: 1,
    brick_type_id: 2,
    production_plan_id: 2,
    actual_quantity: 3000,
    target_quantity: 4000,
    start_time: new Date('2023-06-01T12:00:00'),
    is_active: true,
    status: StageLiveStatus.IDLE,
    selectedBrickTypeId: 2,
    selectedPlanId: 2
  }
];

const getDeviceStatusInfo = (status: string) => {
  switch (status) {
    case 'online':
      return { icon: '🟢', text: 'Online', color: '#4caf50' };
    case 'offline':
      return { icon: '🟡', text: 'Offline', color: '#ff9800' };
    case 'error':
      return { icon: '🔴', text: 'Lỗi', color: '#f44336' };
    default:
      return { icon: '❓', text: 'Không xác định', color: '#9e9e9e' };
  }
};

// Component cho thẻ công đoạn
const StageCard = ({
  mapping,
  assignment,
  isSelected,
  onClick,
  onEdit,
  onDeactivate,
  onStart,
  onStop,
  onUpdateStatus,
  onUpdateDevices
}: {
  mapping: StageDeviceMapping;
  assignment?: StageAssignment;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
  onStart: () => void;
  onStop: () => void;
  onUpdateStatus?: (assignmentId: number, status: StageLiveStatus, brickTypeId: number, planId: number) => void;
  onUpdateDevices?: (mappingId: number, deviceIds: string[]) => void;
}) => {
  const stageInfo = getStageInfo(mapping.stage);

  // State cho chỉnh sửa trạng thái và dòng gạch
  const [editStatus, setEditStatus] = useState<StageLiveStatus>(assignment?.status || StageLiveStatus.IDLE);
  const [editBrickType, setEditBrickType] = useState<number>(assignment?.selectedBrickTypeId || assignment?.brick_type_id || brickTypes[0]?.id);
  const [editPlan, setEditPlan] = useState<number>(assignment?.selectedPlanId || assignment?.production_plan_id || productionPlans[0]?.id);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  // State cho quản lý thiết bị
  const [isEditingDevices, setIsEditingDevices] = useState(false);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(mapping.iotDeviceIds || []);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  // Lấy thông tin trạng thái live từ mock data
  const liveStatusKey = `${mapping.productionLineId}-${mapping.stage}`;
  const liveStatusInfo = mockStageLiveStatus[liveStatusKey] || {
    status: StageLiveStatus.IDLE,
    lastUpdate: new Date()
  };
  const liveStatusDisplay = getLiveStatusInfo(liveStatusInfo.status);

  // Lấy danh sách thiết bị cho công đoạn này
  const stageDevices = mockIoTDevices.filter(device =>
    mapping.iotDeviceIds?.includes(device.id)
  );

  const getProgressPercentage = () => {
    if (!assignment) return 0;
    return Math.round((assignment.actual_quantity / assignment.target_quantity) * 100);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement detail logic if needed
  };

  const handleStopClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStop();
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart();
  };

  const handleSaveStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (assignment && onUpdateStatus) {
      onUpdateStatus(assignment.id, editStatus, editBrickType, editPlan);
    }
    setIsEditingStatus(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset về giá trị ban đầu
    setEditStatus(assignment?.status || StageLiveStatus.IDLE);
    setEditBrickType(assignment?.selectedBrickTypeId || assignment?.brick_type_id || brickTypes[0]?.id);
    setEditPlan(assignment?.selectedPlanId || assignment?.production_plan_id || productionPlans[0]?.id);
    setIsEditingStatus(false);
  };

  const handleSaveDevices = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateDevices) {
      onUpdateDevices(mapping.id, selectedDeviceIds);
    }
    setIsEditingDevices(false);
  };

  const handleCancelEditDevices = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDeviceIds(mapping.iotDeviceIds || []);
    setIsEditingDevices(false);
  };

  const handleAddDevice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeviceModal(true);
  };

  const handleRemoveDevice = (e: React.MouseEvent, deviceId: string) => {
    e.stopPropagation();
    setSelectedDeviceIds(prev => prev.filter(id => id !== deviceId));
  };

  return (
    <div
      className={`stage-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        position: 'relative',
        background: isSelected ? '#e3f2fd' : '#ffffff',
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 4px 12px rgba(33, 150, 243, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '24px', marginRight: '10px' }}>{stageInfo.icon}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{stageInfo.name}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{stageInfo.description}</p>
            <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#999' }}>
              Vị trí đo: {mapping.measurementPosition}
            </p>
          </div>
        </div>

        {/* === PHẦN TRẠNG THÁI & CHỈNH SỬA === */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          {!isEditingStatus ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '12px',
                backgroundColor: liveStatusDisplay.color + '20'
              }}>
                <span style={{ fontSize: '18px' }}>{liveStatusDisplay.icon}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: liveStatusDisplay.color
                }}>
                  {liveStatusDisplay.text}
                </span>
              </div>
              {liveStatusInfo.status === StageLiveStatus.ERROR && liveStatusInfo.errorMessage && (
                <div style={{
                  fontSize: '11px',
                  color: '#f44336',
                  maxWidth: '150px',
                  textAlign: 'right',
                  fontStyle: 'italic'
                }}>
                  {liveStatusInfo.errorMessage}
                </div>
              )}
              {liveStatusInfo.currentBatchId && (
                <div style={{ fontSize: '11px', color: '#666' }}>
                  Lô: {liveStatusInfo.currentBatchId}
                </div>
              )}
              <ActionButtons
                onEditStatus={e => { e.stopPropagation(); setIsEditingStatus(true); }}
                onManageDevices={e => { e.stopPropagation(); setIsEditingDevices(true); }}
                disableEditStatus={!assignment}
              />
            </>
          ) : (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '250px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                Cập nhật trạng thái
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '15px' }}>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as StageLiveStatus)}
                  style={{
                    fontSize: 13,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    width: '100%'
                  }}
                >
                  <option value={StageLiveStatus.RUNNING}>🟢 Đang chạy</option>
                  <option value={StageLiveStatus.IDLE}>🟡 Chờ</option>
                  <option value={StageLiveStatus.STOPPED}>⚫ Đã dừng</option>
                  <option value={StageLiveStatus.ERROR}>🔴 Lỗi</option>
                </select>

                {(editStatus === StageLiveStatus.RUNNING || editStatus === StageLiveStatus.IDLE) && (
                  <>
                    <select
                      value={editBrickType}
                      onChange={e => setEditBrickType(Number(e.target.value))}
                      style={{
                        fontSize: 13,
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f9f9f9',
                        width: '100%'
                      }}
                    >
                      {brickTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.name}</option>)}
                    </select>

                    <select
                      value={editPlan}
                      onChange={e => setEditPlan(Number(e.target.value))}
                      style={{
                        fontSize: 13,
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f9f9f9',
                        width: '100%'
                      }}
                    >
                      {productionPlans.map(pp => <option key={pp.id} value={pp.id}>{pp.plan_code}</option>)}
                    </select>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveStatus}
                  style={{
                    fontSize: 12,
                    color: 'white',
                    fontWeight: 'bold',
                    background: '#4caf50',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Lưu
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    fontSize: 12,
                    color: '#333',
                    fontWeight: 'bold',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#666' }}
            title="Chỉnh sửa"
          >
            ✏️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeactivate(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#e74c3c' }}
            title="Vô hiệu hóa"
          >
            🚫
          </button>
        </div>
      </div>

      {/* === PHẦN DANH SÁCH THIẾT BỊ === */}
      <div style={{ marginTop: '15px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Thiết bị IoT</h4>
          {!isEditingDevices ? (
            null
          ) : (
            <button
              onClick={handleAddDevice}
              style={{
                fontSize: 12,
                color: '#4caf50',
                background: 'none',
                border: '1px solid #4caf50',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer'
              }}
            >
              + Thêm thiết bị
            </button>
          )}
        </div>

        {stageDevices.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
            Chưa có thiết bị nào được gán
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {stageDevices.map(device => {
              const deviceStatus = getDeviceStatusInfo(device.status);
              return (
                <div
                  key={device.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: deviceStatus.color + '20',
                    border: `1px solid ${deviceStatus.color}40`,
                    fontSize: '11px'
                  }}
                >
                  <span>{deviceStatus.icon}</span>
                  <span>{device.name}</span>
                  {isEditingDevices && (
                    <button
                      onClick={(e) => handleRemoveDevice(e, device.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#e74c3c',
                        marginLeft: '2px'
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* === PHẦN CHỈNH SỬA THIẾT BỊ === */}
      {isEditingDevices && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '300px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            Quản lý thiết bị
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>
              Chọn thiết bị để gán:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {mockIoTDevices.map(device => {
                const deviceStatus = getDeviceStatusInfo(device.status);
                const isSelected = selectedDeviceIds.includes(device.id);

                return (
                  <div
                    key={device.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDeviceIds(prev => prev.filter(id => id !== device.id));
                      } else {
                        setSelectedDeviceIds(prev => [...prev, device.id]);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? deviceStatus.color + '40' : deviceStatus.color + '20',
                      border: `1px solid ${deviceStatus.color}40`,
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{deviceStatus.icon}</span>
                    <span>{device.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSaveDevices}
              style={{
                fontSize: 12,
                color: 'white',
                fontWeight: 'bold',
                background: '#4caf50',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              Lưu
            </button>
            <button
              onClick={handleCancelEditDevices}
              style={{
                fontSize: 12,
                color: '#333',
                fontWeight: 'bold',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {assignment ? (
        <div>
          <div style={{ margin: '15px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Tiến độ</span>
              <span style={{ fontSize: '14px' }}>{getProgressPercentage()}%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${getProgressPercentage()}%`, backgroundColor: '#4caf50', borderRadius: '4px' }}></div>
            </div>
          </div>

          <div style={{ fontSize: '14px', marginBottom: '5px' }}>
            <strong>Sản lượng:</strong> {assignment.actual_quantity.toLocaleString()} / {assignment.target_quantity.toLocaleString()} m²
          </div>

          <div style={{ fontSize: '14px', marginBottom: '5px' }}>
            <strong>Dòng gạch:</strong> {brickTypes.find(bt => bt.id === (assignment.selectedBrickTypeId || assignment.brick_type_id))?.name}
          </div>

          <div style={{ fontSize: '14px', marginBottom: '5px' }}>
            <strong>Kế hoạch:</strong> {productionPlans.find(pp => pp.id === (assignment.selectedPlanId || assignment.production_plan_id))?.plan_code}
          </div>

          <div style={{ fontSize: '14px', marginBottom: '15px' }}>
            <strong>Trạng thái:</strong> {getLiveStatusInfo(assignment.status || StageLiveStatus.IDLE).text}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button className="btn-primary" onClick={() => handleDetailClick}>Chi tiết</Button>
            <Button className="btn-secondary" onClick={() => handleStopClick}>Dừng</Button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Công đoạn đang không hoạt động
          </div>
          <Button className="btn-primary" onClick={() => handleStartClick}>Khởi động</Button>
        </div>
      )}
    </div>
  );
};
// Component Modal cho quản lý thiết bị
const DeviceModal = ({ isOpen, onClose, title, availableDevices, selectedDeviceIds, onDeviceSelect }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  availableDevices: IoTDevice[];
  selectedDeviceIds: string[];
  onDeviceSelect: (deviceIds: string[]) => void;
}) => {
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedDeviceIds);

  const handleSave = () => {
    onDeviceSelect(tempSelectedIds);
    onClose();
  };

  const handleDeviceClick = (deviceId: string) => {
    if (tempSelectedIds.includes(deviceId)) {
      setTempSelectedIds(prev => prev.filter(id => id !== deviceId));
    } else {
      setTempSelectedIds(prev => [...prev, deviceId]);
    }
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
        maxHeight: '80vh',
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

        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>
            Chọn thiết bị để gán:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {availableDevices.map(device => {
              const deviceStatus = getDeviceStatusInfo(device.status);
              const isSelected = tempSelectedIds.includes(device.id);

              return (
                <div
                  key={device.id}
                  onClick={() => handleDeviceClick(device.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? deviceStatus.color + '40' : '#f5f5f5',
                    border: `1px solid ${deviceStatus.color}40`,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{deviceStatus.icon}</span>
                  <div>
                    <div style={{ fontWeight: '500' }}>{device.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{device.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#4caf50',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

// Component cho kết nối giữa các công đoạn
const StageConnector = () => (
  <div style={{ height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: '2px', height: '30px', backgroundColor: '#2196f3' }}></div>
  </div>
);

// Component Modal
const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
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
        width: '500px',
        maxWidth: '90%'
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
        {children}
      </div>
    </div>
  );
};

// Component FormInput
const FormInput = ({ label, value, onChange, placeholder, type = 'text' }: {
  label: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'textarea';
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '80px'
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      )}
    </div>
  );
};

// Component FormSelect
const FormSelect = ({ label, options, onChange, value, multiple }: {
  label: string;
  options: { value: any; label: string }[];
  onChange: (value: any) => void;
  value?: any;
  multiple?: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      onChange(selected);
    } else {
      onChange(e.target.value);
    }
  };
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={handleChange}
        multiple={multiple}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          minHeight: multiple ? 80 : undefined
        }}
      >
        {!multiple && <option value="">-- Chọn --</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default function StageManagementPage() {
  const [selectedLine, setSelectedLine] = useState(productionLines[0]);
  const [stageDeviceMappings, setStageDeviceMappings] = useState<StageDeviceMapping[]>(mockStageDeviceMappings);
  const [stageAssignments, setStageAssignments] = useState<StageAssignment[]>(mockStageAssignments);
  const [selectedMapping, setSelectedMapping] = useState<StageDeviceMapping | null>(null);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<StageDeviceMapping | null>(null);
  const [editingMappingDevices, setEditingMappingDevices] = useState<StageDeviceMapping | null>(null);

  const [newMapping, setNewMapping] = useState({
    stage: '',
    measurementPosition: 1,
    iotDeviceIds: [] as string[],
    iotMeasurementTypeIds: [] as number[],
  });

  const [startData, setStartData] = useState({
    brick_type_id: '',
    production_plan_id: '',
    target_quantity: '',
  });

  // Hàm xử lý cập nhật trạng thái
  const handleUpdateAssignmentStatus = (assignmentId: number, status: StageLiveStatus, brickTypeId: number, planId: number) => {
    setStageAssignments(prev => prev.map(a =>
      a.id === assignmentId
        ? {
          ...a,
          status,
          selectedBrickTypeId: (status === StageLiveStatus.RUNNING || status === StageLiveStatus.IDLE) ? brickTypeId : undefined,
          selectedPlanId: (status === StageLiveStatus.RUNNING || status === StageLiveStatus.IDLE) ? planId : undefined
        }
        : a
    ));

    // Cập nhật cả mockStageLiveStatus
    const assignment = stageAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      const liveStatusKey = `${assignment.production_line_id}-${assignment.stage}`;
      mockStageLiveStatus[liveStatusKey] = {
        status,
        lastUpdate: new Date(),
        currentBatchId: status === StageLiveStatus.RUNNING ? `BATCH-${Math.floor(Math.random() * 1000)}` : undefined
      };
    }
  };

  // Hàm xử lý cập nhật thiết bị
  const handleUpdateMappingDevices = (mappingId: number, deviceIds: string[]) => {
    setStageDeviceMappings(prev => prev.map(mapping =>
      mapping.id === mappingId ? { ...mapping, iotDeviceIds: deviceIds } : mapping
    ));
  };

  // Hàm xử lý mở modal thiết bị
  const handleOpenDeviceModal = (mapping: StageDeviceMapping) => {
    setEditingMappingDevices(mapping);
    setShowDeviceModal(true);
  };

  const lineMappings = stageDeviceMappings
    .filter(mapping => mapping.productionLineId === selectedLine.id && mapping.isActive)
    .sort((a, b) => a.measurementPosition - b.measurementPosition);

  const lineAssignments = stageAssignments.filter(
    assignment => assignment.production_line_id === selectedLine.id && assignment.is_active
  );

  const handleConfigureStage = () => {
    const maxPosition = Math.max(...stageDeviceMappings
      .filter(m => m.productionLineId === selectedLine.id)
      .map(m => m.measurementPosition), 0);

    const mappingToCreate: StageDeviceMapping = {
      id: Math.max(...stageDeviceMappings.map(m => m.id), 0) + 1,
      productionLineId: selectedLine.id,
      stage: newMapping.stage as Stage,
      measurementPosition: maxPosition + 1,
      iotDeviceIds: newMapping.iotDeviceIds,
      iotMeasurementTypeIds: newMapping.iotMeasurementTypeIds || [],
      isActive: true,
    };

    setStageDeviceMappings([...stageDeviceMappings, mappingToCreate]);
    setShowConfigureModal(false);
    setNewMapping({ stage: '', measurementPosition: 1, iotDeviceIds: [], iotMeasurementTypeIds: [] });
  };

  const handleUpdateMapping = () => {
    if (!editingMapping) return;

    setStageDeviceMappings(stageDeviceMappings.map(mapping =>
      mapping.id === editingMapping.id ? {
        ...mapping,
        measurementPosition: editingMapping.measurementPosition,
        iotDeviceIds: editingMapping.iotDeviceIds,
        iotMeasurementTypeIds: editingMapping.iotMeasurementTypeIds || []
      } : mapping
    ));
    setShowEditModal(false);
    setEditingMapping(null);
  };

  const handleDeactivateMapping = (mappingId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa công đoạn này khỏi dây chuyền?')) {
      setStageDeviceMappings(stageDeviceMappings.map(mapping =>
        mapping.id === mappingId ? { ...mapping, isActive: false } : mapping
      ));
    }
  };

  const handleStartStage = (stage: Stage) => {
    // Find mapping for this stage and line to get the id
    const mapping = stageDeviceMappings.find(m => m.productionLineId === selectedLine.id && m.stage === stage && m.isActive);
    if (mapping) {
      setSelectedMapping(mapping);
    }
    setShowStartModal(true);
  };

  const handleStopStage = (assignmentId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn dừng công đoạn này?')) {
      setStageAssignments(stageAssignments.map(assignment =>
        assignment.id === assignmentId ? { ...assignment, is_active: false } : assignment
      ));
    }
  };

  const handleAssignStage = () => {
    if (!selectedMapping) return;

    const newAssignment: StageAssignment = {
      id: Math.max(...stageAssignments.map(a => a.id), 0) + 1,
      stage: selectedMapping.stage,
      production_line_id: selectedLine.id,
      brick_type_id: parseInt(startData.brick_type_id),
      production_plan_id: parseInt(startData.production_plan_id),
      actual_quantity: 0,
      target_quantity: parseInt(startData.target_quantity),
      start_time: new Date(),
      is_active: true,
      status: StageLiveStatus.RUNNING,
      selectedBrickTypeId: parseInt(startData.brick_type_id),
      selectedPlanId: parseInt(startData.production_plan_id)
    };

    setStageAssignments([...stageAssignments, newAssignment]);

    // Cập nhật trạng thái live
    const liveStatusKey = `${selectedLine.id}-${selectedMapping.stage}`;
    mockStageLiveStatus[liveStatusKey] = {
      status: StageLiveStatus.RUNNING,
      lastUpdate: new Date(),
      currentBatchId: `BATCH-${Math.floor(Math.random() * 1000)}`
    };

    setShowStartModal(false);
    setSelectedMapping(null);
    setStartData({ brick_type_id: '', production_plan_id: '', target_quantity: '' });
  };

  // Lấy các stage chưa được cấu hình cho dây chuyền hiện tại
  const availableStages = Object.values(Stage).filter(stage =>
    !stageDeviceMappings.some(m => m.productionLineId === selectedLine.id && m.stage === stage && m.isActive)
  );

  return (
    <Layout title="Quản lý công đoạn">
      {/* Production Line Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #ecf0f1', paddingBottom: '15px' }}>
        {productionLines.map((line) => (
          <button
            key={line.id}
            onClick={() => setSelectedLine(line)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              background: selectedLine.id === line.id ? '#3498db' : '#ecf0f1',
              color: selectedLine.id === line.id ? 'white' : '#2c3e50',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {line.name}
          </button>
        ))}
      </div>

      {/* Nút cấu hình công đoạn */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button
          className="btn-primary"
          onClick={() => setShowConfigureModal(true)}
          disabled={availableStages.length === 0}
        >
          Thêm công đoạn
        </Button>
      </div>

      {/* Timeline công đoạn */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {lineMappings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏭</div>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chưa cấu hình công đoạn nào</div>
            <div>Nhấn vào nút "Thêm công đoạn" để bắt đầu cấu hình cho dây chuyền này.</div>
          </div>
        ) : (
          lineMappings.map((mapping, index) => {
            const assignment = lineAssignments.find(a => a.stage === mapping.stage);
            return (
              <div key={mapping.id}>
                <StageCard
                  mapping={mapping}
                  assignment={assignment}
                  isSelected={selectedMapping?.id === mapping.id}
                  onClick={() => setSelectedMapping(mapping)}
                  onEdit={() => { setEditingMapping(mapping); setShowEditModal(true); }}
                  onDeactivate={() => handleDeactivateMapping(mapping.id)}
                  onStart={() => handleStartStage(mapping.stage)}
                  onStop={() => assignment && handleStopStage(assignment.id)}
                  onUpdateStatus={handleUpdateAssignmentStatus}
                  onUpdateDevices={handleUpdateMappingDevices}
                />
                {index < lineMappings.length - 1 && <StageConnector />}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Thêm/Cấu hình công đoạn */}
      <Modal isOpen={showConfigureModal} onClose={() => setShowConfigureModal(false)} title="Thêm công đoạn vào dây chuyền">
        <FormSelect
          label="Công đoạn"
          value={newMapping.stage}
          onChange={(value) => setNewMapping({ ...newMapping, stage: value })}
          options={availableStages.map(stage => ({ value: stage, label: getStageInfo(stage).name }))}
        />
        <FormInput
          label="Vị trí đo"
          value={newMapping.measurementPosition}
          onChange={(value) => setNewMapping({ ...newMapping, measurementPosition: parseInt(value.toString()) || 1 })}
          type="number"
          placeholder="Thứ tự của công đoạn trên dây chuyền"
        />
        {/* Đoạn chọn loại đo lường IoT sẽ hiển thị dưới dạng checkbox group ở modal chỉnh sửa, không cần input đơn lẻ ở đây */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button className="btn-secondary" onClick={() => setShowConfigureModal(false)}>Hủy</Button>
          <Button className="btn-primary" onClick={handleConfigureStage}>Thêm</Button>
        </div>
      </Modal>

      {/* Modal Chỉnh sửa công đoạn */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa thông tin công đoạn">
        {editingMapping && (
          <>
            <p style={{ margin: '0 0 15px', fontSize: '14px', color: '#666' }}>
              <strong>Công đoạn:</strong> {getStageInfo(editingMapping.stage).name}
            </p>
            <FormInput
              label="Vị trí đo"
              value={editingMapping.measurementPosition}
              onChange={(value) => setEditingMapping({ ...editingMapping, measurementPosition: parseInt(value.toString()) || 1 })}
              type="number"
            />
            {/* Đoạn chọn measurement type dạng checkbox group */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Loại đo lường IoT (có thể chọn nhiều)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {measurementTypes.map(mt => (
                    <label key={mt.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        type="checkbox"
                        checked={Array.isArray(editingMapping.iotMeasurementTypeIds) && editingMapping.iotMeasurementTypeIds.includes(mt.id)}
                        onChange={e => {
                          const checked = e.target.checked;
                          let next = Array.isArray(editingMapping.iotMeasurementTypeIds) ? [...editingMapping.iotMeasurementTypeIds] : [];
                          if (checked) {
                            next.push(mt.id);
                          } else {
                            next = next.filter(id => id !== mt.id);
                          }
                          setEditingMapping({ ...editingMapping, iotMeasurementTypeIds: next });
                        }}
                      />
                      {mt.name}
                    </label>
                  ))}
                </div>
              </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button className="btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
              <Button className="btn-primary" onClick={handleUpdateMapping}>Cập nhật</Button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal Khởi động công đoạn */}
      <Modal isOpen={showStartModal} onClose={() => setShowStartModal(false)} title="Khởi động công đoạn">
        <p style={{ margin: '0 0 15px', fontSize: '14px', color: '#666' }}>
          <strong>Công đoạn:</strong> {selectedMapping && getStageInfo(selectedMapping.stage).name}
        </p>
        <FormSelect
          label="Dòng gạch"
          value={startData.brick_type_id}
          onChange={(value) => setStartData({ ...startData, brick_type_id: value })}
          options={brickTypes.map(bt => ({ value: bt.id, label: bt.name }))}
        />
        <FormSelect
          label="Kế hoạch sản xuất"
          value={startData.production_plan_id}
          onChange={(value) => setStartData({ ...startData, production_plan_id: value })}
          options={productionPlans.map(pp => ({ value: pp.id, label: pp.plan_code }))}
        />
        <FormInput
          label="Sản lượng mục tiêu"
          value={startData.target_quantity}
          onChange={(value) => setStartData({ ...startData, target_quantity: value })}
          type="number"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button className="btn-secondary" onClick={() => setShowStartModal(false)}>Hủy</Button>
          <Button className="btn-primary" onClick={handleAssignStage}>Khởi động</Button>
        </div>
      </Modal>

      {/* Modal Quản lý thiết bị */}
      <DeviceModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        title="Quản lý thiết bị IoT"
        availableDevices={mockIoTDevices}
        selectedDeviceIds={editingMappingDevices?.iotDeviceIds || []}
        onDeviceSelect={(deviceIds) => {
          if (editingMappingDevices) {
            handleUpdateMappingDevices(editingMappingDevices.id, deviceIds);
          }
        }}
      />
    </Layout>
  );
}