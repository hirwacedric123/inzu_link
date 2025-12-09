# Generated migration for MoMo payment integration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_chat_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='listingfee',
            name='payment_method',
            field=models.CharField(default='manual', help_text='Payment method: manual, momo', max_length=20),
        ),
        migrations.AddField(
            model_name='listingfee',
            name='momo_transaction_id',
            field=models.CharField(blank=True, help_text='MTN MoMo transaction reference ID', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='listingfee',
            name='momo_status',
            field=models.CharField(blank=True, help_text='MoMo payment status: PENDING, SUCCESSFUL, FAILED', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='listingfee',
            name='momo_status_checked_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]



