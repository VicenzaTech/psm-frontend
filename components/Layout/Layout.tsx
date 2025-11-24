// components/Layout/Layout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/useAuthStore';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = "Tổng quan sản xuất" }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const { user } = useAuthStore()
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', icon: '📊', text: 'Tổng quan', href: '/' },
    { id: 'plans', icon: '📋', text: 'Kế hoạch sản xuất', href: '/plans' },
    { id: 'stages', icon: '⚙️', text: 'Quản lý công đoạn', href: '/stage-management' },
    { id: 'brick-types', icon: '🧱', text: 'Quản lý dòng gạch', href: '/brick-types' },
    { id: 'activity-logs', icon: '📝', text: 'Lịch sử hoạt động', href: '/activity-logs' },
    // { id: 'quality', icon: '✅', text: 'Quản lý chất lượng', href: '/quality' },
    // { id: 'reports', icon: '📈', text: 'Báo cáo', href: '/reports' },
    // { id: 'devices', icon: '🔧', text: 'Thiết bị IoT', href: '/devices' },
    // { id: 'users', icon: '👥', text: 'Quản lý người dùng', href: '/users' },
    // { id: 'settings', icon: '⚙️', text: 'Cài đặt', href: '/settings' },
  ];

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    if (user) {
      router.push('/login');
    }
  }, [user]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🏭</div>
            <div className="logo-text">Factory Manager</div>
          </div>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`menu-item ${router.pathname === item.href ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <button className="notification-btn" onClick={toggleSidebar}>
            <span>☰</span>
          </button>
          
          <h1 className="header-title">{title}</h1>
          
          <div className="header-actions">
            <button className="notification-btn">
              <span>🔔</span>
              <span className="notification-badge"></span>
            </button>
            
            <div className="user-info">
              <div className="user-avatar">AD</div>
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};