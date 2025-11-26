// components/Layout/Layout.tsx
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/useAuthStore';
import style from '@/styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = "Tổng quan sản xuất" }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    // Switch to 'click' so the toggle onClick fires before the outside handler.
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', text: 'Tổng quan', href: '/dashboard' },
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
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const toggleDropdown = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'stopPropagation' in e) {
      (e as React.MouseEvent).stopPropagation?.(); // Prevent click from reaching document
    }
    setShowDropdown((prev) => !prev);
  };

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
            
            <div 
              className={`user-info ${showDropdown ? 'active' : ''}`}
              onClick={toggleDropdown}
              onMouseDown={(e) => e.stopPropagation()} // Prevent the document click from closing on mousedown
              role="button"
              aria-haspopup="menu"
              aria-expanded={showDropdown}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Toggle on Enter or space
                  e.preventDefault();
                  toggleDropdown(e);
                }
              }}
              ref={dropdownRef}
            >
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.username || 'User'}</span>
                <span className="user-role">{user?.role || 'User'}</span>
              </div>
              <div className="dropdown-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {showDropdown && (
                <div className="user-dropdown" role="menu" aria-label="User menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="dropdown-username">{user?.username || 'User'}</div>
                      <div className="dropdown-email">{user?.email || ''}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" role="menuitem" onMouseDown={(e) => e.stopPropagation()} onClick={() => {
                    router.push('/profile');
                    setShowDropdown(false);
                  }} onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push('/profile');
                      setShowDropdown(false);
                    }
                  }} tabIndex={0}>
                    <div className="dropdown-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Hồ sơ của tôi</span>
                  </div>
                  <div className="dropdown-item" role="menuitem" onMouseDown={(e) => e.stopPropagation()} onClick={handleLogout} onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleLogout();
                    }
                  }} tabIndex={0}>
                    <div className="dropdown-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Đăng xuất</span>
                  </div>
                </div>
              )}
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