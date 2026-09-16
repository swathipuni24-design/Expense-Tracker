import React from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../api';

export default function SearchFilter({ filters, onFilterChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="search-filter-bar">
      <div className="search-box">
        <input
          type="text"
          name="search"
          placeholder="Search expenses by title, category or description..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filter-controls">
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="payment_method" value={filters.payment_method} onChange={handleChange}>
          <option value="">All Payment Methods</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>

        <div className="filter-date-range">
          <label>From</label>
          <input type="date" name="date_from" value={filters.date_from} onChange={handleChange} />
          <label>To</label>
          <input type="date" name="date_to" value={filters.date_to} onChange={handleChange} />
        </div>

        <div className="filter-amount-range">
          <label>Min ₹</label>
          <input type="number" name="min_amount" min="0" value={filters.min_amount} onChange={handleChange} placeholder="0" />
          <label>Max ₹</label>
          <input type="number" name="max_amount" min="0" value={filters.max_amount} onChange={handleChange} placeholder="Any" />
        </div>

        <button type="button" className="btn btn-outline" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
}
