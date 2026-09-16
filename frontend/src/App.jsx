import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from './api';

const EMPTY_FILTERS = {
  search: '',
  category: '',
  payment_method: '',
  date_from: '',
  date_to: '',
  min_amount: '',
  max_amount: '',
};

function buildParams(filters) {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    window.clearTimeout(showNotification._t);
    showNotification._t = window.setTimeout(() => setNotification(null), 4000);
  };

  const fetchExpenses = useCallback(async () => {
    setLoadingExpenses(true);
    try {
      const params = buildParams(filters);
      const data = await getExpenses(params);
      const results = Array.isArray(data) ? data : data.results || [];
      setExpenses(results);
      setConnectionError(false);
    } catch (err) {
      if (err.status === 0) {
        setConnectionError(true);
        showNotification(err.message, 'error');
      } else {
        showNotification(err.message || 'Failed to load expenses.', 'error');
      }
    } finally {
      setLoadingExpenses(false);
    }
  }, [filters]);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const params = buildParams(filters);
      const data = await getExpenseSummary(params);
      setSummary(data);
      setConnectionError(false);
    } catch (err) {
      if (err.status === 0) {
        setConnectionError(true);
      }
      showNotification(err.message || 'Failed to load dashboard.', 'error');
    } finally {
      setLoadingSummary(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleNavigate = (view) => {
    if (view !== 'add') {
      setEditingExpense(null);
    }
    setActiveView(view);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
        showNotification('Expense updated successfully!', 'success');
      } else {
        await createExpense(formData);
        showNotification('Expense added successfully!', 'success');
      }
      setEditingExpense(null);
      await fetchExpenses();
      await fetchSummary();
      setActiveView('expenses');
    } catch (err) {
      showNotification(err.message || 'Failed to save expense.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveView('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setActiveView('expenses');
  };

  const requestDelete = (expense) => {
    setDeleteTarget(expense);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget.id);
      showNotification('Expense deleted successfully!', 'success');
      setExpenses((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      await fetchSummary();
    } catch (err) {
      showNotification(err.message || 'Failed to delete expense.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const handleResetFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="app">
      <Navbar activeView={activeView} onNavigate={handleNavigate} />

      {connectionError && (
        <div className="banner banner-error">
          ⚠ Unable to connect to the server. Please make sure the Django backend is running at the configured API URL, then try again.
        </div>
      )}

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="main-content">
        {activeView === 'dashboard' && <Dashboard summary={summary} loading={loadingSummary} />}

        {activeView === 'expenses' && (
          <ExpenseList
            expenses={expenses}
            loading={loadingExpenses}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            onEdit={handleEdit}
            onDelete={requestDelete}
          />
        )}

        {activeView === 'add' && (
          <ExpenseForm
            editingExpense={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            submitting={submitting}
          />
        )}
      </main>

      {deleteTarget && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Expense?</h3>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
              <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Expense Tracker &copy; {new Date().getFullYear()} — Full Stack CRUD Application (React + Django REST Framework)</p>
      </footer>
    </div>
  );
}
