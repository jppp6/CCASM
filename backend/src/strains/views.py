from rest_framework import status
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse

from .models import Deposits, Requests, Strains, Webusers, Requestedstrains
from .serializers import StrainSerializer, RequestsSerializer, RequestedStrainsSerializer, UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer

from django.contrib.auth.models import User

from rest_framework_simplejwt.views import TokenObtainPairView

class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# GET for all strains
# Will return all entries in the Strain DB Table
@api_view(['GET'])
@permission_classes([AllowAny])         #This will NOT have to be changed (Also might be appreciated if theres an open API for other projects?)
def get_strain_all(request):
    strains = Strains.objects.all()
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])         #This will NOT have to be changed (Also might be appreciated if theres an open API for other projects?)
def get_strain_browse(request):
    strains = Strains.objects.filter(visible=1) #based on whatever column decides visibility
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

# Single Strain request methods
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
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
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
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
@permission_classes([IsAuthenticated])
def get_requests_all(request):
    requested = Requests.objects.all()
    serializer = RequestsSerializer(requested, many=True)
    return Response({'requests': serializer.data})


# CRUD operations for requests from users
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
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
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
def post_request(request):
    serializer = RequestsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# This needs some work to work nice with composite primary keys
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
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


# Generates the view based ona given province, terriroty or geographical location
@api_view(['GET'])
def get_strains_by_province(request, province:str):

    strains = Strains.objects.filter(isolation_soil_province=province)
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})


@api_view(['GET']) #TODO find an efficient way to do this
def get_strains_by_taxonomic_level(request, taxonomic_level:int):
    """
        Retrieves strains by the number of 
        @param taxonomic_level : int: starting from 0, ending at 6
                corresponds to :
                kingdom - 0
                phylum - 1
                class - 2
                order - 3
                family - 4
                genus - 5
                species - 6
                
    """
    TAXONOMIC_LEVEL = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']

    if taxonomic_level < 0 or taxonomic_level >= len(TAXONOMIC_LEVEL):
        return Response({"error": "Invalid taxonomic level"}, status=status.HTTP_400_BAD_REQUEST)
    
    strains = Strains.objects.all()
    taxonomic_data = {}
    for strain in strains:
        # Split the taxonomic lineage and strip whitespace
        tax_lineage = [level.strip() for level in strain.taxonomic_lineage.split(';')]
        if len(tax_lineage) > taxonomic_level:
            tax_level = tax_lineage[taxonomic_level]

            taxonomic_data[tax_level] = taxonomic_data.get(tax_level, 0) + 1
    
    taxonomic_data_list = [{'name': key, 'count': value} for key, value in taxonomic_data.items()]

    return JsonResponse(taxonomic_data_list, safe=False)

def get_strain_by_plant(request, plant_host:str):
    strains = Strains.objects.filter(host_plant_species=plant_host)
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

def get_strains_isolation_protocol(request, iso_protocol:str):
    strains = Strains.objects.filter(isolation_protocol=iso_protocol)
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

#TODO stats for (i) number of people who have deposited to the collection; 
#(ii) number of strain requests fulfilled; and 
#(iii) number of citations. For these simple stats, 
#I think it is best to just have them as short sentences,
# and for the stats to be manually updated.
    