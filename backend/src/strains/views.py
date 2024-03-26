from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings

from .models import Deposits, Requests, Strains
from .serializers import (
    StrainSerializer,
    DepositsSerializer,
    RequestsSerializer,
    MyTokenObtainPairSerializer,
)

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

        first_name = serializer.validated_data.get('first_name')
        last_name = serializer.validated_data.get('last_name')
        email = serializer.validated_data.get('email')
        message = serializer.validated_data.get('message')
        affiliation = serializer.validated_data.get('affiliation')
        
        email_message = f"\nYou have a deposit request from {first_name} {last_name}\n\n" 
        email_message += f"email: {email}\n\n"
        email_message += f"Affiliation: {affiliation}\n\n"
        email_message += f"Message: {message}\n\n"
        
        send_mail ( 
            subject="CCASM Deposit Notification",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['ccasm2024@gmail.com']
        )
        
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

        first_name = serializer.validated_data.get('first_name')
        last_name = serializer.validated_data.get('last_name')
        email = serializer.validated_data.get('email')
        strains_requested = serializer.validated_data.get('strains_requested')
        message = serializer.validated_data.get('message')
        affiliation = serializer.validated_data.get('affiliation')
        
        email_message = f"\nYou have a strain request from {first_name} {last_name}\n\n" 
        email_message += f"They are requesting Strains ID: {strains_requested}\n\n"
        email_message += f"email: {email}\n\n"
        email_message += f"Affiliation: {affiliation}\n\n"
        email_message += f"Message: {message}\n\n"
        
        send_mail ( 
            subject="CCASM Request Notification",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['ccasm2024@gmail.com']
        )
        
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
    return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)
