from rest_framework import status
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Deposits, Requests, Strains
from .serializers import StrainSerializer, RequestsSerializer, MyTokenObtainPairSerializer


from rest_framework_simplejwt.views import TokenObtainPairView



from rest_framework import  status
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.decorators import permission_classes
from django.http import JsonResponse
from rest_framework.decorators import api_view

from .models import Deposits, Requests, Strains
from .serializers import StrainSerializer,DepositsSerializer, RequestsSerializer
#Not sure if the following was the right approach (did not use rest_framework)


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer



# GENERAL USERS:
    
# GET collection for any user
# This is used in the browse page 
@api_view(['GET'])
@permission_classes([AllowAny])         #This will NOT have to be changed (Also might be appreciated if theres an open API for other projects?)
def get_collection(request):
    strains = Strains.objects.filter(visible=True) #based on whatever column decides visibility
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

# POST new deposit for any user
# This is used in the deposit page 
@api_view(["POST"])
@permission_classes([permissions.AllowAny])   # I need to talk about this
def post_deposit(request):
    serializer = DepositsSerializer(data=request.data)
    if serializer.is_valid():
        #serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# POST new request for any user
# This is used in the cart page 
@api_view(["POST"])
@permission_classes([permissions.AllowAny])   # I need to talk about this
def post_request(request):
    serializer = RequestsSerializer(data=request.data)
    if serializer.is_valid():
        #serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ADMIN USERS:

# GET collection for admins
# This is used in the admin collection tab
@api_view(['GET'])
@permission_classes([IsAuthenticated])         #This will NOT have to be changed (Also might be appreciated if theres an open API for other projects?)
def admin_get_collection(request):
    strains = Strains.objects.all() 
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

# POST add new strain for admins
# This is used in the admin collection tab
@api_view(['POST'])
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
def admin_add_single_strain(request):
    serializer = StrainSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# POST add new strains for admins
# This is used in the admin collection tab
@api_view(['POST'])
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
def admin_add_bulk_strain(request):
    # TODO: THIS NEEDS TO BE CHANGED FOR BULKIGN PROCESSING (its an array of strains)
    serializer = StrainSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# POST update strain for admins
# This is used in the admin collection tab
@api_view(['POST'])
@permission_classes([IsAuthenticated])         #This WILL have to change once permissions are available for users
def admin_update_strain(request):
    serializer = StrainSerializer(data=request.data)
    # make this update the DB


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_deposits(request):
    deposits = Deposits.objects.all()
    serializer = DepositsSerializer(deposits, many=True)
    return Response({'deposits': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])      
def admin_update_deposit(request):
    serializer = DepositsSerializer(data=request.data)
    # make this update the DB


@api_view(['GET'])
@permission_classes([IsAuthenticated])      
def admin_get_requests(request):
    strain_requests = Requests.objects.all()
    serializer = RequestsSerializer(strain_requests, many=True)
    return JsonResponse({'requests': serializer.data}, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])      
def admin_update_request(request):
    serializer = RequestsSerializer(data=request.data)
    # make this update the DB


