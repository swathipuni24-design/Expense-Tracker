import React from 'react';

const CATEGORY_ICONS = {
  Food: '🍔',
  Travel: '✈️',
  Shopping: '🛍️',
  Bills: '🧾',
  Education: '📚',
  Healthcare: '🏥',
  Entertainment: '🎬',
  Other: '📦',
};

function formatCurrency(value) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <div className="expense-card">
      <div className="expense-card-icon">{CATEGORY_ICONS[expense.category] || '💰'}</div>
      <div className="expense-card-body">
        <div className="expense-card-header">
          <h4>{expense.title}</h4>
          <span className="expense-amount">{formatCurrency(expense.amount)}</span>
        </div>
        <div className="expense-card-meta">
          <span className="badge badge-category">{expense.category}</span>
          <span className="badge badge-payment">{expense.payment_method}</span>
          <span className="expense-date">{formatDate(expense.expense_date)}</span>
        </div>
        {expense.description && <p className="expense-description">{expense.description}</p>}
      </div>
      <div className="expense-card-actions">
        <button className="btn-icon btn-edit" onClick={() => onEdit(expense)} title="Edit expense">
          ✏️ Edit
        </button>
        <button className="btn-icon btn-delete" onClick={() => onDelete(expense)} title="Delete expense">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
