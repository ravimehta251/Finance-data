import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/admin': 'User Administration',
};

const Topbar = () => {
  const location = useLocation();
  const { user, role } = useAuthStore();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Finance IQ';

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header
      style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #1f2d4a',
        background: 'rgba(10, 22, 40, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#f1f5f9',
            margin: 0,
          }}
        >
          {pageTitle}
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>{timeStr}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '0.625rem',
            padding: '0.5rem',
            color: '#a78bfa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <Bell size={16} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.5rem 0.875rem',
            background: 'rgba(26, 37, 64, 0.6)',
            border: '1px solid #1f2d4a',
            borderRadius: '0.75rem',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'white',
            }}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
              {user?.username}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 600 }}>
              {role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
