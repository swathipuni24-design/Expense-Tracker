import React from 'react';

export default function Navbar({ activeView, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">₹</span>
        <span className="navbar-title">Expense Tracker</span>
      </div>
      <div className="navbar-links">
        <button
          className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${activeView === 'expenses' ? 'active' : ''}`}
          onClick={() => onNavigate('expenses')}
        >
          Expenses
        </button>
        <button
          className={`nav-link nav-link-primary ${activeView === 'add' ? 'active' : ''}`}
          onClick={() => onNavigate('add')}
        >
          + Add Expense
        </button>
      </div>
    </nav>
  );
}
