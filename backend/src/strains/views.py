from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from django.http import JsonResponse
from django.db.models import Count, Func, F, Value
import json
from django.core.mail import send_mail
from django.conf import settings

from .models import Deposits, Requests, Strains
from .serializers import *


# Token generation
class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


# GENERAL USERS:
get_by_location_columns = ['longitude', 'latitude', 'isolation_soil_province']
@api_view(["GET"])
@permission_classes([AllowAny])
def get_by_location(request):
    strains = Strains.objects.filter(visible=True).values(*get_by_location_columns)
    return JsonResponse({"data": list(strains)})

# GET collection for any user
# This is used in the browse page
get_collection_columns = ['ccasm_id', 'strain_name', 'binomial_classification', 'taxonomic_lineage', 'risk_group', 'is_plant_pathogen', 'colony_morphology', 'host_plant_species', 'isolation_source', 'isolation_year', 'isolation_protocol', 'isolation_growth_medium', 'isolation_growth_temperature', 'isolation_growth_medium_composition', 'isolation_soil_ph', 'isolation_soil_organic_matter', 'isolation_soil_texture', 'isolation_soil_province', 'genome_ncbi_association', 'genome_size', 'notes', 'citation', 'photo']
@api_view(["GET"])
@permission_classes([AllowAny])
def get_collection(request):
    strains = Strains.objects.filter(visible=True).values(*get_collection_columns)
    return JsonResponse({"strains": list(strains)})


# POST new deposit for any user
# This is used in the deposit page
@api_view(["POST"])
@permission_classes([AllowAny])
def post_deposit(request):
    # Use the serializer to match request data
    serializer = DepositsSerializer(data=request.data)

    if serializer.is_valid():

        # Get the variables to build message
        first_name = serializer.validated_data.get("first_name")
        last_name = serializer.validated_data.get("last_name")
        email = serializer.validated_data.get("email")
        message = serializer.validated_data.get("message")
        affiliation = serializer.validated_data.get("affiliation")

        # Build email message
        email_message = (
            f"\nYou have a deposit request from {first_name} {last_name}\n\n"
        )
        email_message += f"email: {email}\n\n"
        email_message += f"Affiliation: {affiliation}\n\n"
        email_message += f"Message: {message}\n\n"

        # Sent the email
        send_mail(
            subject="CCASM Deposit Notification",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=["ccasm.collection@gmail.com"],
        )

        # Save to database
        serializer.save()

        # Success Response
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

    # Error Response
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST new request for any user
# This is used in the cart page
@api_view(["POST"])
@permission_classes([AllowAny])
def post_request(request):
    # Use the serializer to match request data
    serializer = RequestsSerializer(data=request.data)

    if serializer.is_valid():

        # Get the variables to build message
        first_name = serializer.validated_data.get("first_name")
        last_name = serializer.validated_data.get("last_name")
        email = serializer.validated_data.get("email")
        strains_requested = serializer.validated_data.get("strains_requested")
        message = serializer.validated_data.get("message")
        affiliation = serializer.validated_data.get("affiliation")

        # Build email message
        email_message = f"\nYou have a strain request from {first_name} {last_name}\n\n"
        email_message += f"They are requesting Strains ID: {strains_requested}\n\n"
        email_message += f"email: {email}\n\n"
        email_message += f"Affiliation: {affiliation}\n\n"
        email_message += f"Message: {message}\n\n"

        # Sent the email
        send_mail(
            subject="CCASM Request Notification",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=["ccasm.collection@gmail.com"],
        )

        # Save to database
        serializer.save()

        # Success Response
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

    # Error Response
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
        return JsonResponse({"status": True}, status=status.HTTP_201_CREATED)
    return JsonResponse({"status": False}, status=status.HTTP_400_BAD_REQUEST)


# PUT to update a strain
# This is used in the admin collection tab
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def admin_update_strain(request, pk):
    try:
        strain = Strains.objects.get(pk=pk)
    except Strains.DoesNotExist:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)

    serializer = StrainSerializer(strain, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'status': True}, status=status.HTTP_200_OK)
    
    return JsonResponse({'status': False}, status=status.HTTP_400_BAD_REQUEST)

# DELETE to remove a strain
# This is used in the admin collection tab
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def admin_delete_strain(request, pk):
    try:
        strain = Strains.objects.get(pk=pk)
        strain.delete()
        return JsonResponse({"status": True}, status=status.HTTP_200_OK)
    except Strains.DoesNotExist:
        return JsonResponse({"status": False}, status=status.HTTP_400_BAD_REQUEST)




# DEPOSITS


# GET for deposited strains
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_get_deposits(request):
    deposits = Deposits.objects.all().order_by('-deposit_creation_date')
    serializer = DepositsSerializer(deposits, many=True)
    return JsonResponse({"deposits": serializer.data})


# PUT to update deposited strains status
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def admin_update_deposit(request, pk):
    try:
        deposit = Deposits.objects.get(pk=pk)
    except Deposits.DoesNotExist:
        return JsonResponse({'status': False}, status=status.HTTP_400_BAD_REQUEST)

    serializer = DepositsSerializer(deposit, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'status': True}, status=status.HTTP_200_OK)
    
    return JsonResponse({'status': False}, status=status.HTTP_400_BAD_REQUEST)


# DELETE to remove a deposit
# This is used in the admin collection tab
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def admin_delete_deposit(request, pk):
    try:
        deposit = Deposits.objects.get(pk=pk)
        deposit.delete()
        return JsonResponse({"status": True})
    except Deposits.DoesNotExist:
        return JsonResponse({"status": False})


# REQUESTS


