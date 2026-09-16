import axios from 'axios';

// Centralized API base URL, configurable via environment variable so it
// is never hard-coded across multiple components.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Normalizes errors from the backend (or network failures) into a
// consistent, user-friendly shape the UI can display directly.
function normalizeError(error) {
  if (error.response) {
    // Backend responded with an error status code
    const data = error.response.data;
    if (data && data.errors) {
      const messages = [];
      Object.entries(data.errors).forEach(([field, fieldErrors]) => {
        const errArray = Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors];
        errArray.forEach((msg) => messages.push(`${field}: ${msg}`));
      });
      return { message: messages.join(' | ') || 'Validation failed.', status: error.response.status, fieldErrors: data.errors };
    }
    if (data && data.detail) {
      return { message: data.detail, status: error.response.status };
    }
    return { message: 'Something went wrong on the server. Please try again.', status: error.response.status };
  }
  if (error.request) {
    // No response received (server down, network issue)
    return { message: 'Unable to connect to the server. Please make sure the backend is running and try again.', status: 0 };
  }
  return { message: error.message || 'An unexpected error occurred.', status: -1 };
}

/**
 * Fetch a list of expenses. Accepts an optional params object for
 * search and filtering, e.g. { search: 'coffee', category: 'Food' }.
 */
export async function getExpenses(params = {}) {
  try {
    const response = await apiClient.get('/expenses/', { params });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/** Fetch a single expense by id. */
export async function getExpense(id) {
  try {
    const response = await apiClient.get(`/expenses/${id}/`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/** Create a new expense. */
export async function createExpense(expenseData) {
  try {
    const response = await apiClient.post('/expenses/', expenseData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/** Update an existing expense (partial update via PATCH). */
export async function updateExpense(id, expenseData) {
  try {
    const response = await apiClient.patch(`/expenses/${id}/`, expenseData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/** Delete an expense by id. */
export async function deleteExpense(id) {
  try {
    const response = await apiClient.delete(`/expenses/${id}/`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/** Fetch dashboard summary data (totals + category breakdown). */
export async function getExpenseSummary(params = {}) {
  try {
    const response = await apiClient.get('/expenses/summary/', { params });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other'];
export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default apiClient;
