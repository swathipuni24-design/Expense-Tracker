# Expense Tracker – Full Stack CRUD Web Application

A complete full-stack **Expense Tracker** built with **React** (frontend) and **Django + Django REST Framework** (backend), backed by a **MySQL** (or SQLite for local testing) database. This project demonstrates complete CRUD functionality, REST API design, input validation, search & filtering, a dashboard, and a responsive, professional UI — suitable for a DBMS / full-stack web application practical assignment.

---

## 1. Introduction

Manually tracking day-to-day personal expenses using notebooks or spreadsheets is error-prone and hard to analyze. This project builds a web-based Expense Tracker that lets a user record, view, search, filter, edit and delete their expenses, and instantly see a dashboard summary of their spending — all backed by a relational database accessed through a REST API.

## 2. Problem Statement

There is a need for a simple, reliable system where users can digitally log their expenses, categorize them, track how much they spend by category and payment method, and retrieve/search past records quickly — instead of relying on manual, unstructured record-keeping.

## 3. Objectives

- Build a relational database model to store expense records.
- Expose the data through a RESTful API with complete CRUD operations.
- Build a responsive React frontend that consumes the API via Axios.
- Implement both frontend and backend validation.
- Provide search, filtering, and a summary dashboard.
- Demonstrate professional software practices: environment variables, `.gitignore`, error handling, and documentation.

## 4. Scope

The application covers single-user personal expense tracking: adding, viewing, searching, filtering, editing, and deleting expenses, plus a dashboard with totals and category-wise breakdowns. Authentication/multi-user support is listed under Future Enhancements.

## 5. Features

- ✅ Add, view, edit, delete expenses (full CRUD)
- ✅ Search by title, category, or description
- ✅ Filter by category, payment method, date range, and amount range
- ✅ Dashboard: total spent, expense count, highest expense, category-wise summary, and charts
- ✅ Frontend **and** backend validation with clear error messages
- ✅ REST API with proper HTTP status codes (200, 201, 204, 400, 404)
- ✅ Confirmation dialog before deleting
- ✅ Success/error toast notifications
- ✅ Loading indicators and empty-state messages
- ✅ Fully responsive UI (desktop, tablet, mobile)
- ✅ Django Admin panel for managing expenses
- ✅ CORS configured for local frontend-backend communication
- ✅ Environment-variable based configuration (no hard-coded secrets)
- ✅ Ready for MySQL, with SQLite fallback for quick local testing

## 6. Technology Stack

**Frontend:** React 18, JavaScript (ES6+), HTML5, CSS3, Axios, Vite, Recharts (charts)

**Backend:** Python 3, Django 5, Django REST Framework, django-cors-headers, django-filter

**Database:** MySQL (primary) — SQLite supported for local testing without MySQL installed

**Tools:** Postman (API testing), Git/GitHub (version control), VS Code

## 7. Folder Structure

```
ExpenseTracker/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── expenses/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       ├── apps.py
│       ├── tests.py
│       └── migrations/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── components/
│       │   ├── ExpenseForm.jsx
│       │   ├── ExpenseList.jsx
│       │   ├── ExpenseCard.jsx
│       │   ├── SearchFilter.jsx
│       │   ├── Dashboard.jsx
│       │   └── Navbar.jsx
│       └── styles/
│           └── style.css
│
├── README.md
├── API_DOCUMENTATION.md
└── .gitignore
```

## 8. System Architecture

```
User
  ↓
React Frontend  (renders UI, manages state, validates input)
  ↓
Axios           (HTTP client — sends JSON requests to the API)
  ↓
Django REST API (routes requests, validates data, applies business rules)
  ↓
Django ORM      (translates Python objects into SQL queries)
  ↓
MySQL Database  (persists expense records)
```

- **React Frontend**: Renders the Dashboard, Expense List, and Expense Form; manages local UI state (loading, notifications, filters); calls the backend through `src/api.js`.
- **Axios**: A centralized HTTP client wraps every request/response, normalizing errors into user-friendly messages.
- **Django REST Framework**: Exposes `/api/expenses/` endpoints implementing CRUD, search, filtering and a summary aggregation endpoint.
- **Django ORM**: Maps the `Expense` Python model to SQL tables/queries, preventing raw SQL / SQL-injection risk.
- **MySQL**: Stores all expense records persistently as rows in the `expenses_expense` table.

