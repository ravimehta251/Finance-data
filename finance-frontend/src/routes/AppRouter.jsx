import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './ProtectedRoute';
import useAuthStore from '../store/authStore';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import AdminPage from '../pages/AdminPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import Layout from '../components/layout/Layout';

const AppRouter = () => {
  const { token, role } = useAuthStore();

  const defaultRoute = () => {
    if (!token) return '/login';
    if (role === 'VIEWER') return '/transactions';
    return '/dashboard';
  };

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1f3d',
            color: '#f1f5f9',
            border: '1px solid #1f2d4a',
            borderRadius: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f1f3d' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#0f1f3d' },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={defaultRoute()} replace />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="transactions"
            element={
              <ProtectedRoute allowedRoles={['VIEWER', 'ANALYST', 'ADMIN']}>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
