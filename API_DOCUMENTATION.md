# API Documentation & Postman Testing Guide

Base URL (local development):

```
http://127.0.0.1:8000/api
```

All endpoints are served by Django REST Framework and return JSON.

---

## 1. Endpoint Summary

| Operation      | Method      | Endpoint                    | Success Status |
|----------------|-------------|------------------------------|-----------------|
| Create expense | POST        | `/api/expenses/`             | 201 Created |
| List expenses  | GET         | `/api/expenses/`             | 200 OK |
| Retrieve one   | GET         | `/api/expenses/{id}/`        | 200 OK |
| Update (full)  | PUT         | `/api/expenses/{id}/`        | 200 OK |
| Update (part.) | PATCH       | `/api/expenses/{id}/`        | 200 OK |
| Delete         | DELETE      | `/api/expenses/{id}/`        | 204 No Content |
| Dashboard data | GET         | `/api/expenses/summary/`     | 200 OK |

Query parameters supported on `GET /api/expenses/` and `GET /api/expenses/summary/`:

| Parameter        | Description                              | Example |
|-------------------|------------------------------------------|---------|
| `search`          | Search title, category, description      | `?search=coffee` |
| `category`        | Filter by exact category                 | `?category=Food` |
| `payment_method`  | Filter by exact payment method            | `?payment_method=UPI` |
| `date_from`       | Expenses on/after this date               | `?date_from=2025-01-01` |
| `date_to`         | Expenses on/before this date              | `?date_to=2025-01-31` |
| `min_amount`      | Minimum amount                            | `?min_amount=100` |
| `max_amount`      | Maximum amount                            | `?max_amount=5000` |
| `ordering`        | Sort by field (`amount`, `expense_date`, `title`, `created_at`; prefix `-` for descending) | `?ordering=-amount` |

---

## 2. Postman Setup

1. Open Postman and create a new Collection called **Expense Tracker API**.
2. Create a Collection Variable `base_url` = `http://127.0.0.1:8000/api`.
3. Start the Django server (`python manage.py runserver`) before testing.
4. Set the `Content-Type` header to `application/json` for POST/PUT/PATCH requests.

---

## 3. CREATE — `POST {{base_url}}/expenses/`

### ✅ Valid request → `201 Created`

**Body (raw JSON):**
```json
{
  "title": "Grocery Shopping",
  "amount": "1250.50",
  "category": "Food",
  "payment_method": "UPI",
  "expense_date": "2025-01-15",
  "description": "Weekly groceries from the supermarket"
}
```

