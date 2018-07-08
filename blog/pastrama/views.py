from django.shortcuts import render

from .models import Request
from .serializers import RequestSerializer
from rest_framework import generics


class RequestListCreate(generics.ListCreateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
