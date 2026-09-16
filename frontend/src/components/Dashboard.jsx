import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#64748b'];

function formatCurrency(value) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Dashboard({ summary, loading }) {
  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="dashboard">
        <div className="empty-state">No data available yet.</div>
      </div>
    );
  }

  const { total_amount, total_count, highest_expense, category_summary } = summary;
  const categoryEntries = Object.entries(category_summary || {}).sort((a, b) => b[1] - a[1]);
  const chartData = categoryEntries.map(([category, amount]) => ({ category, amount: Number(amount) }));

  return (
    <div className="dashboard">
      <h2 className="section-title">Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value">{formatCurrency(total_amount)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Number of Expenses</span>
          <span className="stat-value">{total_count} Expenses</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Highest Expense</span>
          {highest_expense ? (
            <>
              <span className="stat-value">{formatCurrency(highest_expense.amount)}</span>
              <span className="stat-sub">{highest_expense.title} ({highest_expense.category})</span>
            </>
          ) : (
            <span className="stat-value">—</span>
          )}
        </div>
        <div className="stat-card">
          <span className="stat-label">Categories Used</span>
          <span className="stat-value">{categoryEntries.length}</span>
        </div>
      </div>

      {categoryEntries.length > 0 ? (
        <div className="dashboard-charts">
          <div className="chart-card">
            <h3>Category-wise Spending</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Spending Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="empty-state">No expenses yet. Add your first expense to see the dashboard come alive.</div>
      )}

      {categoryEntries.length > 0 && (
        <div className="category-summary-list">
          <h3>Category Summary</h3>
          <table className="summary-table">
            <tbody>
              {categoryEntries.map(([category, amount], index) => (
                <tr key={category}>
                  <td>
                    <span className="category-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {category}
                  </td>
                  <td className="summary-amount">{formatCurrency(amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
