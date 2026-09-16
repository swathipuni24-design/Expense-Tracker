from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Expense


class ExpenseCRUDTests(APITestCase):
    """Basic CRUD + validation smoke tests for the Expense API."""

    def setUp(self):
        self.expense = Expense.objects.create(
            title='Groceries',
            amount=Decimal('500.00'),
            category='Food',
            payment_method='Cash',
            expense_date='2025-01-01',
            description='Weekly groceries',
        )
        self.list_url = reverse('expense-list')

    def test_list_expenses(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_expense_valid(self):
        payload = {
            'title': 'Movie night',
            'amount': '450.00',
            'category': 'Entertainment',
            'payment_method': 'UPI',
            'expense_date': '2025-01-05',
            'description': 'Watched a movie',
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_expense_missing_title(self):
        payload = {
            'amount': '450.00',
            'category': 'Entertainment',
            'payment_method': 'UPI',
            'expense_date': '2025-01-05',
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_expense_negative_amount(self):
        payload = {
            'title': 'Bad expense',
            'amount': '-100.00',
            'category': 'Other',
            'payment_method': 'Cash',
            'expense_date': '2025-01-05',
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_invalid_id(self):
        url = reverse('expense-detail', args=[99999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_expense(self):
        url = reverse('expense-detail', args=[self.expense.id])
        response = self.client.patch(url, {'amount': '600.00'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_expense(self):
        url = reverse('expense-detail', args=[self.expense.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