## 9. Database Design

**Table: `expenses_expense`**

| Column          | Type            | Constraints                     |
|------------------|-----------------|----------------------------------|
| id               | BIGINT          | Primary Key, Auto Increment     |
| title            | VARCHAR(100)    | NOT NULL                        |
| amount           | DECIMAL(10,2)   | NOT NULL, > 0                   |
| category         | VARCHAR(50)     | NOT NULL, choice-restricted     |
| payment_method   | VARCHAR(50)     | NOT NULL, choice-restricted     |
| expense_date     | DATE            | NOT NULL                        |
| description      | TEXT            | NULLABLE (max 500 chars)        |
| created_at       | DATETIME        | Auto-set on creation             |
| updated_at       | DATETIME        | Auto-updated on every save       |

`id` is the primary key (auto-incrementing `BigAutoField`), uniquely identifying every expense row. `DecimalField` is used for `amount` (rather than float) to avoid floating-point rounding errors — essential for financial data in a DBMS context.

## 10. CRUD Operations

| Operation | UI Action | HTTP Request |
|-----------|-----------|---------------|
| Create | "Add Expense" form submit | `POST /api/expenses/` |
| Read | Dashboard / Expense List view | `GET /api/expenses/`, `GET /api/expenses/{id}/` |
| Update | "Edit" button + form submit | `PATCH /api/expenses/{id}/` |
| Delete | "Delete" button + confirmation | `DELETE /api/expenses/{id}/` |

## 11. REST API Documentation

See **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for the full endpoint reference, sample request/response bodies, Postman testing steps, and the test case table.

Quick reference:

| Operation | Method | Endpoint | Success |
|-----------|--------|----------|---------|
| Create | POST | `/api/expenses/` | 201 |
| Read all | GET | `/api/expenses/` | 200 |
| Read one | GET | `/api/expenses/{id}/` | 200 |
| Update | PUT/PATCH | `/api/expenses/{id}/` | 200 |
| Delete | DELETE | `/api/expenses/{id}/` | 204 |
| Dashboard | GET | `/api/expenses/summary/` | 200 |

## 12. Validation

Implemented on **both** the frontend (`ExpenseForm.jsx`, instant feedback) and the backend (`serializers.py`, authoritative check):

- Title is required, minimum 2 characters.
- Amount is required, must be numeric, and must be greater than 0.
- Category must be one of the predefined choices.
- Payment method must be one of the predefined choices.
- Expense date is required and must be a valid date.
- Description is optional but capped at 500 characters.

Backend validation always runs regardless of what the frontend does, since the frontend can never be fully trusted.

## 13. Testing

- **Unit/API tests**: `backend/expenses/tests.py` contains automated tests for create/read/update/delete and validation, runnable with:
  ```bash
  python manage.py test
  ```
- **Manual API testing**: see `API_DOCUMENTATION.md` for full Postman instructions and a test case table covering valid/invalid inputs for every endpoint.
- **Manual UI testing**: use the demonstration flow in Section 17 below.

## 14. Installation

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- MySQL Server 8+ (optional — SQLite works out of the box)
- Git

### 14.1 Backend Installation

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Copy the example environment file and edit as needed:

```bash
# Windows
copy .env.example .env
# macOS/Linux
cp .env.example .env
```

By default `.env` has `DB_ENGINE=sqlite`, so the app runs immediately with **no MySQL setup required**.

### 14.2 MySQL Setup (optional, recommended for DBMS submission)

1. Install and start MySQL Server.
2. Log in to MySQL and create the database:
   ```sql
   CREATE DATABASE expense_tracker CHARACTER SET utf8mb4;
   ```
3. In `backend/.env`, set:
   ```
   DB_ENGINE=mysql
   DB_NAME=expense_tracker
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306
   ```
4. Make sure `mysqlclient` installed correctly (it requires MySQL client development headers on some systems — on Windows, installing MySQL Server/Workbench normally provides these).

### 14.3 Switching back to SQLite

