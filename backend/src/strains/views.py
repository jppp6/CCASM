from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Deposits, Requests, Strains, Users, Webusers, Requestedstrains
from .serializers import StrainSerializer, RequestsSerializer, RequestedStrainsSerializer


# GET for all strains
# Will return all entries in the Strain DB Table
@api_view(['GET'])
@permission_classes([AllowAny])         #This will NOT have to be changed (Also might be appreciated if theres an open API for other projects?)
def get_strain_all(request):
    strains = Strains.objects.all()
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

# Single Strain request methods
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])         #This WILL have to change once permissions are available for users
def strain_details(request, ccasm_id):
    # See if exists
    try:
        strain = Strains.objects.get(pk=ccasm_id)
    except Strains.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        seralizer = StrainSerializer(strain)
        return Response(seralizer.data)
    
    elif request.method == 'PUT':
        seralizer = StrainSerializer(strain, data=request.data)
        if seralizer.is_valid():
            seralizer.save()
            return Response(seralizer.data)
        return Response(seralizer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        strain.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([AllowAny])         #This WILL have to change once permissions are available for users
def post_strain(request):
    serializer = StrainSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# This will do the bulk upload
# This will need the django csv reader to work
# @api_view("POST")
# def post_csv(request):
#     pass

# Get all requests from users
@api_view(['GET'])
@permission_classes([AllowAny])
def get_requests_all(request):
    requested = Requests.objects.all()
    serializer = RequestsSerializer(requested, many=True)
    return Response({'requests': serializer.data})


# CRUD operations for requests from users
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])         #This WILL have to change once permissions are available for users
def requests_details(request, request_id):
    try:
        requested = Requests.objects.get(pk=request_id)
    except Requests.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RequestsSerializer(requested)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = RequestsSerializer(requested, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    elif request.method == 'DELETE':
        requested.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Post for requests from users
@api_view(['POST'])
@permission_classes([AllowAny])         #This WILL have to change once permissions are available for users
def post_request(request):
    serializer = RequestsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# This needs some work to work nice with composite primary keys
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])         #This WILL have to change once permissions are available for users
def requested_strains_details(request, request_id, ccasm_id):
    try:
        requested = Requestedstrains.objects.get(pk=request_id)
    except Requestedstrains.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RequestedStrainsSerializer(requested)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = RequestedStrainsSerializer(requested, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    elif request.method == 'DELETE':
        requested.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
