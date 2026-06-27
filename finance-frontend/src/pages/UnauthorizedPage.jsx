import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050d1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px' }} className="animate-fade-in">
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
          }}
        >
          <ShieldOff size={36} color="#fb7185" />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#f43f5e', marginBottom: '0.5rem' }}>403</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>
          Access Denied
        </h2>
        <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: 1.6 }}>
          You don't have permission to view this page. Contact your administrator if you believe this is a mistake.
        </p>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
