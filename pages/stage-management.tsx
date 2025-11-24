// pages/stage-management.tsx
import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/Common/Button';
import { productionLines, stageAssignments } from '../data/mockData';

export default function StageManagementPage() {
  const [selectedLine, setSelectedLine] = useState(productionLines[0]);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'ep': return '🔧';
      case 'nung': return '🔥';
      case 'mai': return '✨';
      case 'dong_hop': return '📦';
      default: return '❓';
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'ep': return 'Ép';
      case 'nung': return 'Nung';
      case 'mai': return 'Mài';
      case 'dong_hop': return 'Đóng hộp';
      default: return stage;
    }
  };

  const lineStages = stageAssignments.filter(
    assignment => assignment.production_line_id === selectedLine.id && assignment.is_active
  );

  return (
    <Layout title="Quản lý công đoạn">
      {/* Production Line Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        borderBottom: '1px solid #ecf0f1',
        paddingBottom: '15px'
      }}>
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

      {/* Stages Grid */}
      <div className="stats-grid">
        {['ep', 'nung', 'mai', 'dong_hop'].map((stage) => {
          const assignment = lineStages.find(s => s.stage === stage);
          return (
            <div key={stage} className="stat-card">
              <div className="stat-card-header">
                <div className="stat-title">{getStageName(stage)}</div>
                <div className="stat-icon blue">{getStageIcon(stage)}</div>
              </div>
              {assignment ? (
                <>
                  <div className="stat-value">
                    {assignment.actual_quantity.toLocaleString()}
                    <span style={{ fontSize: '16px', fontWeight: '400', marginLeft: '5px' }}>
                      m²
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '15px' }}>
                    {assignment.brick_type.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#95a5a6' }}>
                    Kế hoạch: {assignment.production_plan.plan_code}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <Button className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      Chi tiết
                    </Button>
                    <Button className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      Dừng
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="stat-value" style={{ color: '#95a5a6' }}>
                    Không hoạt động
                  </div>
                  <div style={{ fontSize: '14px', color: '#bdc3c7', marginBottom: '15px' }}>
                    Chưa có công đoạn đang chạy
                  </div>
                  <Button className="btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                    Khởi động
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}