**Expected response:**
```json
{
  "success": true,
  "message": "Expense created successfully.",
  "data": {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": "1250.50",
    "category": "Food",
    "payment_method": "UPI",
    "expense_date": "2025-01-15",
    "description": "Weekly groceries from the supermarket",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

### ❌ Missing title → `400 Bad Request`

**Body:**
```json
{
  "amount": "500",
  "category": "Food",
  "payment_method": "Cash",
  "expense_date": "2025-01-15"
}
```

**Expected response:**
```json
{
  "success": false,
  "errors": {
    "title": ["This field is required."]
  }
}
```

### ❌ Invalid amount → `400 Bad Request`

**Body:**
```json
{
  "title": "Bad Expense",
  "amount": "-100",
  "category": "Other",
  "payment_method": "Cash",
  "expense_date": "2025-01-15"
}
```

**Expected response:**
```json
{
  "success": false,
  "errors": {
    "amount": ["Amount must be greater than 0."]
  }
}
```

---

## 4. READ

### Get all expenses → `GET {{base_url}}/expenses/` → `200 OK`

Returns a JSON array of all expense objects (filtered/searched if query params are supplied).

### Get one expense (valid ID) → `GET {{base_url}}/expenses/1/` → `200 OK`

```json
{
  "id": 1,
  "title": "Grocery Shopping",
  "amount": "1250.50",
  "category": "Food",
  "payment_method": "UPI",
  "expense_date": "2025-01-15",
  "description": "Weekly groceries from the supermarket",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### Get one expense (invalid ID) → `GET {{base_url}}/expenses/99999/` → `404 Not Found`

```json
{
  "detail": "Not found."
}
```

---

## 5. UPDATE — `PUT` / `PATCH {{base_url}}/expenses/{id}/`

### ✅ Valid ID, valid data → `200 OK`

**PATCH Body:**
```json
{
  "amount": "1500.00",
  "description": "Updated groceries amount"
}
```

**Expected response:**
```json
{
  "success": true,
  "message": "Expense updated successfully.",
  "data": {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": "1500.00",
    "category": "Food",
    "payment_method": "UPI",
    "expense_date": "2025-01-15",
    "description": "Updated groceries amount",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

### ❌ Invalid ID → `404 Not Found`

`PATCH {{base_url}}/expenses/99999/` → `{"detail": "Not found."}`

### ❌ Invalid data → `400 Bad Request`

**Body:**
```json
{ "amount": "0" }
```

```json
{
  "success": false,
  "errors": {
    "amount": ["Amount must be greater than 0."]
  }
}
```

---

## 6. DELETE — `DELETE {{base_url}}/expenses/{id}/`

### ✅ Valid ID → `204 No Content`

No response body. The record is removed from the database.

### ❌ Invalid ID → `404 Not Found`

```json
{
  "detail": "Not found."
}
```

---

## 7. Dashboard Summary — `GET {{base_url}}/expenses/summary/`

```json
{
  "total_amount": "25450.00",
  "total_count": 42,
  "highest_expense": {
    "id": 7,
    "title": "Laptop Repair",
    "amount": "7000.00",
    "category": "Other",
    "payment_method": "Credit Card",
    "expense_date": "2025-01-10",
    "description": "",
    "created_at": "2025-01-10T09:00:00Z",
    "updated_at": "2025-01-10T09:00:00Z"
  },
  "category_summary": {
    "Food": "5000.00",
    "Travel": "7000.00",
    "Shopping": "4500.00",
    "Bills": "6000.00",
    "Education": "2950.00"
  }
}
```

This endpoint also accepts the same `search`/filter query parameters as the list endpoint, so the dashboard can reflect a filtered view.

---

## 8. Search & Filter examples

| Goal | Request |
|------|---------|
| Search for "coffee" | `GET {{base_url}}/expenses/?search=coffee` |
| Filter by category "Travel" | `GET {{base_url}}/expenses/?category=Travel` |
| Filter by payment method "UPI" | `GET {{base_url}}/expenses/?payment_method=UPI` |
| Filter by date range | `GET {{base_url}}/expenses/?date_from=2025-01-01&date_to=2025-01-31` |
| Filter by amount range | `GET {{base_url}}/expenses/?min_amount=500&max_amount=5000` |
| Combine filters | `GET {{base_url}}/expenses/?category=Food&payment_method=Cash&min_amount=100` |

---

## 9. Test Case Table

| Test Case         | Input                    | Expected Result       |
|--------------------|---------------------------|------------------------|
| Add valid expense  | Valid JSON body           | 201, expense created  |
| Empty title        | `title: ""`               | 400, validation error |
| Invalid amount     | `amount: -100`             | 400, validation error |
| View expenses      | `GET /api/expenses/`      | 200, list displayed   |
| Edit expense       | Valid ID + valid body     | 200, expense updated  |
| Delete expense     | Valid ID                  | 204, expense deleted  |
| Invalid ID         | `/api/expenses/99999/`    | 404, not found error  |
| Search             | `?search=<existing title>`| 200, matching result  |
| Filter              | `?category=Food`          | 200, filtered results |

---

## 10. Error Handling Reference

| Scenario                  | HTTP Status | Response body |
|----------------------------|-------------|----------------|
| Validation failure          | 400 | `{"success": false, "errors": {...}}` |
| Resource not found          | 404 | `{"detail": "Not found."}` |
| Successful creation         | 201 | `{"success": true, "message": "...", "data": {...}}` |
| Successful update           | 200 | `{"success": true, "message": "...", "data": {...}}` |
| Successful deletion         | 204 | *(empty body)* |
| Successful read             | 200 | Expense object / array |

The React frontend catches all of the above via a centralized Axios error handler in `src/api.js` and displays user-friendly notifications instead of crashing.
