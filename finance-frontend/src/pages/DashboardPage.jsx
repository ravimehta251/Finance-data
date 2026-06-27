import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardSummary, getCategoryAnalysis } from '../api/dashboardService';
import { getTransactions } from '../api/transactionService';
import useAuthStore from '../store/authStore';
import { formatCurrency, formatDate, getErrorMessage, CHART_COLORS } from '../utils/helpers';
import { PageLoader } from '../components/ui/Spinner';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, trend }) => (
  <div className={`glass-card stat-card ${colorClass}`}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <p style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1 }}>
          {value}
        </p>
      </div>
      <div
        style={{
          padding: '0.75rem',
          borderRadius: '0.75rem',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <Icon size={20} color="#a78bfa" />
      </div>
    </div>
    {subtitle && (
      <p style={{ fontSize: '0.8rem', color: '#475569' }}>{subtitle}</p>
    )}
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#0f1f3d',
          border: '1px solid #1f2d4a',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
        }}
      >
        <p style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].name}</p>
        <p style={{ color: '#a78bfa' }}>{formatCurrency(payload[0].value)}</p>
        <p style={{ color: '#475569' }}>{payload[0].payload.percentage}</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { userId } = useAuthStore();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [summaryRes, categoryRes, txRes] = await Promise.all([
          getDashboardSummary(userId),
          getCategoryAnalysis(userId),
          getTransactions(userId),
        ]);

        setSummary(summaryRes.data?.data);

        const catData = categoryRes.data?.data?.categories || {};
        const chartData = Object.entries(catData).map(([name, val]) => ({
          name,
          value: val.total,
          percentage: val.percentage,
          count: val.count,
        }));
        setCategories(chartData);

        const txs = txRes.data?.data || [];
        setRecentTransactions(txs.slice(0, 8));
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchAll();
  }, [userId]);

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatCard
          title="Net Balance"
          value={formatCurrency(summary?.netBalance ?? 0)}
          icon={DollarSign}
          colorClass="stat-card-balance"
          subtitle="Total financial position"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.totalIncome ?? 0)}
          icon={TrendingUp}
          colorClass="stat-card-income"
          subtitle="All income transactions"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.totalExpense ?? 0)}
          icon={TrendingDown}
          colorClass="stat-card-expense"
          subtitle="All expense transactions"
        />
        <StatCard
          title="Transactions"
          value={summary?.transactionCount ?? 0}
          icon={Activity}
          colorClass="stat-card-count"
          subtitle="Total recorded entries"
        />
      </div>

      {/* Charts + Recent Transactions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: categories.length > 0 ? '1fr 1.4fr' : '1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Pie Chart */}
        {categories.length > 0 && (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              Spending by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <Activity size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(15, 31, 61, 0.5)',
                    border: '1px solid rgba(31, 45, 74, 0.5)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                    e.currentTarget.style.background = 'rgba(99,102,241,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(31, 45, 74, 0.5)';
                    e.currentTarget.style.background = 'rgba(15, 31, 61, 0.5)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: tx.type === 'INCOME'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(244, 63, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {tx.type === 'INCOME'
                        ? <ArrowUpRight size={16} color="#10b981" />
                        : <ArrowDownRight size={16} color="#f43f5e" />
                      }
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.125rem' }}>
                        {tx.description}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: '#475569' }}>
                        {tx.category} · {formatDate(tx.transactionDate)}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: tx.type === 'INCOME' ? '#10b981' : '#f43f5e',
                    }}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
