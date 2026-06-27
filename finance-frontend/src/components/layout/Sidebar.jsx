import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Users, LogOut,
  ChevronLeft, ChevronRight, TrendingUp, Shield
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { role, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['ANALYST', 'ADMIN'],
    },
    {
      to: '/transactions',
      icon: ArrowLeftRight,
      label: 'Transactions',
      roles: ['VIEWER', 'ANALYST', 'ADMIN'],
    },
    {
      to: '/admin',
      icon: Users,
      label: 'User Admin',
      roles: ['ADMIN'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  const getRoleBadgeClass = () => {
    if (role === 'ADMIN') return 'badge badge-admin';
    if (role === 'ANALYST') return 'badge badge-analyst';
    return 'badge badge-viewer';
  };

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '240px',
        transition: 'width 0.3s ease',
        minHeight: '100vh',
        background: 'rgba(10, 22, 40, 0.95)',
        borderRight: '1px solid #1f2d4a',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0.75rem',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.25rem',
          marginBottom: '2rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <TrendingUp size={18} color="white" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              FinanceIQ
            </div>
            <div style={{ fontSize: '0.65rem', color: '#475569', whiteSpace: 'nowrap' }}>
              Smart Finance Tracking
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {visibleNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={collapsed ? label : undefined}
            style={{ justifyContent: collapsed ? 'center' : undefined }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ borderTop: '1px solid #1f2d4a', paddingTop: '1rem', marginTop: '1rem' }}>
        {!collapsed && user && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '0.75rem',
              background: 'rgba(99, 102, 241, 0.05)',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#f1f5f9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.username}
                </div>
              </div>
            </div>
            <span className={getRoleBadgeClass()}>
              {role === 'ADMIN' && <Shield size={10} />}
              {role}
            </span>
          </div>
        )}
        <button
          className="sidebar-link"
          onClick={handleLogout}
          style={{ justifyContent: collapsed ? 'center' : undefined, color: '#fb7185' }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-12px',
          transform: 'translateY(-50%)',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#1f2d4a',
          border: '1px solid #2d3f63',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#6366f1';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#1f2d4a';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
