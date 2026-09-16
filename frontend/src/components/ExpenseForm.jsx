import React, { useEffect, useState } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../api';

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: '',
  payment_method: '',
  expense_date: '',
  description: '',
};

function todayISO() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

/**
 * Client-side validation. Mirrors the backend validation rules so the
 * user gets instant feedback, but the backend still re-validates
 * everything independently.
 */
function validateForm(values) {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = 'Expense title is required.';
  } else if (values.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters long.';
  }

  if (values.amount === '' || values.amount === null || values.amount === undefined) {
    errors.amount = 'Amount is required.';
  } else if (isNaN(Number(values.amount))) {
    errors.amount = 'Amount must be numeric.';
  } else if (Number(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0.';
  }

  if (!values.category) {
    errors.category = 'Please select a category.';
  }

  if (!values.payment_method) {
    errors.payment_method = 'Please select a payment method.';
  }

  if (!values.expense_date) {
    errors.expense_date = 'Expense date is required.';
  } else if (isNaN(new Date(values.expense_date).getTime())) {
    errors.expense_date = 'Please enter a valid date.';
  }

  if (values.description && values.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  return errors;
}

export default function ExpenseForm({ editingExpense, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setValues({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || '',
        payment_method: editingExpense.payment_method || '',
        expense_date: editingExpense.expense_date || '',
        description: editingExpense.description || '',
      });
    } else {
      setValues({ ...EMPTY_FORM, expense_date: todayISO() });
    }
    setErrors({});
    setTouched({});
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateForm({ ...values }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    setTouched({
      title: true,
      amount: true,
      category: true,
      payment_method: true,
      expense_date: true,
      description: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      amount: Number(values.amount).toFixed(2),
    });
  };

  return (
    <div className="expense-form-container">
      <h2 className="section-title">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Expense Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Grocery shopping"
              className={touched.title && errors.title ? 'input-error' : ''}
            />
            {touched.title && errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0.01"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              className={touched.amount && errors.amount ? 'input-error' : ''}
            />
            {touched.amount && errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.category && errors.category ? 'input-error' : ''}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {touched.category && errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="payment_method">Payment Method *</label>
            <select
              id="payment_method"
              name="payment_method"
              value={values.payment_method}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.payment_method && errors.payment_method ? 'input-error' : ''}
            >
              <option value="">Select payment method</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            {touched.payment_method && errors.payment_method && (
              <span className="field-error">{errors.payment_method}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expense_date">Date *</label>
            <input
              type="date"
              id="expense_date"
              name="expense_date"
              value={values.expense_date}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.expense_date && errors.expense_date ? 'input-error' : ''}
            />
            {touched.expense_date && errors.expense_date && (
              <span className="field-error">{errors.expense_date}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            maxLength="500"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Optional notes about this expense..."
            className={touched.description && errors.description ? 'input-error' : ''}
          />
          <span className="char-count">{values.description.length}/500</span>
          {touched.description && errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
