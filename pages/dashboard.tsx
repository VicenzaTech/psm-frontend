// pages/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { productionLines } from '../data/mockData';

// Import các enum và helper từ stage-management
import { Stage, StageLiveStatus, getStageInfo, getLiveStatusInfo } from './stage-management';

// Mock data cho trạng thái live (trong thực tế sẽ fetch từ API)
const mockStageLiveStatus: { [key: string]: any } = {
  '1-EP': { status: StageLiveStatus.RUNNING, lastUpdate: new Date(), currentBatchId: 'BATCH-001' },
  '1-NUNG': { status: StageLiveStatus.RUNNING, lastUpdate: new Date(), currentBatchId: 'BATCH-002' },
  '1-MAI': { status: StageLiveStatus.IDLE, lastUpdate: new Date() },
  '1-DONG_HOP': { status: StageLiveStatus.STOPPED, lastUpdate: new Date() },
  '2-EP': { status: StageLiveStatus.ERROR, lastUpdate: new Date(), errorMessage: 'Mất kết nối cảm biến nhiệt độ' },
  '2-NUNG_XUONG': { status: StageLiveStatus.RUNNING, lastUpdate: new Date(), currentBatchId: 'BATCH-003' },
  '2-NUNG_MEN': { status: StageLiveStatus.IDLE, lastUpdate: new Date() },
  '2-MAI': { status: StageLiveStatus.IDLE, lastUpdate: new Date() },
};

// Mock data cho các công đoạn trên dây chuyền
const mockStageDeviceMappings = [
  { id: 1, productionLineId: 1, stage: Stage.EP, measurementPosition: 1, isActive: true },
  { id: 2, productionLineId: 1, stage: Stage.NUNG, measurementPosition: 2, isActive: true },
  { id: 3, productionLineId: 1, stage: Stage.MAI, measurementPosition: 3, isActive: true },
  { id: 4, productionLineId: 1, stage: Stage.DONG_HOP, measurementPosition: 4, isActive: true },
  { id: 5, productionLineId: 2, stage: Stage.EP, measurementPosition: 1, isActive: true },
  { id: 6, productionLineId: 2, stage: Stage.NUNG_XUONG, measurementPosition: 2, isActive: true },
  { id: 7, productionLineId: 2, stage: Stage.NUNG_MEN, measurementPosition: 3, isActive: true },
  { id: 8, productionLineId: 2, stage: Stage.MAI, measurementPosition: 4, isActive: true },
];

// Component cho thẻ tổng quan của một dây chuyền
const ProductionLineSummaryCard = ({ line }: { line: any }) => {
  const lineStages = mockStageDeviceMappings.filter(
    mapping => mapping.productionLineId === line.id && mapping.isActive
  );

  // Tính toán số lượng công đoạn theo từng trạng thái
  const statusCounts = {
    running: 0,
    idle: 0,
    error: 0,
    stopped: 0,
  };

  lineStages.forEach(stage => {
    const liveStatusKey = `${stage.productionLineId}-${stage.stage}`;
    const status = mockStageLiveStatus[liveStatusKey]?.status || StageLiveStatus.IDLE;
    
    switch (status) {
      case StageLiveStatus.RUNNING:
        statusCounts.running++;
        break;
      case StageLiveStatus.IDLE:
        statusCounts.idle++;
        break;
      case StageLiveStatus.ERROR:
        statusCounts.error++;
        break;
      case StageLiveStatus.STOPPED:
        statusCounts.stopped++;
        break;
    }
  });

  // Xác định màu sắc tổng quan dựa trên số lượng lỗi
  const getOverallStatusColor = () => {
    if (statusCounts.error > 0) return '#f44336'; // Đỏ nếu có lỗi
    if (statusCounts.running > 0) return '#4caf50'; // Xanh lá nếu có đang chạy
    return '#ff9800'; // Cam nếu chỉ có chờ
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderLeft: `5px solid ${getOverallStatusColor()}`
    }}>
      <h3 style={{ margin: '0 0 15px', fontSize: '18px' }}>{line.name}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>{statusCounts.running}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Đang chạy</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>{statusCounts.idle}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Chờ</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>{statusCounts.error}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Lỗi</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9e9e9e' }}>{statusCounts.stopped}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Đã dừng</div>
        </div>
      </div>
      
      <div style={{ fontSize: '14px', color: '#666' }}>
        {statusCounts.error > 0 && (
          <div style={{ color: '#f44336', fontWeight: 'bold', marginBottom: '5px' }}>
            Cần chú ý: Có {statusCounts.error} công đoạn đang gặp lỗi!
          </div>
        )}
        <div>
          Tổng cộng: {lineStages.length} công đoạn
        </div>
      </div>
    </div>
  );
};

// Component cho danh sách các công đoạn có lỗi
const ErrorStagesList = () => {
  let errorStages: any[] = [];
  
  // Lọc ra các công đoạn đang ở trạng thái lỗi
  Object.entries(mockStageLiveStatus).forEach(([key, info]) => {
    if (info.status === StageLiveStatus.ERROR) {
      const [lineId, stageCode] = key.split('-');
      const line = productionLines.find(l => l.id === parseInt(lineId));
      const stageInfo = getStageInfo(stageCode as any);
      
      errorStages.push({
        lineName: line?.name,
        stageName: stageInfo.name,
        stageIcon: stageInfo.icon,
        errorMessage: info.errorMessage,
        lastUpdate: info.lastUpdate
      });
    }
  });

  if (errorStages.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f1f8e9',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        color: '#4caf50'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
        <div>Không có công đoạn nào đang gặp lỗi!</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 15px', color: '#f44336' }}>Các công đoạn đang gặp lỗi</h3>
      {errorStages.map((stage, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 0',
          borderBottom: index < errorStages.length - 1 ? '1px solid #eee' : 'none'
        }}>
          <div style={{ fontSize: '24px', marginRight: '10px' }}>{stage.stageIcon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold' }}>{stage.stageName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{stage.lineName}</div>
            <div style={{ fontSize: '12px', color: '#f44336' }}>{stage.errorMessage}</div>
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {new Date(stage.lastUpdate).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian mỗi giây để hiển thị "last update"
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout title="Dashboard Tổng Quan">
      <div style={{ marginBottom: '20px', textAlign: 'right', fontSize: '14px', color: '#666' }}>
        Cập nhật lần cuối: {currentTime.toLocaleString()}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {productionLines.map(line => (
          <ProductionLineSummaryCard key={line.id} line={line} />
        ))}
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <ErrorStagesList />
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '30px' }}>
        <div>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#4caf50', borderRadius: '50%', marginRight: '5px' }}></span>
          Đang chạy
        </div>
        <div style={{ marginTop: '5px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff9800', borderRadius: '50%', marginRight: '5px' }}></span>
          Chờ
        </div>
        <div style={{ marginTop: '5px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#f44336', borderRadius: '50%', marginRight: '5px' }}></span>
          Lỗi
        </div>
        <div style={{ marginTop: '5px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#9e9e9e', borderRadius: '50%', marginRight: '5px' }}></span>
          Đã dừng
        </div>
      </div>
    </Layout>
  );
}