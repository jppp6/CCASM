from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view



from .models import Deposits, Requests, Strains, Users, Webusers
from .serializers import StrainSerializer,DepositsSerializer, RequestsSerializer
#Not sure if the following was the right approach (did not use rest_framework)

# Create your views here.
# class StrainsViewSet(viewsets.ModelViewSet):
#     queryset = Strains.objects.all()
#     serializer_class = StrainsSerializer

def get_strain_collection(request):
    strains = Strains.objects.filter(visible=True)
    serializer = StrainSerializer(strains, many=True)
    return JsonResponse({'strains': serializer.data}, safe=False)

def get_strain_deposits(request):
    strain_deposits = Deposits.objects.all()
    serializer = DepositsSerializer(strain_deposits, many=True)
    return JsonResponse({'deposits': serializer.data}, safe=False)

def get_strain_requests(request):
    strain_requests = Requests.objects.all()
    serializer = RequestsSerializer(strain_requests, many=True)
    return JsonResponse({'requests': serializer.data}, safe=False)

# @api_view("POST")
# def post_strain(request):
#     pass