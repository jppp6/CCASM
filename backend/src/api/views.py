from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view



from .models import Deposits, Requests, Strains, Users, Webusers
from .serializers import StrainSerializer
#Not sure if the following was the right approach (did not use rest_framework)

# Create your views here.
# class StrainsViewSet(viewsets.ModelViewSet):
#     queryset = Strains.objects.all()
#     serializer_class = StrainsSerializer

@api_view("GET")
def get_strain(request):
    strains = Strains.objects.all()
    serializer = StrainSerializer(strains, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view("POST")
def post_strain(request):
    pass