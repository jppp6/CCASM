from .models import Strains, Requests, Requestedstrains
from rest_framework.serializers import ModelSerializer

class StrainSerializer(ModelSerializer):
    class Meta:
        model = Strains
        fields = '__all__'

class RequestsSerializer(ModelSerializer):
    class Meta:
        model = Requests
        fields = '__all__'

class RequestedStrainsSerializer(ModelSerializer):
    class Meta:
        model = Requestedstrains
        fields = '__all__'

#TODO: add remaining views in serializer as above