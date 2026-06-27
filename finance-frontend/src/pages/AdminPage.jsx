import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Users, Edit2, Trash2, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { getAllUsers, updateUser, deleteUser } from '../api/userService';
import { formatDate, getErrorMessage, ROLES } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import { PageLoader } from '../components/ui/Spinner';
import Spinner from '../components/ui/Spinner';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data?.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEditModal = (user) => {
    setEditingUser(user);
    reset({ fullName: user.fullName, email: user.email, role: user.role });
    setModalOpen(true);
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      const res = await updateUser(editingUser.id, data);
      toast.success('User updated successfully');
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? res.data?.data : u))
      );
      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(`Deactivate this user account? They will be soft-deleted.`)) return;
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      toast.success('User deactivated');
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'DELETED' } : u));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role) => {
    const classes = {
      ADMIN: 'badge badge-admin',
      ANALYST: 'badge badge-analyst',
      VIEWER: 'badge badge-viewer',
    };
    return <span className={classes[role] || 'badge'}>{role}</span>;
  };

  const getStatusBadge = (status) => (
    <span className={`badge ${status === 'ACTIVE' ? 'badge-active' : 'badge-deleted'}`}>
      {status}
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={28} color="#a78bfa" /> User Administration
          </h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage accounts, roles, and permissions
          </p>
        </div>
        <button className="btn-ghost" onClick={fetchUsers}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Users', value: users.length, color: '#a78bfa' },
            { label: 'Active', value: users.filter((u) => u.status === 'ACTIVE').length, color: '#10b981' },
            { label: 'Admins', value: users.filter((u) => u.role === 'ADMIN').length, color: '#6366f1' },
            { label: 'Analysts', value: users.filter((u) => u.role === 'ANALYST').length, color: '#f59e0b' },
            { label: 'Viewers', value: users.filter((u) => u.role === 'VIEWER').length, color: '#94a3b8' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="glass-card"
              style={{
                padding: '0.875rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <PageLoader />
      ) : (
        <div className="table-container">
          {users.length === 0 ? (
            <div className="empty-state">
              <Users size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No users found</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ opacity: user.status === 'DELETED' ? 0.5 : 1 }}>
                    <td style={{ color: '#475569', fontSize: '0.8rem' }}>#{user.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
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
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{user.username}</span>
                      </div>
                    </td>
                    <td>{user.fullName || '—'}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td style={{ color: '#475569', fontSize: '0.8rem' }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          className="btn-ghost"
                          onClick={() => openEditModal(user)}
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                          disabled={user.status === 'DELETED'}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id || user.status === 'DELETED'}
                        >
                          {deletingId === user.id
                            ? <Spinner size={13} color="#fb7185" />
                            : <Trash2 size={13} />
                          }
                          {deletingId === user.id ? '...' : 'Deactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingUser(null); }}
        title={`Edit User: ${editingUser?.username}`}
      >
        <form onSubmit={handleSubmit(handleUpdate)} noValidate>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="label" htmlFor="admin-fullname">Full Name</label>
            <input
              id="admin-fullname"
              className="input-field"
              type="text"
              placeholder="Full name"
              {...register('fullName', { required: 'Required' })}
            />
            {errors.fullName && (
              <p className="form-error"><AlertCircle size={12} /> {errors.fullName.message}</p>
            )}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              className="input-field"
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
            {errors.email && (
              <p className="form-error"><AlertCircle size={12} /> {errors.email.message}</p>
            )}
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label className="label" htmlFor="admin-role">Role</label>
            <select id="admin-role" className="input-field" {...register('role', { required: 'Required' })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.role && (
              <p className="form-error"><AlertCircle size={12} /> {errors.role.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setModalOpen(false); setEditingUser(null); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={formLoading}>
              {formLoading ? <Spinner size={16} color="white" /> : null}
              {formLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;
