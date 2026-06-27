import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Plus, Filter, Edit2, Trash2, Search, X,
  ArrowUpRight, ArrowDownRight, AlertCircle, RefreshCw, ArrowLeftRight
} from 'lucide-react';
import {
  getTransactions, createTransaction, updateTransaction, deleteTransaction,
} from '../api/transactionService';
import useAuthStore from '../store/authStore';
import {
  formatCurrency, formatDate, formatDateInput, todayISO,
  getErrorMessage, CATEGORIES,
} from '../utils/helpers';
import Modal from '../components/ui/Modal';
import { PageLoader } from '../components/ui/Spinner';
import Spinner from '../components/ui/Spinner';

const TransactionForm = ({ onSubmit, defaultValues, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: defaultValues || { type: 'EXPENSE', transactionDate: todayISO() } });

  useEffect(() => {
    reset(defaultValues || { type: 'EXPENSE', transactionDate: todayISO() });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Amount + Type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label className="label" htmlFor="tx-amount">Amount</label>
          <input
            id="tx-amount"
            className="input-field"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Must be > 0' },
              valueAsNumber: true,
            })}
          />
          {errors.amount && (
            <p className="form-error"><AlertCircle size={12} /> {errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="tx-type">Type</label>
          <select id="tx-type" className="input-field" {...register('type', { required: 'Required' })}>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          {errors.type && (
            <p className="form-error"><AlertCircle size={12} /> {errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="label" htmlFor="tx-category">Category</label>
        <select id="tx-category" className="input-field" {...register('category', { required: 'Required' })}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && (
          <p className="form-error"><AlertCircle size={12} /> {errors.category.message}</p>
        )}
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="label" htmlFor="tx-desc">Description</label>
        <input
          id="tx-desc"
          className="input-field"
          type="text"
          placeholder="Brief description"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="form-error"><AlertCircle size={12} /> {errors.description.message}</p>
        )}
      </div>

      {/* Date */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label className="label" htmlFor="tx-date">Transaction Date</label>
        <input
          id="tx-date"
          className="input-field"
          type="date"
          max={todayISO()}
          {...register('transactionDate', {
            required: 'Date is required',
            validate: (v) => v <= todayISO() || 'Date cannot be in the future',
          })}
        />
        {errors.transactionDate && (
          <p className="form-error"><AlertCircle size={12} /> {errors.transactionDate.message}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Spinner size={16} color="white" /> : null}
          {loading ? 'Saving...' : defaultValues?.id ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
};

const TransactionsPage = () => {
  const { userId, role } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);

  const canCreate = role === 'ANALYST' || role === 'ADMIN';
  const canDelete = role === 'ADMIN';

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await getTransactions(userId, params);
      setTransactions(res.data?.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    if (userId) fetchTransactions();
  }, [fetchTransactions]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      const res = await createTransaction(userId, data);
      toast.success('Transaction added!');
      setTransactions((prev) => [res.data?.data, ...prev]);
      setModalOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      const res = await updateTransaction(userId, editingTx.id, data);
      toast.success('Transaction updated!');
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTx.id ? res.data?.data : t))
      );
      setModalOpen(false);
      setEditingTx(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (txId) => {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return;
    setDeletingId(txId);
    try {
      await deleteTransaction(userId, txId);
      toast.success('Transaction deleted');
      setTransactions((prev) => prev.filter((t) => t.id !== txId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (tx) => {
    setEditingTx({ ...tx, transactionDate: formatDateInput(tx.transactionDate) });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', startDate: '', endDate: '' });
  };

  const filtered = transactions.filter((tx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.description?.toLowerCase().includes(q) ||
      tx.category?.toLowerCase().includes(q)
    );
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-ghost" onClick={fetchTransactions}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
            style={{ position: 'relative' }}
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#6366f1',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
          {canCreate && (
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          className="glass-card animate-slide-up"
          style={{ padding: '1.25rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="filter-type">Type</label>
              <select
                id="filter-type"
                className="input-field"
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="">All Types</option>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="filter-category">Category</label>
              <select
                id="filter-category"
                className="input-field"
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="filter-start">Start Date</label>
              <input
                id="filter-start"
                className="input-field"
                type="date"
                value={filters.startDate}
                max={filters.endDate || todayISO()}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="label" htmlFor="filter-end">End Date</label>
              <input
                id="filter-end"
                className="input-field"
                type="date"
                value={filters.endDate}
                max={todayISO()}
                min={filters.startDate || undefined}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>
          {activeFilterCount > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={clearFilters} style={{ fontSize: '0.8rem' }}>
                <X size={13} /> Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search bar */}
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#475569',
            pointerEvents: 'none',
          }}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Search by description or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.75rem' }}
          id="tx-search"
        />
      </div>

      {/* Table */}
      {loading ? (
        <PageLoader />
      ) : (
        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <ArrowLeftRight size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 600, color: '#94a3b8' }}>No transactions found</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {canCreate ? 'Add your first transaction using the button above.' : 'No transactions match your criteria.'}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ color: '#475569', fontSize: '0.8rem' }}>
                      {formatDate(tx.transactionDate)}
                    </td>
                    <td>
                      <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{tx.description}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          background: 'rgba(99,102,241,0.08)',
                          color: '#a78bfa',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.type === 'INCOME'
                          ? <ArrowUpRight size={10} />
                          : <ArrowDownRight size={10} />
                        }
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: tx.type === 'INCOME' ? '#10b981' : '#f43f5e',
                        }}
                      >
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {canCreate && (
                          <button
                            className="btn-ghost"
                            onClick={() => openEditModal(tx)}
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(tx.id)}
                            disabled={deletingId === tx.id}
                          >
                            {deletingId === tx.id
                              ? <Spinner size={13} color="#fb7185" />
                              : <Trash2 size={13} />
                            }
                            {deletingId === tx.id ? '...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTx(null); }}
        title={editingTx ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
          key={editingTx?.id || 'new'}
          onSubmit={editingTx ? handleUpdate : handleCreate}
          defaultValues={editingTx}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default TransactionsPage;
