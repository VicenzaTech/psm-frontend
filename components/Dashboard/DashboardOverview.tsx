// components/Dashboard/DashboardOverview.tsx
import React from 'react';

export const DashboardOverview: React.FC = () => {
  const statsData = [
    {
      title: 'Sản lượng hôm nay',
      value: '12,450',
      unit: 'm²',
      change: '+8.5%',
      changeType: 'positive',
      icon: '📦',
      iconColor: 'blue'
    },
    {
      title: 'Tỷ lệ đạt',
      value: '93.7',
      unit: '%',
      change: '+1.2%',
      changeType: 'positive',
      icon: '✅',
      iconColor: 'green'
    },
    {
      title: 'Tỷ lệ hao hụt',
      value: '6.3',
      unit: '%',
      change: '+0.5%',
      changeType: 'negative',
      icon: '⚠️',
      iconColor: 'orange'
    },
    {
      title: 'Kế hoạch chạy',
      value: '4/6',
      unit: '',
      change: '2 kế hoạch chờ',
      changeType: 'neutral',
      icon: '📋',
      iconColor: 'red'
    }
  ];

  const productionLines = [
    { name: 'Dây chuyền 1', product: 'Gạch 300x600 Porcelain', target: 5000, actual: 4200, progress: 84 },
    { name: 'Dây chuyền 2', product: 'Gạch 600x600 Granite', target: 6000, actual: 3800, progress: 63 },
    { name: 'Dây chuyền 3', product: 'Gạch 400x800 Ceramic', target: 4500, actual: 3200, progress: 71 },
    { name: 'Dây chuyền 4', product: 'Gạch 800x800 Porcelain', target: 5500, actual: 2900, progress: 53 },
  ];

  const qualityData = [
    { label: 'Loại A1', value: 65, color: 'a1' },
    { label: 'Loại A2', value: 20, color: 'a2' },
    { label: 'Loại B1', value: 8, color: 'b1' },
    { label: 'Loại B2', value: 4, color: 'b2' },
    { label: 'Loại C', value: 3, color: 'c' },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-title">{stat.title}</div>
              <div className={`stat-icon ${stat.iconColor}`}>{stat.icon}</div>
            </div>
            <div className="stat-value">
              {stat.value}
              <span style={{ fontSize: '16px', fontWeight: '400', marginLeft: '5px' }}>
                {stat.unit}
              </span>
            </div>
            <div className={`stat-change ${stat.changeType}`}>
              <span>{stat.changeType === 'positive' ? '↑' : stat.changeType === 'negative' ? '↓' : '→'}</span>
              <span>{stat.change}</span>
              <span style={{ marginLeft: '5px', color: '#95a5a6' }}>
                so với hôm qua
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Sections */}
      <div className="dashboard-grid">
        {/* Production by Line */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Sản lượng theo dòng sản phẩm</h3>
            <a href="#" className="section-action">Xem tất cả →</a>
          </div>
          <table className="production-table">
            <thead>
              <tr>
                <th>Dây chuyền</th>
                <th>Sản phẩm</th>
                <th>Tiến độ</th>
              </tr>
            </thead>
            <tbody>
              {productionLines.map((line, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{line.name}</td>
                  <td>{line.product}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${line.progress}%` }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {line.actual}/{line.target} m²
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quality Distribution */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Phân bố chất lượng</h3>
            <a href="#" className="section-action">Chi tiết →</a>
          </div>
          <div className="quality-chart">
            {qualityData.map((item, index) => (
              <div key={index} className="quality-item">
                <div className="quality-label">{item.label}</div>
                <div className="quality-bar-container">
                  <div 
                    className={`quality-bar-fill ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <div className="quality-value">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};