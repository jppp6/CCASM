from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.decorators import permission_classes
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
    strains = Strains.objects.all()
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

@api_view(["POST"])
@permission_classes([permissions.AllowAny])   # I need to talk about this
def post_deposit(request):
    serializer = DepositsSerializer(data=request.data)
    if serializer.is_valid():
        #serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])   # I need to talk about this
def get_post_request(request):
    serializer = RequestsSerializer(data=request.data)
    if serializer.is_valid():
        #serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view("POST")
# def post_strain(request):
#     pass