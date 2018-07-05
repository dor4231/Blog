from django.db import models


class Request(models.Model):
    domain = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    ipr = models.BooleanField()
    account_id = models.IntegerField()
    data = models.TextField
    sent_at = models.DateTimeField(auto_now_add=True)