# GET for requested strains
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_get_requests(request):
    reqs = Requests.objects.all().order_by('-request_creation_date')
    serializer = RequestsSerializer(reqs, many=True)
    return JsonResponse({"requests": serializer.data})


# PUT to update requested strains
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def admin_update_request(request, pk):
    try:
        req = Requests.objects.get(pk=pk)
    except Requests.DoesNotExist:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)

    serializer = RequestsSerializer(req, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'status': True}, status=status.HTTP_200_OK)
    
    return JsonResponse({'status': False}, status=status.HTTP_400_BAD_REQUEST)

# DELETE to remove a request
# This is used in the admin collection tab
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def admin_delete_request(request, pk):
    try:
        r = Requests.objects.get(pk=pk)
        r.delete()
        return JsonResponse({"status": True})
    except Requests.DoesNotExist:
        return JsonResponse({"status": False})


# STATISTICS
    
# Generates the view based ona given province, terriroty or geographical location
@api_view(["GET"])
@permission_classes([AllowAny])
def get_strains_by_province(request):
    province_counts = (
        Strains.objects.exclude(isolation_soil_province__isnull=True)
        .exclude(isolation_soil_province__exact="")
        .values("isolation_soil_province")
        .annotate(strain_count=Count("ccasm_id"))
    )
    serializer = StrainByProvinceSerializer(province_counts, many=True)
    return JsonResponse({"provinces": serializer.data})


@api_view(["GET"])
@permission_classes([AllowAny])
def get_strains_by_plant(request):
    plants = (
        Strains.objects.exclude(host_plant_species__isnull=True)
        .exclude(host_plant_species__exact="")
        .values("host_plant_species")
        .annotate(strain_count=Count("ccasm_id"))
    )
    serializer = StrainByHostPlantSerializer(plants, many=True)
    return JsonResponse({"plants": serializer.data})


@api_view(["GET"])
@permission_classes([AllowAny])
def get_strains_by_isolation_protocol(request):
    # Group strains by isolation protocol and count the number of strains for each protocol
    strains_by_protocol = (
        Strains.objects.exclude(isolation_protocol__isnull=True)
        .exclude(isolation_protocol__exact="")
        .values("isolation_protocol")
        .annotate(strain_count=Count("ccasm_id"))
    )
    serializer = IsolationProtocolSerializer(strains_by_protocol, many=True)
    return JsonResponse({"protocol": serializer.data})


""" @api_view(['GET']) 
@permission_classes([AllowAny]) 
def get_strains_by_kingdom_level(request):
    taxonomic_data = (
        Strains.objects
        .annotate(taxonomic_level=Func(F('taxonomic_lineage'), Value(';'), Value('0')))
        .values('taxonomic_level')
        .annotate(strain_count=Count('ccasm_id'))
    )

    serializer = TaxonomicDataSerializer(data=taxonomic_data, many=True)
    # serializer.is_valid(raise_exception=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET']) 
@permission_classes([AllowAny]) 
def get_strains_by_phylum_level(request):
    taxonomic_data = (
        Strains.objects
        .annotate(taxonomic_level=Func(F('taxonomic_lineage'), Value(';'), Value('1')))
        .values('taxonomic_level')
        .annotate(strain_count=Count('ccasm_id'))
    )

    serializer = TaxonomicDataSerializer(data=taxonomic_data, many=True)
    # serializer.is_valid(raise_exception=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET']) 
@permission_classes([AllowAny]) 
def get_strains_by_class_level(request):
    taxonomic_data = (
        Strains.objects
        .annotate(taxonomic_level=Func(F('taxonomic_lineage'), Value(';'), Value('2')))
        .values('taxonomic_level')
        .annotate(strain_count=Count('ccasm_id'))
    )

    serializer = TaxonomicDataSerializer(data=taxonomic_data, many=True)
    # serializer.is_valid(raise_exception=True)
    return JsonResponse(serializer.data, safe=False)



@api_view(['GET']) 
@permission_classes([AllowAny]) 
def get_strains_by_order_level(request):
    taxonomic_data = (
        Strains.objects
        .annotate(taxonomic_level=Func(F('taxonomic_lineage'), Value(';'), Value('3')))
        .values('taxonomic_level')
        .annotate(strain_count=Count('ccasm_id'))
    )

    serializer = TaxonomicDataSerializer(data=taxonomic_data, many=True)
    # serializer.is_valid(raise_exception=True)
    return JsonResponse(serializer.data, safe=False)



@api_view(['GET']) 
@permission_classes([AllowAny]) 
def get_strains_by_family_level(request):
    taxonomic_data = (
        Strains.objects
        .annotate(taxonomic_level=Func(F('taxonomic_lineage'), Value(';'), Value('4')))
        .values('taxonomic_level')
        .annotate(strain_count=Count('ccasm_id'))
    )

    serializer = TaxonomicDataSerializer(data=taxonomic_data, many=True)
    # serializer.is_valid(raise_exception=True)
    return JsonResponse(serializer.data, safe=False)



@api_view(['GET']) 
@permission_classes([AllowAny]) 
def get_strains_by_genus_level(request):
    taxonomic_data = (
        Strains.objects
        .annotate(taxonomic_level=Func(F('taxonomic_lineage'), Value(';'), Value('5')))
        .values('taxonomic_level')
        .annotate(strain_count=Count('ccasm_id'))
    )

    serializer = TaxonomicDataSerializer(data=taxonomic_data, many=True)
    # serializer.is_valid(raise_exception=True)
    return JsonResponse(serializer.data, safe=False) """


# TODO stats for (i) number of people who have deposited to the collection;
# (ii) number of strain requests fulfilled; and
# (iii) number of citations. For these simple stats,
# I think it is best to just have them as short sentences,
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
