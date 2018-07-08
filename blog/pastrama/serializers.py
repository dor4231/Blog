from rest_framework import serializers

from .models import Request


class PastramaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'