import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, TrendingUp, AlertCircle } from 'lucide-react';
import { register as registerUser } from '../api/authService';
import { getErrorMessage, ROLES } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { role: 'VIEWER' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050d1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="animate-slide-up"
        style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 40px rgba(99,102,241,0.4)',
            }}
          >
            <TrendingUp size={28} color="white" />
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem',
            }}
          >
            Create Account
          </h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>
            Join FinanceIQ today
          </p>
        </div>

        <div
          style={{
            background: 'rgba(26, 37, 64, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: '1.25rem',
            padding: '2rem',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="label" htmlFor="reg-username">Username</label>
                <input
                  id="reg-username"
                  className="input-field"
                  type="text"
                  placeholder="johndoe"
                  {...register('username', {
                    required: 'Required',
                    minLength: { value: 3, message: 'Min 3 chars' },
                  })}
                />
                {errors.username && (
                  <p className="form-error"><AlertCircle size={12} /> {errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="label" htmlFor="reg-fullname">Full Name</label>
                <input
                  id="reg-fullname"
                  className="input-field"
                  type="text"
                  placeholder="John Doe"
                  {...register('fullName', { required: 'Required' })}
                />
                {errors.fullName && (
                  <p className="form-error"><AlertCircle size={12} /> {errors.fullName.message}</p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                className="input-field"
                type="email"
                placeholder="john@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="form-error"><AlertCircle size={12} /> {errors.email.message}</p>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  style={{ paddingRight: '3rem' }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error"><AlertCircle size={12} /> {errors.password.message}</p>
              )}
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label className="label" htmlFor="reg-role">Role</label>
              <select
                id="reg-role"
                className="input-field"
                {...register('role', { required: 'Role is required' })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.role && (
                <p className="form-error"><AlertCircle size={12} /> {errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {loading ? <Spinner size={18} color="white" /> : <UserPlus size={18} />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
