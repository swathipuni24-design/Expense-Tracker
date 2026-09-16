import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('amount', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    validators=[django.core.validators.MinValueValidator(
                        0.01, message='Amount must be greater than 0.'
                    )],
                )),
                ('category', models.CharField(
                    choices=[
                        ('Food', 'Food'),
                        ('Travel', 'Travel'),
                        ('Shopping', 'Shopping'),
                        ('Bills', 'Bills'),
                        ('Education', 'Education'),
                        ('Healthcare', 'Healthcare'),
                        ('Entertainment', 'Entertainment'),
                        ('Other', 'Other'),
                    ],
                    max_length=50,
                )),
                ('payment_method', models.CharField(
                    choices=[
                        ('Cash', 'Cash'),
                        ('Credit Card', 'Credit Card'),
                        ('Debit Card', 'Debit Card'),
                        ('UPI', 'UPI'),
                        ('Bank Transfer', 'Bank Transfer'),
                    ],
                    max_length=50,
                )),
                ('expense_date', models.DateField()),
                ('description', models.TextField(blank=True, max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Expense',
                'verbose_name_plural': 'Expenses',
                'ordering': ['-expense_date', '-created_at'],
            },
        ),
    ]
