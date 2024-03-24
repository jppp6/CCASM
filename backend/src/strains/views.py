from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from django.http import JsonResponse

from .models import Deposits, Requests, Strains
from .serializers import StrainSerializer, DepositsSerializer, RequestsSerializer, MyTokenObtainPairSerializer
import json

# Token generation
class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


# GENERAL USERS:


# GET collection for any user
# This is used in the browse page
@api_view(["GET"])
@permission_classes([AllowAny]) 
def get_collection(request):
    strains = Strains.objects.filter(
        visible=True
    )  # based on whatever column decides visibility
    serializer = StrainSerializer(strains, many=True)
    return JsonResponse({"strains": serializer.data})


# POST new deposit for any user
# This is used in the deposit page
@api_view(["POST"])
@permission_classes([AllowAny])
def post_deposit(request):
    serializer = DepositsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST new request for any user
# This is used in the cart page
@api_view(["POST"])
@permission_classes([AllowAny])
def post_request(request):
    serializer = RequestsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ADMIN USERS:


# GET collection for admins
# This is used in the admin collection tab
@api_view(["GET"])
@permission_classes([IsAuthenticated])  
def admin_get_collection(request):
    strains = Strains.objects.all()
    serializer = StrainSerializer(strains, many=True)
    return JsonResponse({"strains": serializer.data})


# POST add new strain for admins
# This is used in the admin collection tab
@api_view(["POST"])
@permission_classes([IsAuthenticated]) 
def admin_add_single_strain(request):
    serializer = StrainSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)


# POST add new strains for admins
# This is used in the admin collection tab
@api_view(["POST"])
@permission_classes([IsAuthenticated]) 
def admin_add_bulk_strain(request):
    # Decode the body to json for parsing
    data = request.body.decode('utf-8')
    body = json.loads(data)
    upload = body['strains']

    for i in upload:
        serializer = StrainSerializer(data=i)
        if serializer.is_valid():
            serializer.save()

    return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

# PUT to update a strain
# This is used in the admin collection tab
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_strain(request, pk):
    try:
        strain = Strains.objects.get(pk=pk)
    except Strains.DoesNotExist:
        return JsonResponse(status= status.HTTP_404_NOT_FOUND)
    
    serializer = StrainSerializer(strain, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)

# DEPOSITS

# GET for deposited strains
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_deposits(request):
    deposits = Deposits.objects.all()
    serializer = DepositsSerializer(deposits, many=True)
    return JsonResponse({'deposits': serializer.data})

# PUT to update deposited strains status
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_deposit(request, pk):
    try:
        deposit = Deposits.objects.get(pk=pk)
    except Deposits.DoesNotExist:
        return JsonResponse(status= status.HTTP_404_NOT_FOUND)
    
    serializer = DepositsSerializer(deposit, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    

# REQUESTS

# GET for requested strains
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_requests(request):
    reqs = Requests.objects.all()
    serializer = RequestsSerializer(reqs, many=True)
    return JsonResponse({'requests': serializer.data})

# PUT to update requested strains
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_request(request, pk):
    try:
        req = Requests.objects.get(pk=pk)
    except Requests.DoesNotExist:
        return JsonResponse(status= status.HTTP_404_NOT_FOUND)
    
    serializer = RequestsSerializer(req, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    

# STATS

# Generates the view based ona given province, terriroty or geographical location
@api_view(['GET'])
def get_strains_by_province(request, province:str):

    strains = Strains.objects.filter(isolation_soil_province=province)
    serializer = StrainSerializer(strains, many=True)
    return JsonResponse(serializer.data)


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
        return JsonResponse({"error": "Invalid taxonomic level"}, status=status.HTTP_400_BAD_REQUEST)
    
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
    return JsonResponse({'strains': serializer.data})

def get_strains_isolation_protocol(request, iso_protocol:str):
    strains = Strains.objects.filter(isolation_protocol=iso_protocol)
    serializer = StrainSerializer(strains, many=True)
    return JsonResponse({'strains': serializer.data})

#TODO stats for (i) number of people who have deposited to the collection; 
#(ii) number of strain requests fulfilled; and 
#(iii) number of citations. For these simple stats, 
#I think it is best to just have them as short sentences,
# and for the stats to be manually updated.