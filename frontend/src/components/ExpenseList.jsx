import React from 'react';
import ExpenseCard from './ExpenseCard';
import SearchFilter from './SearchFilter';

export default function ExpenseList({
  expenses,
  loading,
  filters,
  onFilterChange,
  onResetFilters,
  onEdit,
  onDelete,
}) {
  return (
    <div className="expense-list-container">
      <h2 className="section-title">Your Expenses</h2>

      <SearchFilter filters={filters} onFilterChange={onFilterChange} onReset={onResetFilters} />

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found.</p>
          <span>Try adjusting your search or filters, or add a new expense.</span>
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
