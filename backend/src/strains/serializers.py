from .models import Strains
from rest_framework.serializers import ModelSerializer

class StrainSerializer(ModelSerializer):
    class Meta:
        model = Strains
        fields = '__all__'

#TODO: add remaining views in serializer as above


