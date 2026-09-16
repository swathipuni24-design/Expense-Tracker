from decimal import Decimal, InvalidOperation

from rest_framework import serializers

from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Expense model.

    Performs server-side validation in addition to the model-level
    validators, since the frontend must never be trusted as the only
    line of defense.
    """

    class Meta:
        model = Expense
        fields = [
            'id',
            'title',
            'amount',
            'category',
            'payment_method',
            'expense_date',
            'description',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Expense title is required.')
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Expense title must be at least 2 characters long.')
        return value.strip()

    def validate_amount(self, value):
        try:
            amount = Decimal(value)
        except (InvalidOperation, TypeError):
            raise serializers.ValidationError('Amount must be numeric.')
        if amount <= 0:
            raise serializers.ValidationError('Amount must be greater than 0.')
        if amount > Decimal('99999999.99'):
            raise serializers.ValidationError('Amount is too large.')
        return value

    def validate_category(self, value):
        valid_categories = [choice[0] for choice in Expense.CATEGORY_CHOICES]
        if value not in valid_categories:
            raise serializers.ValidationError('Please select a valid category.')
        return value

    def validate_payment_method(self, value):
        valid_methods = [choice[0] for choice in Expense.PAYMENT_METHOD_CHOICES]
        if value not in valid_methods:
            raise serializers.ValidationError('Please select a valid payment method.')
        return value

    def validate_description(self, value):
        if value and len(value) > 500:
            raise serializers.ValidationError('Description cannot exceed 500 characters.')
        return value

    def validate_expense_date(self, value):
        if value is None:
            raise serializers.ValidationError('Expense date is required.')
        return value


class ExpenseSummarySerializer(serializers.Serializer):
    """Serializer used for the dashboard / category-summary endpoint."""

    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_count = serializers.IntegerField()
    highest_expense = ExpenseSerializer(allow_null=True)
    category_summary = serializers.DictField(child=serializers.DecimalField(max_digits=12, decimal_places=2))
