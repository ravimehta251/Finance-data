import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, TrendingUp, AlertCircle } from 'lucide-react';
import { login } from '../api/authService';
import useAuthStore from '../store/authStore';
import { getErrorMessage } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: storeLogin, role } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      const payload = res.data?.data;
      storeLogin(payload);
      toast.success(`Welcome back, ${payload.username}!`);
      // Redirect based on role
      if (payload.role === 'VIEWER') {
        navigate('/transactions');
      } else {
        navigate('/dashboard');
      }
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
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
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
          bottom: '-200px',
          left: '-200px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="animate-slide-up"
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
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
            FinanceIQ
          </h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
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
            {/* Username */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                className="input-field"
                type="text"
                placeholder="Enter your username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className="form-error">
                  <AlertCircle size={12} /> {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  style={{ paddingRight: '3rem' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
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
                <p className="form-error">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {loading ? <Spinner size={18} color="white" /> : <LogIn size={18} />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#475569' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
