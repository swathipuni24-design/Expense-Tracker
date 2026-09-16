from django.db.models import Sum, Q
from django_filters import rest_framework as django_filters
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseFilter(django_filters.FilterSet):
    """
    Enables filtering the expense list by category, payment method,
    a date range and an amount range via query parameters, e.g.:

    /api/expenses/?category=Food
    /api/expenses/?payment_method=UPI
    /api/expenses/?date_from=2025-01-01&date_to=2025-01-31
    /api/expenses/?min_amount=100&max_amount=5000
    """

    date_from = django_filters.DateFilter(field_name='expense_date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='expense_date', lookup_expr='lte')
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')

    class Meta:
        model = Expense
        fields = ['category', 'payment_method', 'date_from', 'date_to', 'min_amount', 'max_amount']


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    A ViewSet that provides the complete set of CRUD REST endpoints
    for Expense records, plus search, filtering and a dashboard
    summary endpoint.

    GET    /api/expenses/            -> list all expenses (200)
    POST   /api/expenses/            -> create a new expense (201 / 400)
    GET    /api/expenses/{id}/       -> retrieve one expense (200 / 404)
    PUT    /api/expenses/{id}/       -> full update (200 / 400 / 404)
    PATCH  /api/expenses/{id}/       -> partial update (200 / 400 / 404)
    DELETE /api/expenses/{id}/       -> delete (204 / 404)
    GET    /api/expenses/summary/    -> dashboard summary (200)
    """

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ExpenseFilter
    search_fields = ['title', 'category', 'description']
    ordering_fields = ['expense_date', 'amount', 'created_at', 'title']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_create(serializer)
        return Response(
            {'success': True, 'message': 'Expense created successfully.', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_update(serializer)
        return Response(
            {'success': True, 'message': 'Expense updated successfully.', 'data': serializer.data},
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {'success': True, 'message': 'Expense deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Returns dashboard data: total spent, number of expenses,
        the highest single expense, and a category-wise breakdown.
        Respects the same filters as the list endpoint.
        """
        queryset = self.filter_queryset(self.get_queryset())

        total_amount = queryset.aggregate(total=Sum('amount'))['total'] or 0
        total_count = queryset.count()

        highest_expense = queryset.order_by('-amount').first()
        highest_data = ExpenseSerializer(highest_expense).data if highest_expense else None

        category_summary = {}
        category_totals = queryset.values('category').annotate(total=Sum('amount'))
        for entry in category_totals:
            category_summary[entry['category']] = entry['total']

        return Response(
            {
                'total_amount': total_amount,
                'total_count': total_count,
                'highest_expense': highest_data,
                'category_summary': category_summary,
            },
            status=status.HTTP_200_OK,
        )