If MySQL isn't available (e.g. during a quick local demo), simply set in `.env`:
```
DB_ENGINE=sqlite
```
No other changes are needed — Django will use a local `db.sqlite3` file automatically.

### 14.4 Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 14.5 Create an Admin User (for Django Admin)

```bash
python manage.py createsuperuser
```

### 14.6 Frontend Installation

```bash
cd frontend
npm install
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux
```

`frontend/.env` should contain:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 15. Execution — How to Run

### Start the backend (Terminal 1)

```bash
cd backend
venv\Scripts\activate       # Windows (or: source venv/bin/activate on macOS/Linux)
python manage.py runserver
```
Backend runs at: `http://127.0.0.1:8000`
Admin panel: `http://127.0.0.1:8000/admin`

### Start the frontend (Terminal 2)

```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

Open `http://localhost:5173` in your browser to use the app.

## 16. API Endpoints Summary

See Section 11 above and `API_DOCUMENTATION.md` for the complete, detailed reference with sample JSON.

## 17. Demonstration Flow (suggested order for a live demo)

1. Start the Django backend.
2. Start the React frontend.
3. Open the Expense Tracker in the browser.
4. Show the Dashboard (empty state initially).
5. Add a new expense via the form (shows validation in action).
6. View it in the Expense List (and, optionally, Django Admin / DB).
7. Search for the expense by title.
8. Filter expenses by category.
9. Edit the expense and change a field.
10. Show the updated value reflected in the list and dashboard.
11. Delete the expense (confirmation dialog appears first).
12. Show it is removed from the list and dashboard totals update.
13. Open Postman and demonstrate `GET` (list + single).
14. Demonstrate `POST` (create, including a validation-error case).
15. Demonstrate `PUT`/`PATCH` (update, including a 404 for an invalid ID).
16. Demonstrate `DELETE` (204 success, then 404 on a repeated delete).
17. Show a validation error in the UI (e.g., empty title or negative amount).
18. Explain the system architecture (React → Axios → DRF → ORM → MySQL).
19. Explain the database design (table structure, primary key, data types).

## 18. Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Frontend and backend running on different ports during development | Configured `django-cors-headers` with an explicit `CORS_ALLOWED_ORIGINS` list |
| Avoiding floating-point rounding errors for money | Used `DecimalField` (backend) and fixed 2-decimal formatting (frontend) instead of native floats |
| Preventing invalid data from ever reaching the database | Implemented validation twice — client-side for UX, server-side (serializer) as the authoritative gate |
| Making the project runnable without requiring MySQL installed | Added a `DB_ENGINE` environment toggle so SQLite is used by default, with a one-line switch to MySQL |
| Keeping API calls consistent and DRY across components | Centralized all HTTP calls in a single `src/api.js` module used by every component |
| Handling a backend-down scenario gracefully | Normalized Axios errors in `api.js` and displayed a persistent "Unable to connect to the server" banner instead of letting the UI crash |

## 19. Future Enhancements

- User authentication and per-user expense accounts
- Monthly/category budgets with alerts
- Recurring expenses (subscriptions, rent, etc.)
- Exportable expense reports (PDF/Excel)
- Email notifications/reminders
- More advanced analytics and charts (trends over time, forecasts)
- Cloud deployment (e.g., Render/Railway for backend, Vercel/Netlify for frontend)
- Multi-user support with role-based access

## 20. Conclusion

This project demonstrates a complete, production-style full-stack CRUD application: a normalized relational database schema, a validated REST API built with Django REST Framework, and a responsive React frontend integrated via Axios. It satisfies the core requirements of a DBMS/full-stack practical assignment — Create, Read, Update, Delete, search, filtering, validation, error handling, and documentation — while remaining simple enough to explain and demonstrate end-to-end in a single sitting.

---

## Security Notes

- No real credentials are committed to the repository — `.env` is git-ignored and only `.env.example` (with placeholder values) is included.
- All database access goes through the Django ORM (no raw SQL built from user input), which protects against SQL injection.
- Input is validated on both the frontend and backend.
- CORS is explicitly restricted to the known frontend origin(s) rather than left wide open.

## License

This project was created for educational purposes as part of a DBMS/full-stack web application assignment.
