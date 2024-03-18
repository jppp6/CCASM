from .models import Strains, Deposits, Requests
from rest_framework.serializers import ModelSerializer

class StrainSerializer(ModelSerializer):
    class Meta:
        model = Strains
        fields = '__all__'

class DepositsSerializer(ModelSerializer):
    class Meta:
        model = Deposits
        fields = '__all__'

class RequestsSerializer(ModelSerializer):
    class Meta:
        model = Requests
        fields = '__all__'


#TODO: add remaining views in serializer as above


