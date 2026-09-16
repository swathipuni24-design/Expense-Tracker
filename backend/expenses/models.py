from django.core.validators import MinValueValidator
from django.db import models


class Expense(models.Model):
    """
    Represents a single expense record.

    id (PK)          -> auto-generated BigAutoField primary key
    title            -> short name of the expense
    amount           -> monetary value, must be > 0
    category         -> one of CATEGORY_CHOICES
    payment_method   -> one of PAYMENT_METHOD_CHOICES
    expense_date     -> the date the expense occurred
    description      -> optional longer text description
    created_at       -> timestamp when the record was created
    updated_at       -> timestamp when the record was last updated
    """

    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Travel', 'Travel'),
        ('Shopping', 'Shopping'),
        ('Bills', 'Bills'),
        ('Education', 'Education'),
        ('Healthcare', 'Healthcare'),
        ('Entertainment', 'Entertainment'),
        ('Other', 'Other'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('UPI', 'UPI'),
        ('Bank Transfer', 'Bank Transfer'),
    ]

    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=100)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01, message='Amount must be greater than 0.')],
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    expense_date = models.DateField()
    description = models.TextField(blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def __str__(self):
        return f'{self.title} - ₹{self.amount} ({self.category})'
