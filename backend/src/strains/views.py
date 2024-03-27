from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from django.http import JsonResponse
from django.db.models import Count, Q

from .models import Deposits, Requests, Strains
from .serializers import *
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
@permission_classes([IsAuthenticated]) 
def admin_add_single_strain(request):
    serializer = StrainSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({"result": "success"}, status=status.HTTP_201_CREATED)
    return JsonResponse({"result": "error"}, status=status.HTTP_400_BAD_REQUEST)


# POST add new strains for admins
# This is used in the admin collection tab
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_add_bulk_strain(request):
    # Decode the body to json for parsing
    upload = request.data["strains"]
    for i in upload:
        serializer = StrainSerializer(data=i)
        if serializer.is_valid():
            serializer.save()
    return JsonResponse({"result": "success"}, status=status.HTTP_201_CREATED)


# PUT to update a strain
# This is used in the admin collection tab
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def admin_update_strain(request, pk):
    try:
        strain = Strains.objects.get(pk=pk)
    except Strains.DoesNotExist:
        return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    serializer = StrainSerializer(strain, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)


# DEPOSITS


# GET for deposited strains
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_get_deposits(request):
    deposits = Deposits.objects.all()
    serializer = DepositsSerializer(deposits, many=True)
    return JsonResponse({"deposits": serializer.data})


# PUT to update deposited strains status
@api_view(["PUT"])
# PUT to update deposited strains status
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_deposit(request, pk):
    try:
        deposit = Deposits.objects.get(pk=pk)
    except Deposits.DoesNotExist:
        return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    serializer = DepositsSerializer(deposit, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)


# REQUESTS


# GET for requested strains
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_get_requests(request):
    reqs = Requests.objects.all()
    serializer = RequestsSerializer(reqs, many=True)
    return JsonResponse({"requests": serializer.data})
    reqs = Requests.objects.all()
    serializer = RequestsSerializer(reqs, many=True)
    return JsonResponse({'requests': serializer.data})


# PUT to update requested strains
@api_view(["PUT"])
# PUT to update requested strains
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_request(request, pk):
    try:
        req = Requests.objects.get(pk=pk)
    except Requests.DoesNotExist:
        return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    serializer = RequestsSerializer(req, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)


# Generates the view based ona given province, terriroty or geographical location
@api_view(['GET'])
@permission_classes([AllowAny])  
def get_strains_by_province(request):
    province_counts = (
        Strains.objects.exclude(isolation_soil_province__isnull=True)
        .exclude(isolation_soil_province__exact='')
        .values('isolation_soil_province').annotate(strain_count=Count('ccasm_id'))
    )
    serializer = StrainByProvinceSerializer(province_counts, many=True)
    return JsonResponse({'provinces': serializer.data})


@api_view(['GET']) #TODO find an efficient way to do this
@permission_classes([AllowAny]) 
def get_strains_by_taxonomic_level(request):
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

    """ if taxonomic_level < 0 or taxonomic_level >= len(TAXONOMIC_LEVEL):
        return JsonResponse({"error": "Invalid taxonomic level"}, status=status.HTTP_400_BAD_REQUEST) """
    
    strains = Strains.objects.values('taxonomic_lineage') 
    # strains is now a list of dictionaries structured like so:
    # [
    #   {'taxonomic_lineage': 'Kingdom;Phylum;Class;Order;Family;Genus;Species'},
    #   {'taxonomic_lineage': 'Kingdom;Phylum;Class;Order;Family;Genus;Species'},
    #   {'taxonomic_lineage': 'Kingdom;Phylum;Class;Order;Family;Genus;Species'},
    # More rows...
    # ]
    # an example taxonomic lineage is of the following :
    # 'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium anhuiense'
    total_strains = len(strains)
    print(total_strains)
    strain_lineage = []
    taxonomic_data_counts = {} # hash map with unique taxonomc lineage names as unique keys and has their occurances as the value
    for strain in strains: #iterate though each dictionary (strain) in the list of strains in the DB
        # Split the taxonomic lineage and strip whitespace, add each taxonomic level name to a list
        # e.g. output of tax_lineage = [Bacteria,Pseudomonadota,Alphaproteobacteria,Hyphomicrobiales,Rhizobiaceae,Rhizobium,Rhizobium anhuiense] as str
        tax_lineage_list = [level.strip() for level in strain['taxonomic_lineage'].split(';')]
        if len(tax_lineage_list) != 7:
            continue
        strain_lineage.append(tax_lineage_list)
        
    # convert the strain lineage lists to dictionaries with counts of each linneage name
    for tax_list in strain_lineage:

        for taxonomic_name in tax_list:
            if taxonomic_name not in taxonomic_data_counts.keys():
                taxonomic_data_counts[taxonomic_name] = 0
            else:
                taxonomic_data_counts[taxonomic_name] += 1
    

    print(tax_lineage_list)

    return JsonResponse(taxonomic_data_counts, safe=False)


@api_view(['GET']) #TODO find an efficient way to do this
@permission_classes([AllowAny])
def get_strains_by_plant(request):
    plants = (
        Strains.objects.exclude(host_plant_species__isnull=True)
        .exclude(host_plant_species__exact='')
        .values('host_plant_species')
        .annotate(strain_count=Count('ccasm_id'))
    )
    serializer = StrainByHostPlantSerializer(plants, many=True)
    return JsonResponse({'plants': serializer.data})

@api_view(['GET']) 
@permission_classes([AllowAny])
def get_strains_by_isolation_protocol(request):
    # Group strains by isolation protocol and count the number of strains for each protocol
    strains_by_protocol = (
        Strains.objects.exclude(isolation_protocol__isnull=True)
            .exclude(isolation_protocol__exact='')
            .values('isolation_protocol')
            .annotate(strain_count=Count('ccasm_id'))
    )
    serializer = IsolationProtocolSerializer(strains_by_protocol, many=True)
    return JsonResponse({'protocol': serializer.data})

#TODO stats for (i) number of people who have deposited to the collection; 
#(ii) number of strain requests fulfilled; and 
#(iii) number of citations. For these simple stats, 
#I think it is best to just have them as short sentences,
# and for the stats to be manually updated.
    
""" @api_view(['GET']) 
@permission_classes([AllowAny])
def get_strains_per_isolation_protocol(request):
    # Group strains by isolation protocol and count the number of strains for each protocol
    strains_by_protocol = (
        Strains.objects.exclude(isolation_protocol__isnull=True)
            .exclude(isolation_protocol__exact='')
            .values('isolation_protocol')
            .annotate(strain_count=Count('ccasm_id'))
            .order_by('isolation_protocol')
    )

    # Structure the data into a list of dictionaries
    isolation_protocol_data = [
        {'name': strain['isolation_protocol'], 'value': strain['strain_count']}
        for strain in strains_by_protocol
    ]

    # Return the data as JSON response
    return JsonResponse({'protocol': isolation_protocol_data}) """